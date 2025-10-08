
import CryptoJS from "crypto-js";

const SECRET_KEY = "myclientsecretkey"; 

export function encryptText(text: string): string {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}


export function decryptText(cipher: string): string {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
