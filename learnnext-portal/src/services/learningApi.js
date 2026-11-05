/** Courses, students and instructors (the original demo modules). (Split from services/api.js — import from '@/services/api', which re-exports everything.) */
import { uid } from '@/utils/helpers';
import { db, instructorName, mock } from './coreApi';

/* --------------------------------------------------------------- Courses */
export const coursesApi = {
  list: () => mock(db.courses),
  async create(data) {
    const course = {
      id: uid('c'),
      students: 0,
      lessons: 0,
      progress: 0,
      status: 'draft',
      updatedAt: new Date().toISOString(),
      ...data,
      instructor: instructorName(data.instructorId),
    };
    db.courses = [course, ...db.courses];
    return mock(course, 500);
  },
  async update(id, data) {
    db.courses = db.courses.map((c) => (c.id === id ? { ...c, ...data, instructor: instructorName(data.instructorId ?? c.instructorId), updatedAt: new Date().toISOString() } : c));
    return mock(
      db.courses.find((c) => c.id === id),
      500,
    );
  },
  async remove(ids) {
    const list = Array.isArray(ids) ? ids : [ids];
    db.courses = db.courses.filter((c) => !list.includes(c.id));
    return mock({ ok: true }, 400);
  },
};

/* -------------------------------------------------------------- Students */
export const studentsApi = {
  list: () => mock(db.students),
  async create(data) {
    const course = db.courses.find((c) => c.id === data.courseId);
    const student = {
      id: uid('s'),
      progress: 0,
      status: 'pending',
      enrolledAt: new Date().toISOString(),
      lastActive: null,
      ...data,
      courseTitle: course?.title ?? '—',
    };
    db.students = [student, ...db.students];
    return mock(student, 500);
  },
  async remove(ids) {
    const list = Array.isArray(ids) ? ids : [ids];
    db.students = db.students.filter((s) => !list.includes(s.id));
    return mock({ ok: true }, 400);
  },
};

/* ----------------------------------------------------------- Instructors */
export const instructorsApi = {
  list: () => mock(db.instructors),
  async invite(data) {
    const inst = {
      id: uid('i'),
      courses: 0,
      students: 0,
      rating: null,
      status: 'invited',
      joined: new Date().toISOString(),
      ...data,
    };
    db.instructors = [...db.instructors, inst];
    return mock(inst, 500);
  },
};
