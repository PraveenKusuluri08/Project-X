const { admin, db } = require("../../utils/admin");
const PostsUtils = require("./utils");
class Posts {
  constructor(user) {
    this.actionPerformer = user;
  }

  async getAllPosts() {
    let postsData = [];
    return db
      .collection("POSTS")
      .orderBy("createdAt", "desc")
      .get()
      .then((data) => {
        data.forEach((doc) => {
          postsData.push({
            postId: doc.id,
            post: doc.data().body,
            createdAt: doc.data().createdAt,
            likesCount: doc.data().likesCount,
            userImage: doc.data().userImage,
          });
        });
        return postsData;
      })
      .catch((err) => {
        throw err;
      });
  }

  async createPost(inputs) {
    console.log(this.actionPerformer);
    const startImage = "cover.jpg";
    let postCreatorImage = "";
    const imageLoader = `https://firebasestorage.googleapis.com/v0/b/fir-realworld-d5b34.appspot.com/o/${startImage}?alt=media`;
    if (this.actionPerformer.imageUrl === undefined) {
      postCreatorImage = imageLoader;
    } else {
      postCreatorImage = this.actionPerformer.imageUrl;
    }
    const postsData = {
      post: inputs.post,
      createdAt: new Date().toISOString(),
      email: this.actionPerformer.email,
      userImage: postCreatorImage,
      likesCount: 0,
      commentsCount: 0,
      isExists: true,
    };
    let postDb = db.collection("POSTS").doc();
    return postDb
      .set({
        ...postsData,
        postId: postDb.id,
      })
      .catch((err) => {
        throw err;
      });
  }
  async _getPostWithComments(postId) {
    let postData = {};
    let commentDb = db.collection("COMMENT").orderBy("commentedAt", "desc");
    return db
      .collection("POSTS")
      .doc(postId)
      .get()
      .then((data) => {
        postData = data.data();
        postData["postId"] = postId;

        let comments = commentDb.where("postId", "==", postId).get();
        return comments;
      })
      .then((data) => {
        postData["comments"] = [];
        data.forEach((doc) => {
          postData["comments"].push(doc.data());
        });
        return postData;
      })
      .catch((err) => {
        throw err;
      });
  }
  async _do_Comment(inputs, postId) {
    if (inputs.comment.trim() === "") {
      throw new Error("Do you want to comment");
    }
    const startImage = "cover.jpg";
    let postCreatorImage = "";
    const imageLoader = `https://firebasestorage.googleapis.com/v0/b/fir-realworld-d5b34.appspot.com/o/${startImage}?alt=media`;
    if (this.actionPerformer.imageUrl === undefined) {
      postCreatorImage = imageLoader;
    } else {
      postCreatorImage = this.actionPerformer.imageUrl;
    }
    //create comment likes form the front end
    const commentData = {
      email: this.actionPerformer.email,
      postId: postId,
      comment: inputs.comment,
      commentedAt: new Date().toISOString(),
      CommenterImageUrl: postCreatorImage,
    };
   return PostsUtils._is_posts_exists(postId)
      .then((res) => {
        console.log(res);
        return db
          .collection("COMMENT")
          .add(commentData)
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  }
}

module.exports = Posts;
