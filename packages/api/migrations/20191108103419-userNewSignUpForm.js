module.exports = {
  up(db) {
    return db
      .collection("usermodels")
      .find({})
      .forEach(element => {
        const names = element.name.split(" ");
        const surnames = names.slice(1).join(" ");
        db.collection("usermodels").findOneAndUpdate(
          { _id: element._id },
          {
            $set: {
              name: names[0],
              surnames: surnames,
              birthDate: new Date(0),
              imTeacherCheck: false,
              centerName: "",
              educationalStage: "",
              province: "",
              postCode: 0,
              country: "",
              finishedSignUp: true
            }
          }
        );
      });
  },

  down(db) {
    db.collection("usermodels")
      .find({})
      .forEach(element => {
        db.collection("usermodels").findOneAndUpdate(
          { _id: element._id },
          {
            $set: {
              name: element.name + " " + element.surnames
            }
          }
        );
      });
    return db.collection("usermodels").updateMany(
      {},
      {
        $unset: {
          surnames: 1,
          birthDate: 1,
          imTeacherCheck: 1,
          centerName: 1,
          educationalStage: 1,
          province: 1,
          postCode: 1,
          country: 1,
          finishedSignUp: 1
        }
      }
    );
  }
};
