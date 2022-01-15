const { db } = require("../../utils/admin");

const onPostLikes = (snap) => {
  db.collection("POSTS")
    .doc(snap.data().postId)
    .get()
    .then((doc) => {
      if (doc.exists) {
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
      if (doc.exists) {
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

module.exports = { onPostLikes, onCommentOnPost, unLikeOnPost };
