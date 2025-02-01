import { Injectable } from '@nestjs/common';
// import crypto from 'crypto';
const crypto = require('crypto');

// import { PrismaService } from 'src/prisma.service';

// Clave secreta (debe almacenarse en variables de entorno)
const SECRET_KEY = process.env.SECRET_KEY;
const IV_LENGTH = 16;
console.log(SECRET_KEY);

@Injectable()
export class CryptoService {
  constructor() {}

  encryptPassword(password: string): string {
    const iv = crypto.randomBytes(IV_LENGTH); // Generar IV aleatorio
    const key = crypto.scryptSync(SECRET_KEY, iv, 32);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      key,
      // Buffer.from(SECRET_KEY),
      iv,
    );
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // const authTag = cipher.getAuthTag().toString('hex'); // Obtener autenticación
    // return iv.toString('hex') + ':' + encrypted + ':' + authTag;
    return iv.toString('hex') + ':' + encrypted;
  }

  decryptPassword(encryptedPassword: string): string {
    const parts = encryptedPassword.split(':');
    // if (parts.length !== 3) throw new Error('Formato de cifrado inválido');

    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    // const authTag = Buffer.from(parts[2], 'hex');

    const key = crypto.scryptSync(SECRET_KEY, iv, 32);

    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      key,
      // Buffer.from(SECRET_KEY),
      iv,
    );
    // decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  compare(password: string, encryptedPassword: string): boolean {
    return this.decryptPassword(encryptedPassword) === password;
  }
}
