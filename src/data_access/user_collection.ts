import { Isearch, UserCollectionInputType } from './types';
import { IUser } from '../models/user_model';
import { getFacetPagination, getSearchQuery } from '../utils';

const makeUserCollection = ({ createMongoConnection, makeUserModelConnection }: UserCollectionInputType) => {
  const getAllUsers = async ({ keyword = '', pageNumber, pageSize }: Isearch) => {
    try {
      const dbConnection = await createMongoConnection({});
      return makeUserModelConnection({ dbConnection }).aggregate([
        ...(keyword ? (getSearchQuery({ keyword }) as any[]) : []),
        getFacetPagination(pageNumber, pageSize),
      ]);
    } catch (err) {
      throw err;
    }
  };

  const getUserByEmail = async ({ email }: { email: string }) => {
    try {
      const dbConnection = await createMongoConnection({});
      return makeUserModelConnection({ dbConnection }).findOne({ email });
    } catch (err) {
      throw err;
    }
  };

  const getUserById = async ({ id }: { id: number }) => {
    try {
      const dbConnection = await createMongoConnection({});
      return makeUserModelConnection({ dbConnection }).findOne({ id }).lean().select('-__v -_id -password');
    } catch (err) {
      throw err;
    }
  };

  const createNewUser = async ({ userData }: any) => {
    try {
      const dbConnection = await createMongoConnection({});
      return makeUserModelConnection({ dbConnection }).create({ ...userData });
    } catch (err) {
      throw err;
    }
  };

  const updateUserById = async ({ id, dataToUpdate }: { id: number; dataToUpdate: Partial<IUser> }) => {
    try {
      const dbConnection = await createMongoConnection({});
      const user = await makeUserModelConnection({ dbConnection }).findOne({ id }).exec();
      if (!user) {
        throw new Error('User not found');
      }
      user.set(dataToUpdate);
      return await user.save();
    } catch (err) {
      throw err;
    }
  };

  const deleteUserById = async ({ id }: { id: number }) => {
    try {
      const dbConnection = await createMongoConnection({});
      return await makeUserModelConnection({ dbConnection }).findOneAndDelete({ id });
    } catch (err) {
      throw err;
    }
  };
  return Object.freeze({
    getAllUsers,
    getUserById,
    createNewUser,
    updateUserById,
    deleteUserById,
    getUserByEmail,
  });
};

export default makeUserCollection;
