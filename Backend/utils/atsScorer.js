import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { findSkillsInText } from "./skillsKeywords.js";

// Points pdfjs-dist at its bundled standard fonts so it doesn't warn/fail
// when a resume uses a non-embedded base font.
// IMPORTANT: this must be built as a proper file:// URL, not a raw OS path.
// path.join() on Windows produces backslashes (D:\...\), which pdfjs-dist
// rejects as an "Invalid factory url". pathToFileURL() handles the
// Windows-vs-POSIX path differences correctly either way.
const STANDARD_FONT_DATA_URL = pathToFileURL(
  path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "node_modules",
    "pdfjs-dist",
    "standard_fonts"
  ) + path.sep
).toString();

/**
 * Extract raw text from a resume file on disk.
 * Only PDF is supported for text extraction. Image resumes (PNG/JPG/WEBP)
 * return null — extracting text from an image needs OCR, which is a
 * separate feature, not something to fake here.
 *
 * Uses pdfjs-dist (Mozilla's own parser) rather than pdf-parse — pdf-parse
 * relies on an old pdf.js fork that fails on PDFs using compressed XRef
 * streams, which is common output from Google Docs, Canva, and recent
 * Word/LibreOffice exports. Tested directly against pdf-parse before
 * choosing this; pdf-parse threw "bad XRef entry" on a valid, standard PDF.
 *
 * @param {string} filePath - local temp file path (from express-fileupload)
 * @param {string} mimetype
 * @returns {Promise<string|null>}
 */
export async function extractResumeText(filePath, mimetype) {
  if (mimetype !== "application/pdf") {
    return null;
  }
  try {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const doc = await getDocument({ data, standardFontDataUrl: STANDARD_FONT_DATA_URL }).promise;
    let fullText = "";
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map((item) => item.str).join(" ") + "\n";
    }
    return fullText;
  } catch (err) {
    console.error("PDF text extraction failed:", err.message);
    return null;
  }
}

/**
 * Build the ATS score object for an application.
 *
 * @param {string|null} resumeText - extracted resume text, or null if unavailable
 * @param {string[]} requiredSkills - skills the employer listed on the job
 * @returns {object} atsScore subdocument
 */
export function buildATSScore(resumeText, requiredSkills = []) {
  const cleanRequired = (requiredSkills || [])
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);

  // Case 1: no resume text available (image resume, or parsing failed)
  if (resumeText === null || resumeText === undefined) {
    return {
      score: null,
      matchedSkills: [],
      missingSkills: cleanRequired,
      extractedSkills: [],
      resumeTextExtracted: false,
      note: "Resume text could not be extracted (likely an image file). Upload a PDF resume to get an ATS score.",
      analyzedAt: new Date(),
    };
  }

  const extractedSkills = findSkillsInText(resumeText);

  // Case 2: employer didn't specify required skills for this job
  if (cleanRequired.length === 0) {
    return {
      score: null,
      matchedSkills: [],
      missingSkills: [],
      extractedSkills,
      resumeTextExtracted: true,
      note: "This job has no required skills listed, so no match score can be calculated.",
      analyzedAt: new Date(),
    };
  }

  // Match required skills (case-insensitive) against what's in the resume
  const extractedLower = new Set(extractedSkills.map((s) => s.toLowerCase()));
  const matchedSkills = cleanRequired.filter((s) => extractedLower.has(s.toLowerCase()));
  const missingSkills = cleanRequired.filter((s) => !extractedLower.has(s.toLowerCase()));

  const score = Math.round((matchedSkills.length / cleanRequired.length) * 100);

  return {
    score,
    matchedSkills,
    missingSkills,
    extractedSkills,
    resumeTextExtracted: true,
    note: null,
    analyzedAt: new Date(),
  };
}