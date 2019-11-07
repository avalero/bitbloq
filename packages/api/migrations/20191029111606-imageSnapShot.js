module.exports = {
  up(db) {
    // TODO write your migration here. Return a Promise (and/or use async & await).
    return db
      .collection("documentmodels")
      .find({})
      .forEach(element => {
        if (element.image && typeof element.image === "string") {
          db.collection("documentmodels").updateOne(
            { _id: element._id },
            {
              $set: {
                image: {
                  image: element.image,
                  isSnapshot: element.image.indexOf("blob") > -1
                }
              }
            }
          );
        }
      });
  },

  down(db) {
    // TODO write the statements to rollback your migration (if possible)
    return db
      .collection("documentmodels")
      .find({})
      .forEach(element => {
        if (element.image.image) {
          db.collection("documentmodels").updateOne(
            { _id: element._id },
            { $set: { image: element.image.image } }
          );
        }
      });
  }
};
