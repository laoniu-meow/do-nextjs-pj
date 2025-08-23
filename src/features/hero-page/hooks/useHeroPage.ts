import { useCallback, useEffect, useReducer } from 'react';
import { HeroPageApi, Section } from '../services/heroPageApi';

type State = {
  sections: Section[];
  draftSections: Section[] | null;
  isLoading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
  hasStagingData: boolean;
  isSettingsOpen: boolean;
  selectedSectionOrder: number | null;
};

type Action =
  | { type: 'SET_SECTIONS'; payload: Section[] }
  | { type: 'SET_DRAFT_SECTIONS'; payload: Section[] | null }
  | { type: 'ADD_SECTION'; payload: Section }
  | { type: 'REMOVE_SECTION'; payload: number }
  | { type: 'REORDER_SECTIONS'; payload: Section[] }
  | { type: 'UPDATE_SECTION'; payload: Section }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_UNSAVED'; payload: boolean }
  | { type: 'SET_STAGING_FLAG'; payload: boolean }
  | { type: 'OPEN_SETTINGS' }
  | { type: 'CLOSE_SETTINGS' }
  | { type: 'SET_SELECTED_ORDER'; payload: number | null };

const initialState: State = {
  sections: [],
  draftSections: null,
  isLoading: false,
  error: null,
  hasUnsavedChanges: false,
  hasStagingData: false,
  isSettingsOpen: false,
  selectedSectionOrder: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SECTIONS': {
      return { ...state, sections: action.payload };
    }
    case 'SET_DRAFT_SECTIONS': {
      return { ...state, draftSections: action.payload };
    }
    case 'ADD_SECTION': {
      // Add to draft without renumbering to preserve global order; renumber committed list
      if (state.draftSections) {
        if (state.draftSections.length >= 5) return state;
        return { ...state, draftSections: [...state.draftSections, action.payload] };
      }
      if (state.sections.length >= 5) return state;
      const nextCommitted = [...state.sections, action.payload].map((s, i) => ({ ...s, order: i + 1 }));
      return { ...state, sections: nextCommitted, hasUnsavedChanges: true };
    }
    case 'REMOVE_SECTION': {
      if (state.draftSections) {
        const nextDraft = state.draftSections.filter((s) => s.order !== action.payload);
        return { ...state, draftSections: nextDraft };
      }
      const nextCommitted = state.sections
        .filter((s) => s.order !== action.payload)
        .map((s, i) => ({ ...s, order: i + 1 }));
      return { ...state, sections: nextCommitted, hasUnsavedChanges: true };
    }
    case 'REORDER_SECTIONS': {
      if (state.draftSections) {
        // For drafts, accept the provided ordering as-is to preserve global order values
        return { ...state, draftSections: action.payload };
      }
      const nextCommitted = action.payload.map((s, i) => ({ ...s, order: i + 1 }));
      return { ...state, sections: nextCommitted, hasUnsavedChanges: true };
    }
    case 'UPDATE_SECTION': {
      const target = state.draftSections ?? state.sections;
      const next = target.map((s) => (s.order === action.payload.order ? action.payload : s));
      return state.draftSections
        ? { ...state, draftSections: next }
        : { ...state, sections: next, hasUnsavedChanges: true };
    }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_UNSAVED':
      return { ...state, hasUnsavedChanges: action.payload };
    case 'SET_STAGING_FLAG':
      return { ...state, hasStagingData: action.payload };
    case 'OPEN_SETTINGS':
      return { ...state, isSettingsOpen: true };
    case 'CLOSE_SETTINGS':
      return { ...state, isSettingsOpen: false, selectedSectionOrder: null, draftSections: null };
    case 'SET_SELECTED_ORDER':
      return { ...state, selectedSectionOrder: action.payload };
    default:
      return state;
  }
}

