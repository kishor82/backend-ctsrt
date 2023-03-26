import { Mongoose, Schema, Document } from 'mongoose';

export interface IPost extends Document {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const makePostModelConnection = ({ dbConnection }: { dbConnection: Mongoose }) => {
  try {
    return dbConnection.model<IPost>('Post');
  } catch (e) {
    const PostSchema = new Schema<IPost>(
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
        body: {
          type: String,
          required: true,
        },
      },
      { timestamps: true, autoIndex: true }
    );

    PostSchema.pre('save', async function (next: Function) {
      if (this.isNew) {
        const count = await this.collection.countDocuments();
        this.id = count + 1;
      }
      next();
    });

    PostSchema.index({ title: 'text', body: 'text' });

    return dbConnection.model<IPost>('Post', PostSchema);
  }
};

export type makePostModelConnectionType = typeof makePostModelConnection;
