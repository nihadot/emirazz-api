import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

  const token = req.headers.authorization;

  if (!token)
    return res.status(401).json({ message: "Your are not authenticated!" });

  const isToken = token.split(" ")[1];

  // console.log(isToken,'isToken')

  if (!isToken){
    return res.status(401).json({ message: "Your are not authenticated!" });
  }

    jwt.verify(isToken, process.env.JWT_SECRET, (err, user) => {
      if (err){
        return res
        .status(403)
        .json({ message: err?.message || "Token is not valid!" })
        .end();
      }
      req.user = user;
      next();
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {

    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "You are not authorized!" }).end();
    }
  });
};
export const verifyAgency = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAgency) {
      next();
    } else {
      return res.status(403).json({ message: "You are not authorized!" }).end();
    }
  });
};
export const verifyAdminOrAgency = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAgency || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "You are not authorized!" }).end();
    }
  });
};
export const verifyDeveloper = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isDeveloper) {
      next();
    } else {
      return res.status(403).json({ message: "You are not authorized!" }).end();
    }
  });
};
export const verifyAdminOrDeveloper = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAgency || req.user.isDeveloper) {
      next();
    } else {
      return res.status(403).json({ message: "You are not authorized!" }).end();
    }
  });
};
export const verifyAdminOrAgencyOrDeveloper = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAgency || req.user.isDeveloper || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "You are not authorized!" }).end();
    }
  });
};



export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isUser) {
      next();
    } else {
      return res.status(403).json({ message: "You are not authorized!" }).end();
    }
  });
};