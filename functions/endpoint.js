const { admin, db } = require("./utils/admin");

const endPoint = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split("Bearer ")[1];
    return admin
      .auth()
      .verifyIdToken(token)
      .then((decoded) => {
        req.user = {
          email: decoded.email,
          uid: decoded.uid,
        };
        console.log(
          `Requested ${req.protocol}${req.originalUrl}${req.url} ->${decoded.email}`
        );
        return next();
      })
      .catch((error) => {
        console.error(error);
        if (error.code === "auth/id-token-expired") {
          return res.status(401).json({
            message: `Token has expired please try again!!! with new Token`,
          });
        }
        return res.status(500).json({ message: `invalid token` });
      });
  } else {
    return res.status(403).json({ error: `UnAuthorised` });
  }
};

const getIdToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const token = req.headers.authorization.split("Bearer ")[1];
    return admin
      .auth()
      .verifyIdToken(token)
      .then((decoded) => {
        console.log(
          `Requested ${req.protocol}${req.originalUrl}${req.url} ->${decoded.email}`
        );
        req.user = decoded;
        return db
          .collection("USERS")
          .where("uid", "==", req.user.uid)
          .limit(1)
          .get();
      })
      .then((data) => {
        req.user.name = data.docs[0].data().name;
        req.user.imageUrl = data.docs[0].data().imageUrl;
        return next();
      })
      .catch((error) => {
        console.error(error);
        if (error.code === "auth/id-token-expired") {
          return res.status(401).json({
            message: `Token has expired please try again!!! with new Token`,
          });
        }
        return res.status(500).json({ message: `invalid token` });
      });
  } else {
    return res.status(403).json({ error: `UnAuthorised` });
  }
};
module.exports = { endPoint, getIdToken };
