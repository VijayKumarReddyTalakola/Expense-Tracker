import jwt from 'jsonwebtoken'

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).json({ error: "Please Provide Bearer Token" });
  }
  const token = authorization.split(" ")[1];
  if(!token){
    return res.status(400).json({ error: "Invalid Token" });
  }
  try {
    const { userId } = jwt.verify(token, process.env.SECRET);
    req.userId = userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Session Expired!" });
  }
};

export default requireAuth