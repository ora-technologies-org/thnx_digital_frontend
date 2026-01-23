/**
 * Storage utility functions for managing localStorage with user-specific keys
 */

export interface StorageKeys {
  CURRENT_STEP: string;
  FORM_DATA: string;
  UPLOADED_FILES: string;
  LOGO_PREVIEW: string;
}

/**
 * Generate user-specific storage keys
 */
export const createStorageKeys = (userId: string): StorageKeys => ({
  CURRENT_STEP: `profile_wizard_current_step_${userId}`,
  FORM_DATA: `profile_wizard_form_data_${userId}`,
  UPLOADED_FILES: `profile_wizard_uploaded_files_${userId}`,
  LOGO_PREVIEW: `profile_wizard_logo_preview_${userId}`,
});

/**
 * Load saved form data from localStorage
 */
export const loadSavedFormData = (
  storageKey: string,
): Record<string, unknown> => {
  try {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (e) {
    console.error("Failed to load saved form data:", e);
  }
  return {};
};

/**
 * Load saved step from localStorage
 */
export const loadSavedStep = (storageKey: string, defaultStep = 1): number => {
  const savedStep = localStorage.getItem(storageKey);
  return savedStep ? parseInt(savedStep, 10) : defaultStep;
};

/**
 * Load saved file info from localStorage
 */
export const loadSavedFile = (
  storageKey: string,
  fileKey: string,
): File | null => {
  const savedFiles = localStorage.getItem(storageKey);
  if (savedFiles) {
    try {
      const files = JSON.parse(savedFiles);
      return files[fileKey] ? new File([], files[fileKey].name) : null;
    } catch (e) {
      console.error("Failed to parse saved files:", e);
      return null;
    }
  }
  return null;
};

/**
 * Clean up old localStorage data
 */
export const cleanupOldStorage = (currentKeys: StorageKeys): void => {
  const oldKeys = [
    "profile_wizard_current_step",
    "profile_wizard_form_data",
    "profile_wizard_uploaded_files",
    "profile_wizard_logo_preview",
    "profile_wizard_current_step_anonymous",
    "profile_wizard_form_data_anonymous",
    "profile_wizard_uploaded_files_anonymous",
    "profile_wizard_logo_preview_anonymous",
  ];

  oldKeys.forEach((key) => {
    if (
      key !== currentKeys.CURRENT_STEP &&
      key !== currentKeys.FORM_DATA &&
      key !== currentKeys.UPLOADED_FILES &&
      key !== currentKeys.LOGO_PREVIEW
    ) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Clear all storage keys
 */
export const clearAllStorage = (keys: StorageKeys): void => {
  Object.values(keys).forEach((key) => {
    localStorage.removeItem(key);
  });
};

/**
 * Save files info to localStorage
 */
export const saveFilesInfo = (
  storageKey: string,
  files: {
    identityDoc: File | null;
    registrationDoc: File | null;
    taxDoc: File | null;
    businessLogo: File | null;
  },
): void => {
  const filesInfo = {
    identityDoc: files.identityDoc
      ? { name: files.identityDoc.name, size: files.identityDoc.size }
      : null,
    registrationDoc: files.registrationDoc
      ? { name: files.registrationDoc.name, size: files.registrationDoc.size }
      : null,
    taxDoc: files.taxDoc
      ? { name: files.taxDoc.name, size: files.taxDoc.size }
      : null,
    businessLogo: files.businessLogo
      ? { name: files.businessLogo.name, size: files.businessLogo.size }
      : null,
  };
  localStorage.setItem(storageKey, JSON.stringify(filesInfo));
};
