import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
//Source https://stackoverflow.com/questions/41671267/encrypt-the-string-in-typescript-and-decrypt-in-c-sharp-using-advanced-encryptio
export class EncryptionService {
  // Declare this key and iv values in declaration
  private key = CryptoJS.enc.Utf8.parse('1238943452945234');
  private iv = CryptoJS.enc.Utf8.parse('1238943452945234');

  // Methods for the encrypt and decrypt Using AES
  encrypt(input: any): any {
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(input),
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

  decrypt(decrypt: any): any {
    const decrypted = CryptoJS.AES.decrypt(decrypt, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
