import { CommentCollectionInputType, Isearch } from './types';
import { IComment } from '../models/comment_model';
import { getSearchQuery, getFacetPagination } from '../utils';

const makeCommentCollection = ({ createMongoConnection, makeCommentModelConnection }: CommentCollectionInputType) => {
  const getAllComments = async ({ keyword = '', pageNumber, pageSize }: Isearch) => {
    try {
      const dbConnection = await createMongoConnection({});
      return makeCommentModelConnection({ dbConnection }).aggregate([
        ...(keyword ? (getSearchQuery({ keyword }) as any[]) : []),
        getFacetPagination(pageNumber, pageSize),
      ]);
    } catch (err) {
      throw err;
    }
  };

  const getComment = async ({ id }: { id: number }) => {
    try {
      const dbConnection = await createMongoConnection({});
      return makeCommentModelConnection({ dbConnection }).findOne({ id }).lean().select('-__v -_id');
    } catch (err) {
      throw err;
    }
  };

  const getCommentsByUserId = async ({ userId }: { userId: number }) => {
    try {
      const dbConnection = await createMongoConnection({});
      return makeCommentModelConnection({ dbConnection }).findOne({ userId }).lean().select('-__v -_id');
    } catch (err) {
      throw err;
    }
  };

  const createComment = async (data: Partial<IComment>) => {
    try {
      const dbConnection = await createMongoConnection({});
      return makeCommentModelConnection({ dbConnection }).create({ ...data });
    } catch (err) {
      throw err;
    }
  };

  const updateCommentById = async ({ id, dataToUpdate }: { id: number; dataToUpdate: Partial<IComment> }) => {
    try {
      const dbConnection = await createMongoConnection({});
      return await makeCommentModelConnection({ dbConnection })
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

  const deleteCommentById = async ({ id }: { id: number }) => {
    try {
      const dbConnection = await createMongoConnection({});
      return await makeCommentModelConnection({ dbConnection }).findOneAndDelete({ id });
    } catch (err) {
      throw err;
    }
  };
  return Object.freeze({
    getAllComments,
    getComment,
    createComment,
    updateCommentById,
    deleteCommentById,
    getCommentsByUserId,
  });
};

export default makeCommentCollection;
