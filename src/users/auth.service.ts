import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { UsersService } from './users.service';

/**
 * @description Avoid callback style
 */
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email is use');
    }

    // Hash the user's password
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = await this.hashPassword(password, salt);

    // Join the hashed result and the salt together (salt.hash)
    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create(email, result);
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = await this.hashPassword(password, salt);

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    return user;
  }

  async hashPassword(password: string, salt: string) {
    return (await scrypt(password, salt, 32)) as Buffer;
  }
}
