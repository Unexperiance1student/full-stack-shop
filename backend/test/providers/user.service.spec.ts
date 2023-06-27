import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { databaseConfig } from 'src/config/configuration';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entity/user.modal';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

describe('User Service', () => {
  let app: INestApplication;
  let userService: UserService;
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
        UserModule,
      ],
    }).compile();

    userService = testModule.get<UserService>(UserService);
    app = testModule.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await User.destroy({ where: { username: 'test' } });
  });

  it('should create user', async () => {
    const newUser = {
      username: 'test',
      email: 'test@list.ru',
      password: 'test123',
    };
    const pass = newUser.password;
    const user = (await userService.create(newUser)) as User;

    const passwordIsValid = await bcrypt.compare(pass, user.password);

    expect(user.username).toBe(newUser.username);
    expect(user.email).toBe(newUser.email);
    expect(passwordIsValid).toBe(true);
  });
});
