import CryptoJS from 'crypto-js';

const sha256 = (string: string) => CryptoJS.SHA256(string).toString(CryptoJS.enc.Hex);

export default sha256;
