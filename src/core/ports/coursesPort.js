// @ts-check
import '../entities/course.js';

/**
 * @typedef {import('../entities/course.js').Course} Course
 * @typedef {import('../entities/course.js').Student} Student
 */

/**
 * @typedef {object} CoursesPort
 * @property {() => Promise<Course[]>} list
 * @property {(params: {name: string}) => Promise<Course>} create
 * @property {(params: {id: string}) => Promise<Course|undefined>} getById
 * @property {(params: {id: string, newName: string}) => Promise<Course|undefined>} rename
 * @property {(params: {id: string}) => Promise<boolean>} remove
 * @property {(params: {courseId: string, studentName: string}) => Promise<Course|undefined>} addStudent
 * @property {(params: {courseId: string, studentId: string, newName: string}) => Promise<Course|undefined>} renameStudent
 * @property {(params: {courseId: string, studentId: string}) => Promise<boolean>} removeStudent
 */

export {}; // JSDoc-only interface

