import { useState, useCallback, useMemo } from 'react';
import { SettingsSchema, SettingsData, SettingsValidationResult, SettingField } from '@/types/settings';

export function useSettings<T extends SettingsData = SettingsData>(
  schema: SettingsSchema,
  initialData?: Partial<T>
) {
  // Type guard to ensure field has required properties
  const isValidField = (field: unknown): field is SettingField => {
    if (!field || typeof field !== 'object' || field === null) {
      return false;
    }
    
    const fieldObj = field as Record<string, unknown>;
    return (
      'id' in fieldObj &&
      'type' in fieldObj &&
      typeof fieldObj.id === 'string' &&
      typeof fieldObj.type === 'string'
    );
  };

  // Initialize data with defaults from schema
  const getDefaultData = useCallback((): T => {
    const defaultData: Record<string, string | number | boolean | string[] | File | File[] | null> = {};
    
    schema.sections.forEach(section => {
      section.fields.forEach((field) => {
        if (isValidField(field)) {
          if (field.defaultValue !== undefined) {
            defaultData[field.id] = field.defaultValue;
          } else {
            // Set appropriate default based on field type
            const fieldId = field.id;
            const fieldType = field.type;
            
            switch (fieldType) {
              case 'text':
              case 'email':
              case 'password':
              case 'textarea':
              case 'color':
                defaultData[fieldId] = '';
                break;
              case 'number':
                defaultData[fieldId] = 0;
                break;
              case 'select': {
                const selectField = field as import('@/types/settings').SelectSettingField;
                defaultData[fieldId] = selectField.options?.[0]?.value || '';
                break;
              }
              case 'switch':
                defaultData[fieldId] = false;
                break;
              case 'file':
                defaultData[fieldId] = null;
                break;
              case 'multiselect':
                defaultData[fieldId] = [];
                break;
              default:
                defaultData[fieldId] = '';
            }
          }
        }
      });
    });
    
    return defaultData as T;
  }, [schema]);

  const [data, setData] = useState<T>(() => ({
    ...getDefaultData(),
    ...initialData
  }));

  const [originalData, setOriginalData] = useState<T>(() => ({
    ...getDefaultData(),
    ...initialData
  }));

  // Update a single field
  const updateField = useCallback((fieldId: string, value: string | number | boolean | string[] | File | File[] | null) => {
    setData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  }, []);

  // Update multiple fields in a section
  const updateSection = useCallback((sectionId: string, sectionData: Partial<T>) => {
    setData(prev => ({
      ...prev,
      ...sectionData
    }));
  }, []);

  // Reset to original data
  const resetToOriginal = useCallback(() => {
    setData(originalData);
  }, [originalData]);

  // Reset to schema defaults
  const resetToDefaults = useCallback(() => {
    const defaultData = getDefaultData();
    setData(defaultData);
    setOriginalData(defaultData);
  }, [getDefaultData]);

  // Check if specific field has changes
  const isDirty = useCallback((fieldId?: string): boolean => {
    if (fieldId) {
      return data[fieldId] !== originalData[fieldId];
    }
    return false;
  }, [data, originalData]);

  // Check if any field has changes
  const hasChanges = useMemo(() => {
    return Object.keys(data).some(key => data[key] !== originalData[key]);
  }, [data, originalData]);

  // Validate all fields
  const validate = useCallback((): SettingsValidationResult => {
    const errors: { [fieldId: string]: string } = {};
    let isValid = true;

    schema.sections.forEach(section => {
      section.fields.forEach((field) => {
        const typedField = field as SettingField;
        const value = data[typedField.id];
        const fieldErrors: string[] = [];

        // Required field validation
        if (typedField.required && (value === undefined || value === null || value === '')) {
          fieldErrors.push('This field is required');
          isValid = false;
        }

        // Type-specific validation
        if (value !== undefined && value !== null && value !== '') {
          switch (field.type) {
            case 'email':
              const emailPattern = field.validation?.pattern || '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
              if (typeof value === 'string' && !new RegExp(emailPattern).test(value)) {
                fieldErrors.push('Please enter a valid email address');
                isValid = false;
              }
              break;
            
            case 'number':
              if (typeof value === 'string') {
                const numValue = parseFloat(value);
                if (isNaN(numValue)) {
                  fieldErrors.push('Please enter a valid number');
                  isValid = false;
                } else {
                  if (field.validation?.min !== undefined && numValue < field.validation.min) {
                    fieldErrors.push(`Value must be at least ${field.validation.min}`);
                    isValid = false;
                  }
                  if (field.validation?.max !== undefined && numValue > field.validation.max) {
                    fieldErrors.push(`Value must be at most ${field.validation.max}`);
                    isValid = false;
                  }
                }
              }
              break;
            
            case 'text':
            case 'textarea':
              if (typeof value === 'string') {
                if (field.validation?.min !== undefined && value.length < field.validation.min) {
                  fieldErrors.push(`Text must be at least ${field.validation.min} characters`);
                  isValid = false;
                }
                if (field.validation?.max !== undefined && value.length > field.validation.max) {
                  fieldErrors.push(`Text must be at most ${field.validation.max} characters`);
                  isValid = false;
                }
                if (field.validation?.pattern) {
                  if (!new RegExp(field.validation.pattern).test(value)) {
                    fieldErrors.push('Text does not match required format');
                    isValid = false;
                  }
                }
              }
              break;
            
            case 'file':
              if (value && typeof value === 'object' && 'size' in value) {
                const fileValue = value as File;
                const fileField = field as import('@/types/settings').FileSettingField;
                if (fileField.maxSize && fileValue.size > fileField.maxSize) {
                  const maxSizeMB = Math.round(fileField.maxSize / (1024 * 1024));
                  fieldErrors.push(`File size must be less than ${maxSizeMB}MB`);
                  isValid = false;
                }
              }
              break;
          }

          // Custom validation
          if (field.validation?.custom) {
            const customError = field.validation.custom(value);
            if (customError) {
              fieldErrors.push(customError);
              isValid = false;
            }
          }
        }

        if (fieldErrors.length > 0) {
          errors[field.id] = fieldErrors.join(', ');
        }
      });
    });

    return { isValid, errors };
  }, [data, schema]);

  // Update original data (useful when saving)
  const updateOriginalData = useCallback((newData: T) => {
    setOriginalData(newData);
    setData(newData);
  }, []);

  return {
    data,
    updateField,
    updateSection,
    resetToOriginal,
    resetToDefaults,
    validate,
    hasChanges,
    isDirty,
    updateOriginalData,
    schema
  };
}
