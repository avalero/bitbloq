import * as mongoose from 'mongoose';
import { DocumentModel } from '../models/document';
import { ExerciseModel } from '../models/exercise';
import { LogModel } from '../models/logs';
import { SubmissionModel } from '../models/submission';
import { UserModel } from '../models/user';

describe('ADD new user', () => {
  mongoose.connect(
    `mongodb://localhost/back_bitbloq_db_test`, //  <------- IMPORTANT
    { useNewUrlParser: true },
  );
  test('should register a new user, with document and exercise', async () => {
    await new UserModel({
      email: 'aaa1@bbb.com',
      password: 'pass',
      name: 'Pepe',
      center: 'GGM',
      active: true,
      signUpToken: 1,
      authToken: 2,
      notifications: false,
      created_date: Date.now(),
    }).save(async () => {
      const espera = await UserModel.findOne({ email: 'aaa1@bbb.com' });
      expect(espera.email).toEqual('aaa1@bbb.com');
      await new DocumentModel({
        user: espera._id,
        title: 'Prueba1',
        type: '3D',
        description: 'Hola hola',
        versions: [
          {
            content: JSON,
            date: Date.now(),
            id: 123,
          },
        ],
        exercise: [
          {
            content: JSON,
            date: Date.now(),
            id: 456,
          },
        ],
      }).save(async () => {
        const docesp = await DocumentModel.findOne({ title: 'Prueba1' });
        expect(docesp.title).toEqual('Prueba1');
        await new ExerciseModel({
          document: docesp._id,
          expireDate: {
            expireTime: Date.now() + 4000,
          },
        }).save();
        const exesp = await ExerciseModel.findOne({ code: '22222' });
        expect(exesp.code).toEqual('22222');
      });
    });
  });
  mongoose.connection.dropDatabase().then(() => {
    mongoose.connection.close();
  });
});
