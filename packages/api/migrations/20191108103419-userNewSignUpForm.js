module.exports = {
  up(db) {
    return db
      .collection("usermodels")
      .find({})
      .forEach(element => {
        const names = element.name.split(" ");
        let surnames = "";
        if (names.length > 1) {
          for (let i = 1; i < names.length; i++) {
            surnames += names[i] + " ";
          }
        }
        db.collection("usermodels").findOneAndUpdate(
          { _id: element._id },
          {
            $set: {
              name: names[0],
              surnames: surnames,
              bornDate: new Date(0),
              imTeacherCheck: false,
              centerName: "",
              educationalStage: "",
              province: "",
              postCode: 0,
              country: ""
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
          bornDate: 1,
          imTeacherCheck: 1,
          centerName: 1,
          educationalStage: 1,
          province: 1,
          postCode: 1,
          country: 1
        }
      }
    );
  }
};
