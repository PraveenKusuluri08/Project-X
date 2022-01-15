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

// const onPostDelete =(snap,context)=>{
//     const {postId} = context.params
// }

module.exports = { onUserDeleteAccount };
