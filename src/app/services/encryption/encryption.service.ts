import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

/**
 * by Nicolai Haferkamp
 *
 * Based on: https://stackoverflow.com/questions/41671267/encrypt-the-string-in-typescript-and-decrypt-in-c-sharp-using-advanced-encryptio
 */
@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private key = CryptoJS.enc.Utf8.parse('1238943452945234');
  private iv = CryptoJS.enc.Utf8.parse('1238943452945234');

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
