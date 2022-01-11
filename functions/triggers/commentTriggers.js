const { admin, db } = require("../utils/admin");

async function commentIdUpdateTrigger(commentId) {
  try {
    let commentRef = await db.collection("COMMENT").doc(commentId);
    return await commentRef.set(
      {
        commentId: commentId,
      },
      { merge: true }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = { commentIdUpdateTrigger };
