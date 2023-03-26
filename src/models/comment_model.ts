import { Mongoose, Schema, Document } from 'mongoose';

export interface IComment extends Document {
  postId: number;
  userId: number;
  id: number;
  body: string;
}

export const makeCommentModelConnection = ({ dbConnection }: { dbConnection: Mongoose }) => {
  try {
    return dbConnection.model<IComment>('Comment');
  } catch (e) {
    const CommentSchema = new Schema<IComment>(
      {
        postId: {
          type: Number,
          required: true,
        },
        userId: {
          type: Number,
          required: true,
        },
        id: {
          type: Number,
          unique: true,
        },
        body: {
          type: String,
          required: true,
        },
      },
      { timestamps: true, autoIndex: true }
    );

    CommentSchema.pre('save', async function (next: Function) {
      if (this.isNew) {
        const count = await this.collection.countDocuments();
        this.id = count + 1;
      }
      next();
    });

    CommentSchema.index({ body: 'text' });

    return dbConnection.model<IComment>('Comment', CommentSchema);
  }
};

export type makeCommentModelConnectionType = typeof makeCommentModelConnection;
