/**
 * DATANO Static Dataset & Local Persistence Engine
 * Serves instructions, tasks, and image metadata statically without backend dependencies.
 */
import dataset from './instructions.json';

const STORAGE_KEY_ANNOTATIONS = 'datano_annotations_v1';
const STORAGE_KEY_NOTES = 'datano_notes_v1';

// Initial dataset loaded from static JSON
export const INITIAL_INSTRUCTIONS = dataset;

/**
 * Fetch all instructions (synchronous or async for API-like ergonomics)
 */
export const getInstructions = async () => {
  return Promise.resolve([...INITIAL_INSTRUCTIONS]);
};

/**
 * Load stored annotations from browser localStorage
 */
export const getStoredAnnotations = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ANNOTATIONS);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to load annotations from localStorage:', err);
    return {};
  }
};

/**
 * Save annotations to browser localStorage
 */
export const saveStoredAnnotations = (annotations) => {
  try {
    localStorage.setItem(STORAGE_KEY_ANNOTATIONS, JSON.stringify(annotations));
  } catch (err) {
    console.error('Failed to save annotations to localStorage:', err);
  }
};

/**
 * Load stored reviewer notes
 */
export const getStoredNotes = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to load notes from localStorage:', err);
    return {};
  }
};

/**
 * Save reviewer notes
 */
export const saveStoredNotes = (notes) => {
  try {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  } catch (err) {
    console.error('Failed to save notes to localStorage:', err);
  }
};

/**
 * Clear all stored local user data
 */
export const clearStoredData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_ANNOTATIONS);
    localStorage.removeItem(STORAGE_KEY_NOTES);
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
};

export default INITIAL_INSTRUCTIONS;
