export const paths = {
  auth: {
    login: "/login",
    register: "/register",
  },
  dashboard: "/dashboard",
  profile: "/profile",
  exams: {
    root: "/exams",
    create: "/exams/create",
    edit: (id: string) => `/exams/${id}/edit`,
    details: (id: string) => `/exams/${id}`,
  },
  questions: {
    root: "/questions",
    create: "/questions/create",
    edit: (id: string) => `/questions/${id}/edit`,
  },
};
