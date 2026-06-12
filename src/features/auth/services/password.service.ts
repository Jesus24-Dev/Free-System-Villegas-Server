import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

@Injectable()
export class PasswordService {
  async hash(password: string) {
    return bcrypt.hash(password, saltRounds);
  }

  async compare(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }
}
