// @ts-check
import '../entities/course.js';

/**
 * @typedef {import('../entities/course.js').Course} Course
 * @typedef {import('../entities/course.js').Student} Student
 */

/**
 * @typedef {object} CoursesPort
 * @property {() => Promise<Course[]>} list
 * @property {(name: string) => Promise<Course>} create
 * @property {(id: string) => Promise<Course|null>} getById
 * @property {(id: string, name: string) => Promise<Course|null>} rename
 * @property {(id: string) => Promise<boolean>} remove
 * @property {(courseId: string, name: string) => Promise<Student>} addStudent
 * @property {(courseId: string, studentId: string, name: string) => Promise<Student|null>} renameStudent
 * @property {(courseId: string, studentId: string) => Promise<boolean>} removeStudent
 */

export {}; // JSDoc-only interface

