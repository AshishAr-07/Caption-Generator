import jwt from "jsonwebtoken";
 const generateToken = (email) => {

    const accessToken=jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: "1 day" });
    return accessToken;
};

export default generateToken;