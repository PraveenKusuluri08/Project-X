const { db } = require("../../utils/admin");

class UserUtils {
  static async _isUserWithEmailExists(email) {
    return db
      .collection("USERS")
      .where("email", "==", email)
      .where("isExists", "==", true)
      .get()
      .then((doc) => {
        if (doc.size < 1)
          throw new Error(
            "User not exists with email!!Please check if the user is deleted account"
          );
        else return doc.docs[0].data();
      })
      .catch((err) => {
        return err;
      });
  }
}

module.exports = UserUtils;
