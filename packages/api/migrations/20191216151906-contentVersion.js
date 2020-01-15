module.exports = {
  async up(db, client) {
    db.collection("submissionmodels").updateMany(
      {},
      { $set: { contentVersion: 0 } }
    );
    db.collection("exercisemodels").updateMany(
      {},
      { $set: { contentVersion: 0 } }
    );
    return db
      .collection("documentmodels")
      .updateMany({}, { $set: { contentVersion: 0 } });
  },

  async down(db, client) {
    db.collection("submissionmodels").updateMany(
      {},
      { $unset: { contentVersion: 1 } }
    );
    db.collection("exercisemodels").updateMany(
      {},
      { $unset: { contentVersion: 1 } }
    );
    return db
      .collection("documentmodels")
      .updateMany({}, { $unset: { contentVersion: 1 } });
  }
};
