import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { databaseConfig } from 'src/config/configuration';
import { User } from 'src/user/entity/user.modal';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import * as session from 'express-session';
import * as passport from 'passport';
import { AuthModule } from 'src/auth/auth.module';

const mockedUser = {
  username: 'vl',
  email: 'vl@mail.ru',
  password: 'vl123',
};

describe('Auth controller', () => {
  let app: INestApplication;
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

    app = testModule.createNestApplication();
    app.use(
      session({
        secret: 'keyword',
        resave: false,
        saveUninitialized: false,
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
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
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    expect(response.body.user.username).toBe(mockedUser.username);
    expect(response.body.msg).toBe('logged');
    expect(response.body.user.email).toBe(mockedUser.email);
  });

  it('should login check', async () => {
    const login = await request(app.getHttpServer())
      .post('/user/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const loginCheck = await request(app.getHttpServer())
      .get('/user/login-check')
      .set('Cookie', login.header['set-cookie']);

    expect(loginCheck.body.username).toBe(mockedUser.username);
    expect(loginCheck.body.email).toBe(mockedUser.email);
  });

  it('should logout', async () => {
    const login = await request(app.getHttpServer())
      .post('/user/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer()).get('/user/logout');
    console.log(response);
    expect(response.body.msg).toBe('session has ended');
  });
});
