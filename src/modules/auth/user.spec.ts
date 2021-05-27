import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User entity', () => {
  it('should validate password', async () => {
    const user = new User();

    const password = 'testPassword';

    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);

    expect(await user.validatePassword(password)).toEqual(true);
  });
});
