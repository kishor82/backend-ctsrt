import { userCollection } from '../data_access';
import { Role } from '../models/user_model';

const users = [
  {
    name: 'user',
    username: 'user_name',
    email: 'user@email.com',
    role: Role.USER,
    password: 'user@123',
  },
  {
    name: 'admin',
    username: 'admin_user',
    email: 'admin@email.com',
    role: Role.ADMIN,
    password: 'admin@123',
  },
];

export const migrateUsers = async () => {
  for (const user of users) {
    const userExists = await userCollection.getUserByEmail({ email: user.email });
    if (!userExists) {
      await userCollection.createNewUser({ userData: user });
    }
  }
};
