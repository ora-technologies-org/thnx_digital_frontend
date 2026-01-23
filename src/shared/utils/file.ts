import toast from "react-hot-toast";

/**
 * Validate image file type and size
 */
export const validateImageFile = (
  file: File,
  maxSizeMB = 5,
): { valid: boolean; error?: string } => {
  const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Please upload a valid image file (PNG, JPG, or SVG)",
    };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Logo file size should not exceed ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
};

/**
 * Read file as data URL
 */
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

/**
 * Handle logo file selection with validation
 */
export const handleLogoSelection = async (
  file: File | undefined,
  onSuccess: (file: File, preview: string) => void,
): Promise<void> => {
  if (!file) return;

  const validation = validateImageFile(file);
  if (!validation.valid) {
    toast.error(validation.error!);
    return;
  }

  try {
    const preview = await readFileAsDataURL(file);
    onSuccess(file, preview);
  } catch (error) {
    toast.error("Failed to read image file");
    console.error("File read error:", error);
  }
};
