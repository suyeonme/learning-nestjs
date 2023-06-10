import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of users service (as dependency)
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // Create DI container
    const module = await Test.createTestingModule({
      // providers: List of things that register in DI container
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    // create an instance of DI container
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('[signup] creates a new user with a slated and hashed password', async () => {
    const user = await service.signup('suyeon@email.com', 'suyeon');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('[signup] throws an error if user signs up with email that is in use', async () => {
    await service.signup('suyeon@email.com', 'suyeon');
    try {
      await service.signup('suyeon@email.com', 'suyeon');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('email is use');
    }
  });

  it('[signin] throws an error if signin is called with an unsed email', async () => {
    try {
      await service.signin('test@email.com', 'test');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('user not found');
    }
  });

  it('[signin] throws if an invalid password is provided', async () => {
    await service.signup('suyeon@email.com', 'suyeon');
    try {
      await service.signin('suyeon@email.com', 'wrongpassword');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('bad password');
    }
  });

  it('[signin] returns a user if correct password is provided', async () => {
    await service.signup('suyeon@email.com', 'suyeon');
    const user = await service.signin('suyeon@email.com', 'suyeon');
    expect(user).toBeDefined();
  });
});
