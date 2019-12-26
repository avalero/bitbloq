module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    await db
      .collection("documentmodels")
      .updateMany({}, { $rename: { folder: "parentFolder" } });
    await db
      .collection("foldermodels")
      .updateMany({}, { $rename: { parent: "parentFolder" } });
    await db
      .collection("submissionmodels")
      .updateMany({}, { $rename: { title: "name" } });
    await db
      .collection("exercisemodels")
      .updateMany({}, { $rename: { title: "name" } });
    return db
      .collection("documentmodels")
      .updateMany({}, { $rename: { title: "name" } });
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db
      .collection("documentmodels")
      .updateMany({}, { $rename: { parentFolder: "folder" } });
    await db
      .collection("foldermodels")
      .updateMany({}, { $rename: { parentFolder: "parent" } });
    await db
      .collection("submissionmodels")
      .updateMany({}, { $rename: { name: "title" } });
    await db
      .collection("exercisemodels")
      .updateMany({}, { $rename: { name: "title" } });
    return db
      .collection("documentmodels")
      .updateMany({}, { $rename: { name: "title" } });
  }
};
