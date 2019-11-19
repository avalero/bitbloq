module.exports = {
  async up(db, client) {
    return db
      .collection("uploadmodels")
      .find({})
      .forEach(element => {
        db.collection("uploadmodels").updateOne(
          { _id: element._id },
          {
            $set: {
              preview: element.publicUrl
            }
          }
        );
      });
  },

  async down(db, client) {
    db.collection("uploadmodels").updateMany(
      {},
      {
        $unset: {
          preview: 1
        }
      }
    );
  }
};
