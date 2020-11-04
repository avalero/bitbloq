module.exports = {
  async up(db, client) {
    const users = await db
      .collection("usermodels")
      .find({ rootFolder: null })
      .toArray();
    console.log(users);
    return await users.forEach(async user => {
      console.log("entra");
      const [userDocs, userFols] = await Promise.all([
        db
          .collection("documentmodels")
          .find({
            user: user._id
          })
          .toArray(),
        db
          .collection("foldermodels")
          .find({
            user: user._id
          })
          .toArray()
      ]);
      console.log(userDocs.length, userFols.length);
      return db
        .collection("foldermodels")
        .insertOne({
          name: "root",
          user: user._id,
          documentsID: userDocs.map(i => i._id),
          foldersID: userFols.map(i => i._id)
        })
        .then(res => {
          console.log(res);
          Promise.all([
            console.log("promise1"),
            db
              .collection("documentmodels")
              .updateMany(
                { user: user._id },
                { $set: { parentFolder: res._id } }
              ),
            db
              .collection("foldermodels")
              .updateMany(
                { user: user._id, name: { $ne: "root" } },
                { $set: { parentFolder: res._id } }
              ),
            db
              .collection("usermodels")
              .updateOne(
                { _id: user._id },
                { $set: { rootFolder: res._id } },
                { new: true }
              )
          ]);
        });
      console.log("folder", { userFolder });
      const res = await Promise.all([
        console.log("promise1"),
        db
          .collection("documentmodels")
          .updateMany(
            { user: user._id },
            { $set: { parentFolder: userFolder._id } }
          ),
        db
          .collection("foldermodels")
          .updateMany(
            { user: user._id, name: { $ne: "root" } },
            { $set: { parentFolder: userFolder._id } }
          ),
        db
          .collection("usermodels")
          .updateOne(
            { _id: user._id },
            { $set: { rootFolder: userFolder._id } },
            { new: true }
          )
      ]);
      console.log({ res });
      return;
    });
  },

  async down(db, client) {
    // return await Promise.all([
    //   db.collection("foldermodels").deleteMany({name: "root"}),
    //   db.collection("documentmodels").updateMany({},{$unset: {parentFolder:1}}),
    //   db.collection("foldermodels").updateMany({},{$unset: {parentFolder:1}}),
    //   db.collection("usermodels").updateMany({},{$unset: {rootFolder:1}}),
    // ])
  }
};
