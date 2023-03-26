import { Mongoose, Schema, Document } from 'mongoose';

export interface ITodo extends Document {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const makeTodoModelConnection = ({ dbConnection }: { dbConnection: Mongoose }) => {
  try {
    return dbConnection.model<ITodo>('Todo');
  } catch (e) {
    const TodoSchema = new Schema<ITodo>(
      {
        userId: {
          type: Number,
          required: true,
        },
        id: {
          type: Number,
          unique: true,
        },
        title: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
      { timestamps: true, autoIndex: true }
    );

    TodoSchema.pre('save', async function (next: Function) {
      if (this.isNew) {
        const count = await this.collection.countDocuments();
        this.id = count + 1;
      }
      next();
    });

    TodoSchema.index({ title: 'text' });

    return dbConnection.model<ITodo>('Todo', TodoSchema);
  }
};

export type makeTodoModelConnectionType = typeof makeTodoModelConnection;
