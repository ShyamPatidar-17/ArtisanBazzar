import jwt from "jsonwebtoken";

const authUser = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      req.userRole = decoded.role;

      // Check role
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  };
};

export default authUser;
