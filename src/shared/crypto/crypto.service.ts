import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import crypto from 'crypto';
const crypto = require('crypto');

const SECRET_KEY = process.env.SECRET_KEY;
const IV_LENGTH = 12;
const SALT = process.env.SALT;
const encryptionAlgorithm = process.env.ENCRYPTION_ALGORITHM;

@Injectable()
export class CryptoService {
  constructor() {}

  encryptPassword(password: string): string {
    const iv = crypto.randomBytes(IV_LENGTH); // Generar IV aleatorio
    const key = crypto.scryptSync(SECRET_KEY, SALT, 32);
    const cipher = crypto.createCipheriv(encryptionAlgorithm, key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex'); // Obtener autenticación
    // return iv.toString('hex') + ':' + encrypted;
    return iv.toString('hex') + ':' + encrypted + ':' + authTag;
  }

  decryptPassword(encryptedPassword: string) {
    try {
      const parts = encryptedPassword.split(':');
      if (parts.length !== 3) throw new Error('Formato de cifrado inválido');

      const iv = Buffer.from(parts[0], 'hex');
      const encryptedText = parts[1];
      const authTag = Buffer.from(parts[2], 'hex');

      const key = crypto.scryptSync(SECRET_KEY, SALT, 32);

      const decipher = crypto.createDecipheriv(encryptionAlgorithm, key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  compare(password: string, encryptedPassword: string): boolean {
    // return this.decryptPassword(encryptedPassword) === password;
    try {
      const decrypted = this.decryptPassword(encryptedPassword);
      return decrypted === password;
    } catch (e) {
      return false;
    }
  }
}
