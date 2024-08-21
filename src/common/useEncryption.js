import CryptoJS from "crypto-js";

const cryptoKey = 'yaxbw1cvdue9tfsgr2hriqj8pkoln3mmnlo7kpjqi4rhsgt6fuevd5wcxby0az'
const useEncryption =  {
  encryptData: (text) => {
    return new Promise(async (resolve,reject) => {
      try {
           const data = CryptoJS.AES.encrypt(JSON.stringify(text), cryptoKey).toString();
           return resolve(data);
       } catch (error) {
           console.log("encode error:",error);
           return resolve({ status: false, message: 'Something is wrong while send request.' });
       }
   })
  },
  decryptData : (encryptedData) => {
    return new Promise(async resolve => {
      try {
          var bytes = CryptoJS.AES.decrypt(encryptedData,cryptoKey);
          var originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          
          return resolve(originalText);
          
      } catch (error) {
          console.log("decode error:",error);
          return resolve({ status: false, message: 'Something is wrong while send request.' });
      }
  })
}
};

export default useEncryption;
