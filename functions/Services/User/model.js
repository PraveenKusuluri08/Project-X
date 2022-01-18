const { reduceUserDetails } = require("../../helpers/utils");
const { db, storage, admin } = require("../../utils/admin");
const AuthUtils = require("../Authentication/utils");
const UserUtils = require("./utils");
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
        return db
          .collection("NOTIFICATIONS")
          .where("sender", "==", this.actionPerformer.email)
          .orderBy("createdAt", "desc")
          .limit(10)
          .get()
          .then((data) => {
            user["notifications"] = [];
            data.forEach((doc) => {
              user["notifications"].push({
                ...doc.data(),
              });
            });
          });
      })
      .then(() => {
        return user;
      })
      .catch((err) => {
        throw err;
      });
  }

  async deleteProfilePic(filename) {
    new Promise((resolve, reject) =>{

      let dbRef = db.collection("USERS").doc(this.actionPerformer.uid);
      if(filename!=="cover.jpg")
        return dbRef
        .update({
          imageUrl: this.fieldValue.delete(),
      })
      .then((ref) => {
        console.log("ref", ref);
        if(filename!=="cover.jpg")
        return storage.bucket().file(filename).delete();
        else return
      })
      .then(() => {
        const startImage = "cover.jpg";
        return db.doc(`USERS/${this.actionPerformer.uid}`).set(
          {
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/fir-realworld-d5b34.appspot.com/o/${startImage}?alt=media`,
          },
          { merge: true }
        );
      }).then(()=>{

      })
      .catch((err) => {
        reject("Failed to delete image")
      });
    
  })
  }
  
  async getSeeTheUsersDataPublic(email) {
    try {
      let user = {};
       UserUtils._isUserWithEmailExists(email)
        .catch((err) => {
          throw err;
        })
        .then((data) => {
          user["user"] = data;
        });

      let promises = [];
      let postsData = await db
        .collection("POSTS")
        .where("email", "==", email)
        .get();
      console.log(postsData);

      user["posts"] = [];
      postsData.forEach((doc) => {
        user["posts"].push({
          ...doc.data(),
        });
      });
      promises.push(user);

      return await Promise.all(promises);
    } catch (err) {
      console.log("err🤐", err);

      throw err;
    }
  }

  //TODO: soft delete of the user account
  //TODO: Disable all the services and authentication until unless user retrive their comment
}

module.exports = User;
