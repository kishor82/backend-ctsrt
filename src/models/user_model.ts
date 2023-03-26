import bcrypt from 'bcryptjs';
import { Mongoose, Schema, Document } from 'mongoose';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IUser extends Document {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: Role;
}

export interface UserDocument extends IUser {
  matchPassword: (password: string) => boolean;
}

export const makeUserModelConnection = ({ dbConnection }: { dbConnection: Mongoose }) => {
  try {
    return dbConnection.model<UserDocument>('User');
  } catch (e) {
    const UserSchema = new Schema<IUser>(
      {
        id: {
          type: Number,
          unique: true,
        },
        name: {
          type: String,
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          unique: true,
          required: true,
        },
        password: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          enum: Role,
          default: Role.USER,
        },
      },
      { timestamps: true, autoIndex: true }
    );

    UserSchema.methods.matchPassword = async function (enteredPassword: string) {
      return await bcrypt.compare(enteredPassword, this.password as unknown as string);
    };
    /**
     * @middleware
     * Hash password before saving
     */
    UserSchema.pre('save', async function (next: Function) {
      if (this.isNew) {
        const count = await this.collection.countDocuments();
        this.id = count + 1;
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
      if (!this.isNew && this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
      next();
    });

    UserSchema.index({ name: 'text', username: 'text', email: 'text' });

    return dbConnection.model<UserDocument>('User', UserSchema);
  }
};
export type MakeUserModelConnectionType = typeof makeUserModelConnection;
