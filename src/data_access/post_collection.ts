import { Isearch, PostCollectionInputType } from './types';
import { IPost } from '../models/post_model';
import { getSearchQuery, getFacetPagination } from '../utils';

const makePostCollection = ({ createMongoConnection, makePostModelConnection }: PostCollectionInputType) => {
  const getAllPosts = async ({ keyword = '', pageNumber, pageSize }: Isearch) => {
    try {
      const dbConnection = await createMongoConnection({});
      return makePostModelConnection({ dbConnection }).aggregate([
        ...(keyword ? (getSearchQuery({ keyword }) as any[]) : []),
        getFacetPagination(pageNumber, pageSize),
      ]);
    } catch (err) {
      throw err;
    }
  };

  const getPost = async ({ id }: { id: number }) => {
    try {
      const dbConnection = await createMongoConnection({});
      return makePostModelConnection({ dbConnection }).findOne({ id }).lean().select('-__v -_id');
    } catch (err) {
      throw err;
    }
  };

  const getPostsByUserId = async ({ userId }: { userId: number }) => {
    try {
      const dbConnection = await createMongoConnection({});
      return makePostModelConnection({ dbConnection }).findOne({ userId }).lean().select('-__v -_id');
    } catch (err) {
      throw err;
    }
  };

  const createPost = async (data: Partial<IPost>) => {
    try {
      const dbConnection = await createMongoConnection({});
      return makePostModelConnection({ dbConnection }).create({ ...data });
    } catch (err) {
      throw err;
    }
  };

  const updatePostById = async ({ id, dataToUpdate }: { id: number; dataToUpdate: Partial<IPost> }) => {
    try {
      const dbConnection = await createMongoConnection({});
      return await makePostModelConnection({ dbConnection })
        .findOneAndUpdate(
          { id },
          {
            $set: {
              ...dataToUpdate,
            },
          },
          { rawResult: true }
        )
        .lean()
        .select('-__v');
    } catch (err) {
      throw err;
    }
  };

  const deletePostById = async ({ id }: { id: number }) => {
    try {
      const dbConnection = await createMongoConnection({});
      return await makePostModelConnection({ dbConnection }).findOneAndDelete({ id });
    } catch (err) {
      throw err;
    }
  };
  return Object.freeze({
    getAllPosts,
    getPostsByUserId,
    getPost,
    createPost,
    updatePostById,
    deletePostById,
  });
};

export default makePostCollection;
