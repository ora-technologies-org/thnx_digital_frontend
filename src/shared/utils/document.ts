// src/shared/utils/documentUtils.ts

import type { DocumentInfo, ProfileDocuments } from "../types/Form.types";

/**
 * Normalize a document value to DocumentInfo format
 * Handles string URLs and DocumentInfo objects
 */
export function normalizeDocument(
  doc: string | DocumentInfo | undefined,
): DocumentInfo | undefined {
  if (!doc) return undefined;

  if (typeof doc === "string") {
    // Convert string URL to DocumentInfo
    const fileName = doc.split("/").pop() || "document";
    return {
      name: fileName,
      url: doc,
      uploadedAt: new Date().toISOString(),
    };
  }

  return doc;
}

/**
 * Normalize all documents in a ProfileDocuments object
 * Converts all string URLs to DocumentInfo objects
 */
export function normalizeProfileDocuments(
  docs: ProfileDocuments | undefined,
): ProfileDocuments {
  if (!docs) {
    return {};
  }

  return {
    identityDocument: normalizeDocument(docs.identityDocument),
    registrationDocument: normalizeDocument(docs.registrationDocument),
    taxDocument: normalizeDocument(docs.taxDocument),
  };
}

/**
 * Get document URL from either string or DocumentInfo
 */
export function getDocumentUrl(
  doc: string | DocumentInfo | undefined,
): string | undefined {
  if (!doc) return undefined;
  if (typeof doc === "string") return doc;
  return doc.url;
}

/**
 * Get document name from either string or DocumentInfo
 */
export function getDocumentName(
  doc: string | DocumentInfo | undefined,
): string | undefined {
  if (!doc) return undefined;
  if (typeof doc === "string") {
    return doc.split("/").pop() || "document";
  }
  return doc.name;
}

/**
 * Check if a document exists (either as string URL or DocumentInfo)
 */
export function hasDocument(doc: string | DocumentInfo | undefined): boolean {
  if (!doc) return false;
  if (typeof doc === "string") return doc.trim().length > 0;
  return !!doc.url;
}

/**
 * Convert ProfileDocuments to a format suitable for display
 */
export interface DocumentDisplay {
  name: string;
  url: string;
  uploadedAt?: string;
}

export function getDocumentDisplay(
  doc: string | DocumentInfo | undefined,
): DocumentDisplay | null {
  if (!doc) return null;

  if (typeof doc === "string") {
    return {
      name: doc.split("/").pop() || "document",
      url: doc,
    };
  }

  return {
    name: doc.name,
    url: doc.url,
    uploadedAt: doc.uploadedAt,
  };
}

/**
 * Get all documents from ProfileDocuments as an array of DocumentDisplay
 */
export function getAllDocumentsDisplay(
  docs: ProfileDocuments | undefined,
): Array<DocumentDisplay & { type: string }> {
  if (!docs) return [];

  const result: Array<DocumentDisplay & { type: string }> = [];

  if (docs.identityDocument) {
    const display = getDocumentDisplay(docs.identityDocument);
    if (display) {
      result.push({ ...display, type: "Identity Document" });
    }
  }

  if (docs.registrationDocument) {
    const display = getDocumentDisplay(docs.registrationDocument);
    if (display) {
      result.push({ ...display, type: "Registration Document" });
    }
  }

  if (docs.taxDocument) {
    const display = getDocumentDisplay(docs.taxDocument);
    if (display) {
      result.push({ ...display, type: "Tax Document" });
    }
  }

  return result;
}
