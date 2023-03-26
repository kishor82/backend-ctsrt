import { Lifecycle } from '@hapi/hapi';
import { CommentCollectionType, PostCollectionType, TodoCollectionType, UserCollectionType } from '../data_access';

export type handlerMethod = Lifecycle.Method;

export interface IsignupController {
  userCollection: UserCollectionType;
}

export interface ILoginController {
  userCollection: UserCollectionType;
}

export interface IUserController {
  userCollection: UserCollectionType;
}

export interface ITodoController {
  todoCollection: TodoCollectionType;
}

export interface IPostController {
  postCollection: PostCollectionType;
}

export interface ICommentController {
  commentCollection: CommentCollectionType;
}
