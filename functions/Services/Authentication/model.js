const { admin, db } = require("../../utils/admin");
const AuthUtils = require("./utils");
const { hashPassword } = require("../../helpers/utils");
class Model {
  constructor(user) {
    this.actionPerformer = user;
  }
  async _create_user(inputs) {
    let userInfo = {};
    return admin
      .auth()
      .createUser({ email: inputs.email, password: inputs.password })
      .then((user) => {
        userInfo = user;
        return admin
          .auth()
          .setCustomUserClaims(user.uid, { email: inputs.email });
      })
      .then(() => {
        const inputData = {};
       
        Object.entries(inputs).forEach(([key, value]) => {
            if(key!=="password") inputData[key]=value
        });

        console.log(inputData);
        
        const startImage = "cover.jpg";
        return db
          .collection("USERS")
          .doc(userInfo.uid)
          .set({
            ...inputData,
            createdAt: new Date().toISOString(),
            uid: userInfo.uid,
            isExists: true,
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/fir-realworld-d5b34.appspot.com/o/${startImage}?alt=media`,
          });
      })
      .catch((err) => {
        throw err;
      });
  }
}

module.exports = Model;
