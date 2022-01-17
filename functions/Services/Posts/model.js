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
      uid: this.actionPerformer.uid,
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
      commentLikes: 0,
      uid: this.actionPerformer.uid,
    };
    return PostsUtils._is_posts_exists(postId)
      .then((res) => {
        console.log(res);
        return db.collection("COMMENT").add(commentData);
      })
      .then(() => {
        const FieldValue = admin.firestore.FieldValue;
        db.collection("POSTS")
          .doc(postId)
          .update({ commentsCount: FieldValue.increment(1) });
      })
      .catch((err) => {
        throw err;
      });
  }

  //TODO:Run a background trigger when someone likes on the post

  async _like_On_Post(postId) {
    return new Promise((reslove, reject) => {
      const likes = db
        .collection("POST-LIKES")
        .where("email", "==", this.actionPerformer.email)
        .where("postId", "==", postId)
        .limit(1);

      const post = db.collection("POSTS").doc(postId);
      let postData;

      post
        .get()
        .then((doc) => {
          if (doc.exists) {
            postData = doc.data();
            postData.postId = doc.id;
            return likes.get();
          } else {
            reject("Document you are requesting is not exists");
          }
        })
        .then((snap) => {
          if (snap.empty) {
            return db
              .collection("POST-LIKES")
              .add({
                postId: postId,
                email: this.actionPerformer.email,
                likedAt: new Date().toISOString(),
                uid: this.actionPerformer.uid,
              })
              .then(() => {
                postData.likesCount++;
                return post.update({ likesCount: postData.likesCount });
              })
              .then(() => {
                reslove(postData);
              });
          } else {
            reject("Post Already liked");
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  async _like_On_Comment(commentId) {
    return new Promise((reslove, reject) => {
      const likes = db
        .collection("COMMENT-LIKES")
        .where("email", "==", this.actionPerformer.email)
        .where("commentId", "==", commentId)
        .limit(1);

      const comment = db.collection("COMMENT").doc(commentId);
      let commentData;

      comment
        .get()
        .then((doc) => {
          if (doc.exists) {
            commentData = doc.data();
            commentData.commentId = doc.id;
            return likes.get();
          } else {
            reject("Document you are requesting is not exists");
          }
        })
        .then((snap) => {
          if (snap.empty) {
            return db
              .collection("COMMENT-LIKES")
              .add({
                commentId: commentId,
                email: this.actionPerformer.email,
                likedAt: new Date().toISOString(),
                uid: this.actionPerformer.uid,
              })
              .then(() => {
                commentData.likesCount++;
                return comment.update({ likesCount: commentData.likesCount });
              })
              .then(() => {
                reslove(commentData);
              });
          } else {
            reject("Comment Already liked");
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  async _un_like_post(postId) {
    return new Promise((reslove, reject) => {
      const likes = db
        .collection("POST-LIKES")
        .where("email", "==", this.actionPerformer.email)
        .where("postId", "==", postId)
        .limit(1);

      const post = db.collection("POSTS").doc(postId);
      let postData;

      post
        .get()
        .then((doc) => {
          if (doc.exists) {
            postData = doc.data();
            postData.postId = doc.id;
            return likes.get();
          } else {
            reject("Document you are requesting is not exists");
          }
        })
        .then((snap) => {
          if (snap.empty) {
            reject("Like post before unliking");
          } else {
            return db
              .doc(`POST-LIKES/${snap.docs[0].id}`)
              .delete()
              .then(() => {
                postData.likesCount--;
                return post.update({ likesCount: postData.likesCount });
              })
              .then(() => {
                reslove(postData);
              });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  async _un_like_comment(commentId) {
    return new Promise((reslove, reject) => {
      const likes = db
        .collection("COMMENT-LIKES")
        .where("email", "==", this.actionPerformer.email)
        .where("commentId", "==", commentId)
        .limit(1);

      const comment = db.collection("COMMENT").doc(commentId);
      let commentData;

      comment
        .get()
        .then((doc) => {
          if (doc.exists) {
            commentData = doc.data();
            commentData.commentId = doc.id;
            return likes.get();
          } else {
            reject("Document you are requesting is not exists");
          }
        })
        .then((snap) => {
          if (snap.empty) {
            reject("Like comment before unliking");
          } else {
            return db
              .doc(`COMMENT-LIKES/${snap.docs[0].id}`)
              .delete()
              .then(() => {
                commentData.likesCount--;
                return comment.update({ likesCount: commentData.likesCount });
              })
              .then(() => {
                reslove(commentData);
              });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async _delete_post(postId) {
    return new Promise((resolve, reject) => {
      const postDb = db.collection("POSTS").doc(postId);
      PostsUtils._is_posts_exists(postId)
        .then((docs) => {
          console.log(docs);
          postDb
            .delete()
            // .then(() => {
            //   return db
            //     .collection("COMMENT")
            //     .where("postId", "==", postId)
            //     .get()
            //     .then((snap) => {
            //       return snap.forEach(({ ref }) => {
            //         ref.delete();
            //       });
            //     });
            // })
            .then(() => {
              resolve("Post deleted successfully");
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  async notificationReadMark(body) {
    let batch = db.batch();

    body.forEach((notId) => {
      const notification = db.collection("NOTIFICATIONS").doc(notId);
      batch.update(notification, { read: true });
    });
    batch
      .commit()
      .then(() => {
        return "Notification is read";
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }
}

module.exports = Posts;
