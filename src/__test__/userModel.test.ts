import * as mongoose from "mongoose";
const user = require("../models/userModel");
const document_ = require("../models/documentModel");
const exercise = require("../models/exerciseModel");

describe("ADD new user", () => {
  mongoose.connect(
    `mongodb://localhost/back_bitbloq_db`, //  <------- IMPORTANT
    { useNewUrlParser: true },
  );
  test("should register a new user, with document and exercise", async () => {
    await new user({
      email: "aaa1@bbb.com",
      password: "pass",
      name: "Pepe",
      center: "GGM",
      active: true,
      signUpToken: 1,
      authToken: 2,
      notifications: false,
      created_date: Date.now(),
    }).save(async () => {
      const espera = await user.findOne({ email: "aaa1@bbb.com" });
      expect(espera.email).toEqual("aaa1@bbb.com");
      await new document_({
        user: espera._id,
        title: "Prueba1",
        type: "3D",
        description: "Hola hola",
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
        const docesp = await document_.findOne({ title: "Prueba1" });
        expect(docesp.title).toEqual("Prueba1");
        await new exercise({
          document: docesp._id,
          code: "22222",
          versions: [
            {
              content: JSON,
              date: Date.now(),
              id: 345,
            },
          ],
          submission: [
            {
              nick: "Pepito1",
              content: JSON,
              date: Date.now(),
              // id: Number,
              comment: "Lo he hecho muy bien",
            },
          ],
          expireDate: {
            expireTime: Date.now() + 4000,
          },
        }).save();
        const exesp = await exercise.findOne({ code: "22222" });
        expect(exesp.code).toEqual("22222");
      });
    });
  });
  mongoose.connection.dropDatabase().then(() => {
    mongoose.connection.close();
  });
});
