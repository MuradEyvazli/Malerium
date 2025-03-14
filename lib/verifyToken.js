// /lib/verifyToken.js
import jwt from "jsonwebtoken";

export function verifyToken(token) {
  try {
    // JWT_SECRET değeri .env üzerinden alınabilir
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Token payload’ında user id varsa onu döndürün (örneğin: decoded.id)
    return decoded.id;
  } catch (error) {
    throw new Error("Token doğrulanamadı");
  }
}
