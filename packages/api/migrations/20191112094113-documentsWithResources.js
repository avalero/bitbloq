module.exports = {
  up(db) {
    db.collection("uploadmodels")
      .find({ document: { $ne: null } })
      .forEach(element => {
        db.collection("documentmodels").findOneAndUpdate(
          { _id: element.document },
          { $push: { resourcesID: element._id } }
        );
        db.collection("uploadmodels").findOneAndUpdate(
          { _id: element._id },
          { $push: { documentsID: element.document } }
        );
      });
    return db
      .collection("uploadmodels")
      .updateMany({}, { $unset: { document: 1 } });
  },

  down(db) {
    db.collection("uploadmodels")
      .find({ documentsID: { $ne: null } })
      .forEach(element => {
        db.collection("uploadmodels").findOneAndUpdate(
          { _id: element._id },
          { $set: { document: element.documentsID[0] } }
        );
      });
    db.collection("uploadmodels").updateMany(
      {},
      { $unset: { documentsID: 1 } }
    );
    return db
      .collection("documentmodels")
      .updateMany({}, { $unset: { resourcesID: 1 } });
  }
};
