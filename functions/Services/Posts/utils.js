const { admin, db } = require("../../utils/admin");

class PostsUtils {
  static async _is_posts_exists(postId) {
    return db
      .collection("POSTS")
      .where("postId", "==", postId)
      .where("isExists", "==", true)
      .limit(1)
      .get()
      .then((snap) => {
        console.log("snap",snap.docs[0].data())
        if (snap.size < 1) throw new Error("No post exists");
        else {
          snap.docs[0].data();
        }
      })
      .catch((err) => {
        return err;
      });
  }
}

module.exports = PostsUtils;
