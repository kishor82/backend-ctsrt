import { Server } from '@hapi/hapi';
import { CreateMongoConnectionType } from '.';
import { ConfigTypes } from '../config/config_types';
import { makeCommentModelConnectionType } from '../models/comment_model';
import { makePostModelConnectionType } from '../models/post_model';
import { makeTodoModelConnectionType } from '../models/todo_model';
import { MakeUserModelConnectionType } from '../models/user_model';

export interface CreateMongoConnectionInputType {
  server?: Server;
  config?: ConfigTypes;
}
interface Base {
  createMongoConnection: CreateMongoConnectionType;
}

export interface Isearch {
  keyword?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface UserCollectionInputType extends Base {
  makeUserModelConnection: MakeUserModelConnectionType;
}

export interface PostCollectionInputType extends Base {
  makePostModelConnection: makePostModelConnectionType;
}

export interface TodoCollectionInputType extends Base {
  makeTodoModelConnection: makeTodoModelConnectionType;
}

export interface CommentCollectionInputType extends Base {
  makeCommentModelConnection: makeCommentModelConnectionType;
}
