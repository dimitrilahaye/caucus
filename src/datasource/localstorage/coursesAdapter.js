// @ts-check
import '../../core/entities/course.js';

/** @typedef {import('../../core/entities/course.js').Course} Course */
/** @typedef {import('../../core/entities/course.js').Student} Student */

const STORAGE_KEY = 'caucus~courses';

/**
 * @returns {Course[]}
 */
function readAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

/**
 * @param {{ courses: Course[] }} params
 */
function writeAll({ courses }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
}

/**
 * @returns {string}
 */
function uuid() {
  if (crypto && 'randomUUID' in crypto) return crypto.randomUUID();
  // Fallback UUIDv4-ish
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * @returns {import('../../core/ports/coursesPort.js').CoursesPort}
 */
export function createCoursesAdapter() {
  return {
    async list() {
      return readAll();
    },
    /**
     * @param {{ name: string }} params
     */
    async create({ name }) {
      const courses = readAll();
      const course = { id: uuid(), name, students: [] };
      writeAll({ courses: [course, ...courses] });
      return course;
    },
    /**
     * @param {{ id: string }} params
     */
    async getById({ id }) {
      const courses = readAll();
      return courses.find(c => c.id === id) || undefined;
    },
    /**
     * @param {{ id: string, newName: string }} params
     */
    async rename({ id, newName }) {
      const courses = readAll();
      const idx = courses.findIndex(c => c.id === id);
      if (idx === -1) return undefined;
      courses[idx] = { ...courses[idx], name: newName };
      writeAll({ courses });
      return courses[idx];
    },
    /**
     * @param {{ id: string }} params
     */
    async remove({ id }) {
      const courses = readAll();
      const lenBefore = courses.length;
      const filtered = courses.filter(c => c.id !== id);
      writeAll({ courses: filtered });
      return filtered.length !== lenBefore;
    },
    /**
     * @param {{ courseId: string, studentName: string }} params
     */
    async addStudent({ courseId, studentName }) {
      const courses = readAll();
      const idx = courses.findIndex(c => c.id === courseId);
      if (idx === -1) return undefined;
      const student = { id: uuid(), name: studentName };
      courses[idx] = { ...courses[idx], students: [...courses[idx].students, student] };
      writeAll({ courses });
      return courses[idx];
    },
    /**
     * @param {{ courseId: string, studentId: string, newName: string }} params
     */
    async renameStudent({ courseId, studentId, newName }) {
      const courses = readAll();
      const idx = courses.findIndex(c => c.id === courseId);
      if (idx === -1) return undefined;
      const sIdx = courses[idx].students.findIndex(s => s.id === studentId);
      if (sIdx === -1) return undefined;
      const updated = { ...courses[idx].students[sIdx], name: newName };
      const newStudents = courses[idx].students.slice();
      newStudents[sIdx] = updated;
      courses[idx] = { ...courses[idx], students: newStudents };
      writeAll({ courses });
      return courses[idx];
    },
    /**
     * @param {{ courseId: string, studentId: string }} params
     */
    async removeStudent({ courseId, studentId }) {
      const courses = readAll();
      const idx = courses.findIndex(c => c.id === courseId);
      if (idx === -1) return false;
      const before = courses[idx].students.length;
      const newStudents = courses[idx].students.filter(s => s.id !== studentId);
      courses[idx] = { ...courses[idx], students: newStudents };
      writeAll({ courses });
      return newStudents.length !== before;
    },
  };
}


