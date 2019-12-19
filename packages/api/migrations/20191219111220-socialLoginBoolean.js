module.exports = {
  async up(db, client) {
    return db.collection("usermodels").updateMany(
      {
        $or: [
          { googleID: { $exists: true } },
          { microsoftID: { $exists: true } }
        ]
      },
      { $set: { socialLogin: true } }
    );
  },

  async down(db, client) {
    return db
      .collection("usermodels")
      .updateMany({}, { $unset: { socialLogin: 1 } });
  }
};
