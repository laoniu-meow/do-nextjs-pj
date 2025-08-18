// Legacy components (deprecated - use GenericSettingsPanel instead)
export { DynamicSettingsPanel } from './DynamicSettingsPanel';
export { SettingsPanel } from './SettingsPanel';
export { SettingsContentFactory } from './SettingsContentFactory';

// New generic settings system
export { GenericSettingsPanel } from './GenericSettingsPanel';
export { GenericSettingsForm } from './GenericSettingsForm';

// Content components (legacy - will be replaced by schemas)
export { CompanyProfileSettings } from './content/CompanyProfileSettings';
export { HeaderMainSettings } from './content/HeaderMainSettings';

// New header components
export { HeaderPreview } from './HeaderPreview';
export { HeaderSettingsForm } from './HeaderSettingsForm';

// Types and hooks
export type { SettingsPageType } from "@/hooks/useSettingsContent";
export { useSettingsContent } from "@/hooks/useSettingsContent";

// Examples and demos
export { DynamicSettingsExample } from "./DynamicSettingsExample";
