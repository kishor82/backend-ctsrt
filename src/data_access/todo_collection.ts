import { Isearch, TodoCollectionInputType } from './types';
import { ITodo } from '../models/todo_model';
import { getFacetPagination, getSearchQuery } from '../utils';

const makeTodoCollection = ({ createMongoConnection, makeTodoModelConnection }: TodoCollectionInputType) => {
  const getAllTodos = async ({ keyword = '', pageNumber, pageSize }: Isearch) => {
    try {
      const dbConnection = await createMongoConnection({});
      return makeTodoModelConnection({ dbConnection }).aggregate([
        ...(keyword ? (getSearchQuery({ keyword }) as any[]) : []),
        getFacetPagination(pageNumber, pageSize),
      ]);
    } catch (err) {
      throw err;
    }
  };

  const getTodo = async ({ id }: { id: number }) => {
    try {
      const dbConnection = await createMongoConnection({});
      return makeTodoModelConnection({ dbConnection }).findOne({ id }).lean().select('-__v -_id');
    } catch (err) {
      throw err;
    }
  };

  const getTodoByUserId = async ({ userId }: { userId: number }) => {
    try {
      const dbConnection = await createMongoConnection({});
      return makeTodoModelConnection({ dbConnection }).findOne({ userId }).lean().select('-__v -_id');
    } catch (err) {
      throw err;
    }
  };

  const addNewTodo = async (data: Partial<ITodo>) => {
    try {
      const dbConnection = await createMongoConnection({});
      return makeTodoModelConnection({ dbConnection }).create({ ...data });
    } catch (err) {
      throw err;
    }
  };

  const updateTodoById = async ({ id, dataToUpdate }: { id: number; dataToUpdate: Partial<ITodo> }) => {
    try {
      const dbConnection = await createMongoConnection({});
      return await makeTodoModelConnection({ dbConnection })
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

  const deleteTaskById = async ({ id }: { id: number }) => {
    try {
      const dbConnection = await createMongoConnection({});
      return await makeTodoModelConnection({ dbConnection }).findOneAndDelete({ id });
    } catch (err) {
      throw err;
    }
  };

  return Object.freeze({
    deleteTaskById,
    updateTodoById,
    addNewTodo,
    getAllTodos,
    getTodo,
    getTodoByUserId,
  });
};

export default makeTodoCollection;
