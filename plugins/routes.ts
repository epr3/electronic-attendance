const withSchoolId =
  (url: string) =>
  ({ schoolId }: { schoolId: string }) =>
    `/schools/${schoolId}${url}`;
const withYearId =
  (url: string) =>
  ({ yearId, schoolId }: { schoolId: string; yearId: string }) =>
    `/schools/${schoolId}/years/${yearId}${url}`;
const withYearAndClassId =
  (url: string) =>
  ({
    yearId,
    schoolId,
    classId,
  }: {
    schoolId: string;
    yearId: string;
    classId: string;
  }) =>
    `/schools/${schoolId}/years/${yearId}/classes/${classId}${url}`;

const routes = {
  home: "/",
  profile: "/profile",
  auth: {
    register: "/register",
    registerSuccess: "/register/success",
    login: "/login",
    mfa: "/mfa",
    mfaVerify: "/mfa/verify",
  },
  users: {
    new: withSchoolId("/users/new"),
    index: withSchoolId("/users"),
    get: (userId: string) => withSchoolId(`/users/${userId}`),
  },
  subjects: {
    new: withSchoolId("/subjects/new"),
    index: withSchoolId("/subjects"),
    get: (subjectId: string) => withSchoolId(`/subjects/${subjectId}`),
  },
  years: {
    new: withSchoolId("/years/new"),
    index: withSchoolId("/years"),
    get: (yearId: string) => withSchoolId(`/years/${yearId}`),
    classes: {
      get: (classId: string) => withYearId(`/classes/${classId}`),
      index: withYearId("/classes"),
      new: withYearId("/classes/new"),
      students: {
        index: withYearAndClassId("/students"),
        new: withYearAndClassId("/students/new"),
        get: (studentId: string) =>
          withYearAndClassId(`/students/${studentId}`),
      },
      subjects: {
        index: withYearAndClassId("/subjects"),
        new: withYearAndClassId("/subjects/new"),
        get: (subjectId: string) =>
          withYearAndClassId(`/subjects/${subjectId}`),
        students: (subjectId: string) =>
          withYearAndClassId(`/subjects/${subjectId}/students`),
      },
    },
  },
};

const apiWithSchoolId =
  (url: string) =>
  ({ schoolId }: { schoolId: string }) =>
    `/api/schools/${schoolId}${url}`;

const apiWithYearId =
  (url: string) =>
  ({ schoolId, yearId }: { schoolId: string; yearId: string }) =>
    `/api/schools/${schoolId}/years/${yearId}${url}`;

const apiWithYearAndClassId =
  (url: string) =>
  ({
    schoolId,
    yearId,
    classId,
  }: {
    schoolId: string;
    yearId: string;
    classId: string;
  }) =>
    `/api/schools/${schoolId}/years/${yearId}/classes/${classId}${url}`;

const api = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    session: "/api/auth/session",
    me: "/api/auth/me",
    mfaEnroll: "/api/auth/mfa/enroll",
    mfaVerify: "/api/auth/mfa/verify",
    mfaSms: "/api/auth/mfa/send-sms",
    mfaGenerateQr: "/api/auth/mfa/generate-qr",
  },
  subjects: {
    index: apiWithSchoolId("/subjects"),
    id: (subjectId: string) => apiWithSchoolId(`/subjects/${subjectId}`),
  },
  users: {
    index: apiWithSchoolId("/users"),
    id: (userId: string) => apiWithSchoolId(`/users/${userId}`),
  },
  years: {
    index: apiWithSchoolId("/years"),
    id: (yearId: string) => apiWithSchoolId(`/years/${yearId}`),
    classes: {
      index: apiWithYearId("/classes"),
      id: (classId: string) => apiWithYearId(`/classes/${classId}`),
      students: {
        index: apiWithYearAndClassId("/students"),
        id: (studentId: string) =>
          apiWithYearAndClassId(`/students/${studentId}`),
      },
      schedules: {
        index: apiWithYearAndClassId("/schedules"),
        id: (scheduleId: string) =>
          apiWithYearAndClassId(`/schedules/${scheduleId}`),
        students: {
          id: ({
            scheduleId,
            studentId,
          }: {
            scheduleId: string;
            studentId: string;
          }) => apiWithYearAndClassId(`/schedules/${scheduleId}/${studentId}`),
        },
      },
    },
  },
};

export default defineNuxtPlugin(() => {
  return {
    provide: {
      routes,
      api,
    },
  };
});
