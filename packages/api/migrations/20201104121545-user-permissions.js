const USER_PERMISSIONS = {
  basic: "usr-",
  publisher: "pub-",
  teacher: "tch-"
};

module.exports = {
  async up(db, client) {
    return db
      .collection("usermodels")
      .find({})
      .forEach(user => {
        let userPerm = USER_PERMISSIONS.basic;
        if (user.teacher) {
          userPerm = userPerm.concat(USER_PERMISSIONS.teacher);
        }
        if (user.publisher) {
          userPerm = userPerm.concat(USER_PERMISSIONS.publisher);
        }
        db.collection("usermodels").findOneAndUpdate(
          { _id: user._id },
          {
            $set: { permissions: userPerm },
            $unset: {
              admin: 1,
              teacher: 1,
              teacherPro: 1,
              family: 1,
              publisher: 1
            }
          }
        );
      });
  },

  async down(db, client) {
    return db
      .collection("usermodels")
      .find({})
      .forEach(user => {
        const oldPerm = {
          admin: false,
          teacher: false,
          teacherPro: false,
          family: false,
          publisher: false
        };
        if (user.userPermissions.includes(USER_PERMISSIONS.teacher)) {
          oldPerm.teacher = true;
        }
        if (user.userPermissions.includes(USER_PERMISSIONS.publisher)) {
          oldPerm.publisher = true;
        }
        db.collection("usermodels").findOneAndUpdate(
          { _id: user._id },
          {
            $set: { ...oldPerm },
            $unset: {
              permissions: 1
            }
          }
        );
      });
  }
};
