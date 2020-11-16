module.exports = {
  async up(db, client) {
    const users = await db
      .collection("usermodels")
      .find({ active: true, rootFolder: null })
      .toArray();
    for (user of users) {
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
      const [docsId, folsId] = await Promise.all([
        userDocs.map(i => i._id),
        userFols.map(i => i._id)
      ]);
      await db
        .collection("foldermodels")
        .insertOne({
          name: "root",
          user: user._id,
          documentsID: docsId,
          foldersID: folsId
        });
      const folder = await db.collection("foldermodels").findOne({
        user: user._id,
        name: "root"
      });
      await Promise.all([
        db
          .collection("documentmodels")
          .updateMany(
            { user: user._id },
            { $set: { parentFolder: folder._id } }
          ),
        db
          .collection("foldermodels")
          .updateMany(
            { user: user._id, name: { $ne: "root" } },
            { $set: { parentFolder: folder._id } }
          ),
        db
          .collection("usermodels")
          .updateOne(
            { _id: user._id },
            { $set: { rootFolder: folder._id } },
            { new: true }
          )
      ]);
    }
    return "Ok";
  },

  async down(db, client) {
    return await Promise.all([
      db.collection("foldermodels").deleteMany({ name: "root" }),
      db
        .collection("documentmodels")
        .updateMany({}, { $unset: { parentFolder: 1 } }),
      db
        .collection("foldermodels")
        .updateMany({}, { $unset: { parentFolder: 1 } }),
      db.collection("usermodels").updateMany({}, { $unset: { rootFolder: 1 } })
    ]);
  }
};
