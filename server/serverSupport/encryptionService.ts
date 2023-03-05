//Inside imports of your TS file include
import * as CryptoJS from 'crypto-js';

//Source https://stackoverflow.com/questions/41671267/encrypt-the-string-in-typescript-and-decrypt-in-c-sharp-using-advanced-encryptio
export class encyptionService {
  private static key = CryptoJS.enc.Utf8.parse('1238943452945234');
  private static iv = CryptoJS.enc.Utf8.parse('1238943452945234');

  static encrypt(input: any): any {
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(JSON.stringify(input)),
      this.key,
      {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  }

  static decrypt(decrypt: any): string {
    const decrypted = CryptoJS.AES.decrypt(decrypt, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const answer = decrypted.toString(CryptoJS.enc.Utf8);
    return answer;
  }
}
