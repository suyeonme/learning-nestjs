import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 1,
            email: 'suyeon@email.com',
            password: 'suyeon',
          } as User,
        ]);
      },
      findOne: (id: number) => {
        return Promise.resolve({
          id: 1,
          email: 'suyeon@email.com',
          password: 'suyeon',
        } as User);
      },
      // remove: (id: number) => {},
      // update: (id: number, attrs: Partial<User>) => {},
    };

    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      // signup: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('[findAllUsers] returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('suyeon@email.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('suyeon@email.com');
  });

  it('[findUser] returns a single user with the given email', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('[findUser] throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    try {
      await controller.findUser('2');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('user not found');
    }
  });

  it('[signin] signin updates session object and return user', async () => {
    const session = { userId: -1 };
    const user = await controller.signin(
      { email: 'suyeon@email.com', password: 'suyeon' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
