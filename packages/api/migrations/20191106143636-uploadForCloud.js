module.exports = {
  up(db) {
    return db
      .collection("uploadmodels")
      .find({})
      .forEach(element => {
        let type = "";
        let image = "";
        if (
          element.filename.toLowerCase().indexOf("blob") > -1 ||
          element.filename.toLowerCase().indexOf(".jpg") > -1 ||
          element.filename.toLowerCase().indexOf(".gif") > -1 ||
          element.filename.toLowerCase().indexOf(".jpeg") > -1 ||
          element.filename.toLowerCase().indexOf(".webp") > -1
        ) {
          type = "image";
          image = element.publicUrl;
        } else if (
          element.filename.toLowerCase().indexOf(".mp4") > -1 ||
          element.filename.toLowerCase().indexOf(".webm") > -1
        ) {
          type = "video";
          image = null;
        } else if (
          element.filename.toLowerCase().indexOf(".mp3") > -1 ||
          element.filename.toLowerCase().indexOf(".ogg") > -1
        ) {
          type = "sound";
          image = null;
        } else if (element.filename.toLowerCase().indexOf(".stl") > -1) {
          type = "object3D";
          image = null;
        }
        db.collection("uploadmodels").updateOne(
          { _id: element._id },
          {
            $set: {
              type,
              image,
              deleted: false,
              size: null
            }
          }
        );
      });
  },

  down(db) {
    return db
      .collection("uploadmodels")
      .updateMany({}, { $unset: { type: 1, image: 1, deleted: 1, size: 1 } });
  }
};
