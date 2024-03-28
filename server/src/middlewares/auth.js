import { getToken } from "../utilities/auth.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = await getToken(token);
    console.log("Middleware dealerid ", decoded.id);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(501).json({ message: "Unauthorized" });
  }
};

export default isAuthenticated;
