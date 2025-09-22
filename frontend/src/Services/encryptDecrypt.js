import CryptoJS from "crypto-js";

const secretKey = CryptoJS.enc.Utf8.parse(
  process.env.NEXT_PUBLIC_ENCRYPT_SECRET_AES_KEY
);
const iv = CryptoJS.enc.Utf8.parse(
  process.env.NEXT_PUBLIC_ENCRYPT_SECRET_AES_IV
);

// 🔒 Encrypt Function
export const encryptData = (data) => {
  try {
    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
      return "";
    }

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString(); // base64 string
  } catch (err) {
    console.error("Frontend Encryption failed:", err);
    return "";
  }
};

// 🔓 Decrypt Function
export const decryptData = (encryptedText) => {
  try {
    if (!encryptedText || encryptedText.trim() === "") {
      return "";
    }

    const decrypted = CryptoJS.AES.decrypt(encryptedText, secretKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const result = decrypted.toString(CryptoJS.enc.Utf8);
    return result ? JSON.parse(result) : "";
  } catch (err) {
    console.error("Frontend Decryption failed:", err);
    return "";
  }
};
