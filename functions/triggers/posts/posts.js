const { db } = require("../../utils/admin");

const onPostLikes = (snap) => {
  db.collection("POSTS")
    .doc(snap.data().postId)
    .get()
    .then((doc) => {
      if (doc.exists && doc.data().email!==snap.data().email) {
        const schema = {
          createdAt: new Date().toISOString(),
          reciever: doc.data().email,
          sender: snap.data().email,
          type: "like-on-post",
          read: false,
          postId: doc.id,
        };
        return db
          .collection("NOTIFICATIONS")
          .doc(snap.id)
          .set(
            {
              ...schema,
            },
            { merge: true }
          )
          .then(() => {
            return;
          })
          .catch((err) => {
            console.log(err);
            return err;
          });
      }
    });
};

const onCommentOnPost = (snap) => {
  db.collection("POSTS")
    .doc(snap.data().postId)
    .get()
    .then((doc) => {
      if (doc.exists && doc.data().email!==snap.data().email) {
        const schema = {
          createdAt: new Date().toISOString(),
          reciever: doc.data().email,
          sender: snap.data().email,
          type: "on-comment",
          read: false,
          postId: doc.id,
        };
        return db
          .collection("NOTIFICATIONS")
          .doc(snap.id)
          .set(
            {
              ...schema,
            },
            { merge: true }
          )
          .then(() => {
            return;
          })
          .catch((err) => {
            console.log(err);
            return err;
          });
      }
    });
};

const unLikeOnPost = (snap) => {
  db.collection("NOTIFICATIONS")
    .doc(snap.id)
    .delete()
    .then(() => {
      return;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

const onPostDelete = (snap, context) => {
  const batch = db.batch();
  const { postId } = context.params;
  let commentId =""
  return db
    .collection("COMMENT")
    .where("postId", "==", postId)
    .get()
    .then((data) => {
      data.forEach((doc) => {
        commentId=doc.id
        batch.delete(db.collection("POSTS").doc(doc.id));
      });
      return db.collection("POST-LIKES").where("postId", "==",postId).get()
    }).then((data)=>{
      data.forEach((doc)=>{
        batch.delete(db.collection("POST-LIKES").doc(doc.id))
      })
      batch.delete(db.collection("COMMENT-LIKES").doc(commentId))
      return db.collection("NOTIFICATIONS").where("postId","==",postId).get()
    }).then((data)=>{
      data.forEach((doc)=>{
        batch.delete(db.collection("NOTIFICATIONS").doc(doc.id))
      })
      return batch.commit()
    }).catch((err)=>{
      console.log(err)
    })
};

module.exports = { onPostLikes, onCommentOnPost, unLikeOnPost, onPostDelete };
