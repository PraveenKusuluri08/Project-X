const bcrypt = require("bcrypt");

class HelperUtils {
  isEmail = (email) => {
    const exp =
      /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(exp)) return true;
    else return false;
  };
  isEmpty = (string) => {
    if (string.trim() === "") return true;
    else return false;
  };
  isValidPassword(password) {
    const exp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;

    if (password.match(exp)) return true;
    else return false;
  }
}

const validationCreateUser = (inputs) => {
  let err = {};
  let obj = new HelperUtils();
  if (obj.isEmpty(inputs.email)) {
    err.email = "Please enter Email Address";
  } else if (!obj.isEmail(inputs.email)) {
    err.email = "Please enter a valid email";
  }
  if (obj.isEmpty(inputs.password)) {
    err.password = "Please enter Password";
  } else if (!obj.isValidPassword(inputs.password)) {
    //TODO:Rules need to appear from the front end side
    err.password = "Please enter a valid password! see the rules below";
  }
  return {
    err,
    valid: Object.keys(err).length == 0 ? true : false,
  };
};

const checkUpdateFieldsIsEmpty = (inputs) => {
  let errors = {};
  let obj = new HelperUtils();

  if (obj.isEmpty(inputs.email)) {
    errors["email"] = "Please fill email address";
  } else if (!obj.isEmail(inputs.email)) {
    errors.email = "Please enter a valid email";
  }
  if (obj.isEmpty(inputs.name)) {
    errors["name"] = "Please fill the name";
  }
};

const reduceUserDetails = (data) => {
  console.log("data", data["website"]);
  let userDetails = {};
  const obj = new HelperUtils();
  if (!obj.isEmpty(data.bio.trim())) userDetails.bio = data.bio;

  if (!obj.isEmpty(data["website"].trim())) {
    if (data.website.trim().substring(0, 4, "http")) {
      userDetails.website = `htpp://${data.website.trim()}`;
    } else {
      userDetails.website = data.website;
    }
    if (!obj.isEmpty(data.location.trim()))
      userDetails.location = data.location;
    return userDetails;
  }
};

const checkCreatePost = (inputs) => {
  let empties;
  const obj = new HelperUtils();
  if (obj.isEmpty(inputs.body.trim()))
    empties = "Please fill the body for the post";

  return empties;
};

async function hashPassword(inputData) {
  console.log("hashPassword", inputData);
  bcrypt.hash(inputData["password"], 100).then((hash)=>{
    console.log(hash)
});
  
}

module.exports = {
  validationCreateUser,
  checkUpdateFieldsIsEmpty,
  reduceUserDetails,
  checkCreatePost,
  hashPassword,
};
