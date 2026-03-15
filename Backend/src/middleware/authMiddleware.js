import jwt from "jsonwebtoken";


// authnticate user 
const authUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

   
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    
    req.user = { id: decoded.id };

    next();

  } catch (error) {

    // Token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired, please login again",
      });
    }

    // Invalid token
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    console.error("Auth Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};

export default authUser;