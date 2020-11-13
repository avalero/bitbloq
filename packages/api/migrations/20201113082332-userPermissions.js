const USER_PERMISSIONS = {
  basic: "user",
  publisher: "publisher",
  teacher: "teacher"
};

module.exports = {
  async up(db, client) {
    return db
      .collection("usermodels")
      .find({})
      .forEach(user => {
        const userPerm = [USER_PERMISSIONS.basic];
        if (user.teacher) {
          userPerm.push(USER_PERMISSIONS.teacher);
        }
        if (user.publisher) {
          userPerm.push(USER_PERMISSIONS.publisher);
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
        if (user.permissions.includes(USER_PERMISSIONS.teacher)) {
          oldPerm.teacher = true;
        }
        if (user.permissions.includes(USER_PERMISSIONS.publisher)) {
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
