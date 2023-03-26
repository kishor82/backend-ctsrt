import { Server } from '@hapi/hapi';
import { createTodoRoute, getTodosRoutes, updateTodoRoute, deleteTodosRoutes } from './todo';
import { createPostRoute, getPostsRoutes, updatePostRoute, deletePostsRoutes } from './post';
import { createCommentRoute, getCommentsRoutes, updateCommentRoute, deleteCommentsRoutes } from './comment';
import { createUserRoute, getUsersRoutes, updateUserRoute, deleteUserRoute } from './user';
import { loginRoute, logoutRoute, refreshSessionRoute } from './auth';
export const routes = (server: Server) => {
  loginRoute(server);
  logoutRoute(server);
  refreshSessionRoute(server);

  createUserRoute(server);
  getUsersRoutes(server);
  updateUserRoute(server);
  deleteUserRoute(server);

  createTodoRoute(server);
  getTodosRoutes(server);
  updateTodoRoute(server);
  deleteTodosRoutes(server);

  createPostRoute(server);
  getPostsRoutes(server);
  updatePostRoute(server);
  deletePostsRoutes(server);

  createCommentRoute(server);
  getCommentsRoutes(server);
  updateCommentRoute(server);
  deleteCommentsRoutes(server);
};
