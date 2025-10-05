// @ts-check
import '../../core/entities/course.js';

/** @typedef {import('../../core/entities/course.js').Course} Course */
/** @typedef {import('../../core/entities/course.js').Student} Student */

const STORAGE_KEY = 'cre-impro~courses';

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
 * @param {Course[]} courses
 */
function writeAll(courses) {
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
    async create(name) {
      const courses = readAll();
      const course = { id: uuid(), name, students: [] };
      writeAll([course, ...courses]);
      return course;
    },
    async getById(id) {
      const courses = readAll();
      return courses.find(c => c.id === id) || undefined;
    },
    async rename(id, name) {
      const courses = readAll();
      const idx = courses.findIndex(c => c.id === id);
      if (idx === -1) return undefined;
      courses[idx] = { ...courses[idx], name };
      writeAll(courses);
      return courses[idx];
    },
    async remove(id) {
      const courses = readAll();
      const lenBefore = courses.length;
      const filtered = courses.filter(c => c.id !== id);
      writeAll(filtered);
      return filtered.length !== lenBefore;
    },
    async addStudent(courseId, name) {
      const courses = readAll();
      const idx = courses.findIndex(c => c.id === courseId);
      if (idx === -1) return undefined;
      const student = { id: uuid(), name };
      courses[idx] = { ...courses[idx], students: [...courses[idx].students, student] };
      writeAll(courses);
      return courses[idx];
    },
    async renameStudent(courseId, studentId, name) {
      const courses = readAll();
      const idx = courses.findIndex(c => c.id === courseId);
      if (idx === -1) return undefined;
      const sIdx = courses[idx].students.findIndex(s => s.id === studentId);
      if (sIdx === -1) return undefined;
      const updated = { ...courses[idx].students[sIdx], name };
      const newStudents = courses[idx].students.slice();
      newStudents[sIdx] = updated;
      courses[idx] = { ...courses[idx], students: newStudents };
      writeAll(courses);
      return courses[idx];
    },
    async removeStudent(courseId, studentId) {
      const courses = readAll();
      const idx = courses.findIndex(c => c.id === courseId);
      if (idx === -1) return false;
      const before = courses[idx].students.length;
      const newStudents = courses[idx].students.filter(s => s.id !== studentId);
      courses[idx] = { ...courses[idx], students: newStudents };
      writeAll(courses);
      return newStudents.length !== before;
    },
  };
}


