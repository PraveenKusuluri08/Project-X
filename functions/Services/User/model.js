const { reduceUserDetails } = require("../../helpers/utils");
const { db, storage, admin } = require("../../utils/admin");
const AuthUtils = require("../Authentication/utils");
class User {
  constructor(user) {
    this.actionPerformer = user;

    this.fieldValue = admin.firestore.FieldValue;
  }

  async updateUserProfile(inputData, userId) {
    const updateData = {
      name: inputData.name,
      lastUpdate: new Date().toISOString(),
    };
    console.log(this.actionPerformer);
    // let userDetails = reduceUserDetails(inputData);
    return AuthUtils._userExists(userId)
      .then(() => {
        db.collection("USERS").doc(userId).update(updateData);
      })
      .catch((err) => {
        throw err;
      });
  }
  /** 
  @getAuthUserData 
      this function is mainly useful for to get the loggedIn userData
      data which we need to recieve is personal userData, likes, posts
  */
  async getAuthUserData() {
    let user = {};
    return db
      .collection("USERS")
      .doc(this.actionPerformer.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          user["creds"] = doc.data();
          return db
            .collection("POST-LIKES")
            .where("email", "==", this.actionPerformer.email)
            .get();
        }
      })
      .then((data) => {
        user["likes"] = [];
        data.forEach((like) => {
          user["likes"].push(like.data());
        });
        return db
          .collection("POSTS")
          .where("email", "==", this.actionPerformer.email)
          .get();
      })
      .then((postsData) => {
        user["posts"] = [];

        postsData.forEach((post) => {
          user["posts"].push(post.data());
        });
        return user;
      })
      .catch((err) => {
        throw err;
      });
  }

  async deleteProfilePic(filename) {
    let dbRef = db.collection("USERS").doc(this.actionPerformer.uid);
    return dbRef
      .update({
        imageUrl: this.fieldValue.delete(),
      })
      .then((ref) => {
        console.log("ref", ref);
        return storage.bucket().file(filename).delete();
      })
      .then(() => {
        const startImage = "cover.jpg";
        return db.doc(`USERS/${this.actionPerformer.uid}`).set(
          {
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/fir-realworld-d5b34.appspot.com/o/${startImage}?alt=media`,
          },
          { merge: true }
        );
      })
      .catch((err) => {
        throw err;
      });
  }

  //TODO: soft delete of the user account
  //TODO: Disable all the services and authentication until unless user retrive their comment
}

module.exports = User;
