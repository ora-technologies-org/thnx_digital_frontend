/**
 * Extract error message from unknown error object
 */
export const extractErrorMessage = (
  error: unknown,
  defaultMessage = "An error occurred",
): string => {
  if (!error) return defaultMessage;

  // Check for axios-style error response
  if (
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response
  ) {
    const responseData = (error.response as { data?: unknown }).data;

    if (responseData && typeof responseData === "object") {
      const dataObj = responseData as Record<string, unknown>;

      if (typeof dataObj.message === "string") {
        return dataObj.message;
      }
      if (typeof dataObj.error === "string") {
        return dataObj.error;
      }
      if (dataObj.errors && typeof dataObj.errors === "object") {
        const firstError = Object.values(dataObj.errors)[0];
        if (typeof firstError === "string") {
          return firstError;
        }
        if (Array.isArray(firstError) && firstError.length > 0) {
          return firstError[0];
        }
      }
    }
  }

  // Check for Error instance
  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};
