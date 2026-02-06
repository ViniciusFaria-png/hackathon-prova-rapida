export const paths = {
  auth: {
    user: {
      signIn: "/user/signin",
    },
  },

  posts: {
    root: "/posts",
    create: "/posts/create",
    edit: (id: string) => `/posts/${id}/edit`,
    details: (id: string) => `/posts/${id}`,
  },
  teacher: {
    root: "/teacher",
    details: (id: string) => `/teacher/${id}`,
  },
};
