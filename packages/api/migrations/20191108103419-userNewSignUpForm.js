module.exports = {
  up(db) {
    return db
      .collection("usermodels")
      .find({})
      .forEach(element => {
        const name = element.name.split(" ")[0];
        const surnames = element.name.split(" ")[1];
        db.collection("usermodels").findOneAndUpdate(
          { _id: element._id },
          {
            $set: {
              name: name,
              surnames: surnames,
              bornDate: "01/01/1990",
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
              name: elment.name + " " + element.surnames
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
