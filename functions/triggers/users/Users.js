const { db } = require("../../utils/admin");

const onUserDeleteAccount = async (snap, context) => {
  const { uid } = context.params;
  let usersRef = await db.collection("USERS").doc(uid).get();
  const dbRef = db.collection("DELETE-USERS").doc(usersRef.email);
  const usersData = await usersRef.data();

  return dbRef
    .set(
      {
        ...usersData,
      },
      { merge: true }
    )
    .catch((err) => {
      console.log(err);
    });
};

const updateUserProfile = (snap, context) => {
  const { uid } = context.params;

  const after = snap.after.data();
  const previous = snap.before.data();

  if (previous !== after) {
    db.collection("USERS")
      .doc(uid)
      .collection("Last-Update")
      .add({
        ...after,
        updatedAt: new Date().toISOString(),
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }
};
module.exports = { onUserDeleteAccount, updateUserProfile };
