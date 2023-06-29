import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { databaseConfig } from 'src/config/configuration';
import { User } from 'src/user/entity/user.modal';
import * as bcrypt from 'bcrypt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

const mockedUser = {
  username: 'vl',
  email: 'vl@mail.ru',
  password: 'vl123',
};

describe('Auth service', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useClass: SequelizeConfigService,
        }),
        ConfigModule.forRoot({
          load: [databaseConfig],
        }),
        AuthModule,
      ],
    }).compile();

    authService = testModule.get<AuthService>(AuthService);
    app = testModule.createNestApplication();

    await app.init();
  });

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash(mockedUser.password, 10);

    const newUser = {
      username: mockedUser.username,
      password: hashedPassword,
      email: mockedUser.email,
    };
    return await User.create(newUser);
  });

  afterEach(async () => {
    await User.destroy({ where: { username: mockedUser.username } });
  });

  it('should login user', async () => {
    const user = await authService.validateUser(
      mockedUser.username,
      mockedUser.password,
    );

    expect(user.username).toBe(mockedUser.username);
    expect(user.email).toBe(mockedUser.email);
  });
});
