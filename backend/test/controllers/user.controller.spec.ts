import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { databaseConfig } from 'src/config/configuration';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entity/user.modal';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';

// const mockedUser = {
//   username: 'Jogn',
//   email: 'qwe@list.ru',
//   password: 'qwe123qwe',
// };

describe(' User controller', () => {
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
        UserModule,
      ],
    }).compile();

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

    const response = await request(app.getHttpServer())
      .post('/user/signup')
      .send(newUser);

    const passwordIsValid = await bcrypt.compare(
      newUser.password,
      response.body.password,
    );

    expect(response.body.username).toBe(newUser.username);
    expect(response.body.email).toBe(newUser.email);
    expect(passwordIsValid).toBe(true);
  });
});
