import jwt from "jsonwebtoken";

const { SECRET_KEY } = process.env;

const setToken = async (payload) => {
  try {
    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "1h",
    });
    return token;
  } catch (error) {
    return `${error}`;
  }
};

const getToken = async (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    return `${error}`;
  }
};

export { setToken, getToken };
