import CryptoJS from "crypto-js";

const cryptoKey = "C4o3U2r1S0e1M2a3N4a5G6e7M8e9N8t7P6r5O4j3E2c1T0";
const useEncryption = {
  encryptData: (text) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = CryptoJS.AES.encrypt(
          JSON.stringify(text),
          cryptoKey
        ).toString();
        return resolve(data);
      } catch (error) {
        console.log("encode error:", error);
        return resolve({
          status: false,
          message: "Something is wrong while send request.",
        });
      }
    });
  },
  decryptData: (encryptedData) => {
    return new Promise(async (resolve) => {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, cryptoKey);
        const originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        return resolve(originalText);
      } catch (error) {
        console.log("decode error:", error);
        return resolve({
          status: false,
          message: "Something is wrong while send request.",
        });
      }
    });
  },
};

export default useEncryption;
