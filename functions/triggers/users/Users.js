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

const onProfileChange = (snap) => {
  if (snap.before.data().imageUrl !== snap.after.data().imageUrl) {
    const batch = db.batch();
    return db
      .collection("POSTS")
      .where("email", "==", snap.before.data().email)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          const post = db.collection("POSTS").doc(doc.id);
          batch.update(post, { imageUrl: snap.after.data().imageUrl });
        });
        return batch.commit();
      });
  } else {
    return true;
  }
};
module.exports = { onUserDeleteAccount, updateUserProfile, onProfileChange };
