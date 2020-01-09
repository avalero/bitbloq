module.exports = {
  async up(db, client) {
    return db
      .collection("uploadmodels")
      .find({ storageName: null })
      .forEach(element => {
        const storageName = element.publicUrl.split(
          `${process.env.GCLOUD_STORAGE_BUCKET}/`
        );
        db.collection("uploadmodels").updateOne(
          { _id: element._id },
          {
            $set: {
              storageName: storageName[1]
            }
          }
        );
      });
  },

  async down(db, client) {
    return db
      .collection("uploadmodels")
      .updateMany({}, { $unset: { storageName: 1 } });
  }
};