export function useHeroPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const sections = await HeroPageApi.getStagingSections();
        dispatch({ type: 'SET_SECTIONS', payload: sections });
        dispatch({ type: 'SET_STAGING_FLAG', payload: sections.length > 0 });
      } catch (e) {
        dispatch({ type: 'SET_ERROR', payload: e instanceof Error ? e.message : 'Failed to load hero staging' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    })();
  }, []);

  const addSection = useCallback((section: Section) => {
    dispatch({ type: 'ADD_SECTION', payload: section });
  }, []);

  const removeSection = useCallback((order: number) => {
    dispatch({ type: 'REMOVE_SECTION', payload: order });
  }, []);

  const updateSection = useCallback((section: Section) => {
    dispatch({ type: 'UPDATE_SECTION', payload: section });
  }, []);

  const reorderSections = useCallback((sections: Section[]) => {
    dispatch({ type: 'REORDER_SECTIONS', payload: sections });
  }, []);

  const openSettings = useCallback(() => dispatch({ type: 'OPEN_SETTINGS' }), []);
  const closeSettings = useCallback(() => dispatch({ type: 'CLOSE_SETTINGS' }), []);
  const setSelectedSectionOrder = useCallback((order: number | null) => {
    dispatch({ type: 'SET_SELECTED_ORDER', payload: order });
  }, []);

  const editSection = useCallback((order: number) => {
    dispatch({ type: 'SET_SELECTED_ORDER', payload: order });
    dispatch({ type: 'OPEN_SETTINGS' });
  }, []);

  const saveToStaging = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const saved = await HeroPageApi.saveStagingSections(state.sections);
      dispatch({ type: 'SET_SECTIONS', payload: saved });
      dispatch({ type: 'SET_UNSAVED', payload: false });
      dispatch({ type: 'SET_STAGING_FLAG', payload: true });
      return saved;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to save hero staging';
      dispatch({ type: 'SET_ERROR', payload: msg });
      throw e;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.sections]);

  // Begin a draft editing session for ONLY new sections.
  // Previously applied sections are not shown in the settings; we start with the next section.
  const beginDraft = useCallback(() => {
    const totalExisting = state.sections.length;
    if (totalExisting >= 5) {
      // Nothing to add; just open settings empty (or keep closed)
      dispatch({ type: 'SET_DRAFT_SECTIONS', payload: [] });
      dispatch({ type: 'OPEN_SETTINGS' });
      return;
    }

    const nextOrder = totalExisting + 1;
    const nextSection: Section = {
      order: nextOrder,
      templateType: 'HERO',
      templateData: {
        name: `Section ${nextOrder}`,
        mediaType: 'image',
        mediaUrl: '',
        showDescription: false,
        showButton: false,
        buttonShape: 'ROUNDED',
      },
    } as Section;

    dispatch({ type: 'SET_DRAFT_SECTIONS', payload: [nextSection] });
    dispatch({ type: 'SET_SELECTED_ORDER', payload: nextOrder });
    dispatch({ type: 'OPEN_SETTINGS' });
  }, [state.sections.length]);

  // Apply draft by appending new sections to committed state (do not replace existing)
  const applyDraft = useCallback(() => {
    const draft = (state as State).draftSections;
    if (draft && draft.length > 0) {
      const combined = [...state.sections, ...draft].map((s, i) => ({ ...s, order: i + 1 }));
      dispatch({ type: 'SET_SECTIONS', payload: combined });
      dispatch({ type: 'SET_UNSAVED', payload: true });
    }
    dispatch({ type: 'SET_DRAFT_SECTIONS', payload: null });
    dispatch({ type: 'CLOSE_SETTINGS' });
  }, [state]);

  const uploadToProduction = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      await HeroPageApi.uploadToProduction();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to upload hero to production';
      dispatch({ type: 'SET_ERROR', payload: msg });
      throw e;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const canAddMore = state.sections.length + (state.draftSections?.length ?? 0) < 5;

  return {
    ...state,
    canAddMore,
    draftSections: state.draftSections,
    addSection,
    removeSection,
    updateSection,
    reorderSections,
    openSettings,
    closeSettings,
    editSection,
    setSelectedSectionOrder,
    beginDraft,
    applyDraft,
    saveToStaging,
    uploadToProduction,
    selectedSectionOrder: state.selectedSectionOrder,
  };
}


