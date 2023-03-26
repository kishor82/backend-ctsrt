import Mongoose from 'mongoose';
import config from '../config';

import { CreateMongoConnectionInputType } from './types';
import makeUserCollection from './user_collection';
import makeTodoCollection from './todo_collection';
import makePostCollection from './post_collection';
import makeCommentCollection from './comment_collection';

import { makeUserModelConnection } from '../models/user_model';
import { makeTodoModelConnection } from '../models/todo_model';
import { makePostModelConnection } from '../models/post_model';
import { makeCommentModelConnection } from '../models/comment_model';
const { mongo } = config;

const options = Object.freeze({
  autoIndex: false, // Don't build indexes
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const getMongoURL = () => {
  const credentials = mongo.username ? `${mongo.username}:${mongo.password}@` : '';
  const mongoInitial = mongo.isLocal ? 'mongodb' : 'mongodb+srv';
  return `${mongoInitial}://${credentials}${mongo.hosts}/${mongo.database}${
    mongo.authSource ? `?authSource=${mongo.authSource}${mongo.replicaSet ? `&replicaSet=${mongo.replicaSet}` : ''}` : ''
  }`;
};

export const createMongoConnection = async ({ server, config }: CreateMongoConnectionInputType) => {
  if (Mongoose.connection.readyState) {
    return Mongoose;
  }
  try {
    server?.log(['info', 'mongo'], `MongoDB url : ${getMongoURL()}`);
    await Mongoose.connect(getMongoURL(), options);
    server?.log(['info', 'mongo'], `MongoDB successfully connected.`);
    return Mongoose;
  } catch (err) {
    throw err;
  }
};

export const registerModels = async (dbConnection: typeof Mongoose) => {
  makeUserModelConnection({ dbConnection });
  makeTodoModelConnection({ dbConnection });
  makePostModelConnection({ dbConnection });
  makeCommentModelConnection({ dbConnection });
};

export const userCollection = makeUserCollection({ createMongoConnection, makeUserModelConnection });
export const todoCollection = makeTodoCollection({ createMongoConnection, makeTodoModelConnection });
export const postCollection = makePostCollection({ createMongoConnection, makePostModelConnection });
export const commentCollection = makeCommentCollection({ createMongoConnection, makeCommentModelConnection });

export type UserCollectionType = ReturnType<typeof makeUserCollection>;
export type TodoCollectionType = ReturnType<typeof makeTodoCollection>;
export type PostCollectionType = ReturnType<typeof makePostCollection>;
export type CommentCollectionType = ReturnType<typeof makeCommentCollection>;

export type CreateMongoConnectionType = typeof createMongoConnection;
