// @ts-check
import '../entities/course.js';

/**
 * @typedef {import('../entities/course.js').Course} Course
 * @typedef {import('../entities/course.js').Student} Student
 */

/**
 * @typedef {object} CoursesUseCase
 * @property {() => Promise<Course[]>} list
 * @property {(params: {id: string}) => Promise<Course | undefined>} getById
 * @property {(params: {name: string}) => Promise<Course>} create
 * @property {(params: {id: string, newName: string}) => Promise<Course | undefined>} rename
 * @property {(params: {id: string}) => Promise<boolean>} remove
 * @property {(params: {courseId: string, studentName: string}) => Promise<Course | undefined>} addStudent
 * @property {(params: {courseId: string, studentId: string, newName: string}) => Promise<Course | undefined>} renameStudent
 * @property {(params: {courseId: string, studentId: string}) => Promise<boolean>} removeStudent
 */

/**
 * Creates the courses use case with injected dependencies.
 * @param {{ deps: { coursesPort: import('../ports/coursesPort.js').CoursesPort } }} params
 * @returns {CoursesUseCase}
 */
export function createCoursesUseCase({ deps }) {
  return {
    async list() {
      return await deps.coursesPort.list();
    },

    async getById({ id }) {
      return await deps.coursesPort.getById({ id });
    },

    async create({ name }) {
      return await deps.coursesPort.create({ name });
    },

    async rename({ id, newName }) {
      return await deps.coursesPort.rename({ id, newName });
    },

    async remove({ id }) {
      return await deps.coursesPort.remove({ id });
    },

    async addStudent({ courseId, studentName }) {
      return await deps.coursesPort.addStudent({ courseId, studentName });
    },

    async renameStudent({ courseId, studentId, newName }) {
      return await deps.coursesPort.renameStudent({ courseId, studentId, newName });
    },

    async removeStudent({ courseId, studentId }) {
      return await deps.coursesPort.removeStudent({ courseId, studentId });
    }
  };
}
