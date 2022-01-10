const { db } = require("../../utils/admin");

class AuthUtils {
  static async isAdmin(uid) {
    return db
      .collection("USERS")
      .where("uid", "==", uid)
      .where("role", "==", 0)
      .get()
      .then((snap) => {
        if (snap.size > 0) return true;
        else throw new Error("User is not admin");
      })
      .catch((err) => {
        throw err;
      });
  }
  static async _userExists(uid) {
    return db
      .collection("USERS")
      .where("uid", "==", uid)
      .where("isExists", "==", true)
      .limit(1)
      .get()
      .then((snap) => {
        if (snap.size < 1) throw new Error("User not exists");
        else {
          return snap.docs[0].data();
        }
      })
      .catch((err) => {
        return err;
      });
  }
}

module.exports = AuthUtils;
