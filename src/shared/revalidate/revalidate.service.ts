import { Injectable } from '@nestjs/common';

const REVALIDATE_API_URL = process.env.REVALIDATE_API_URL;
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

@Injectable()
export class RevalidateService {
  revalidate(path: string) {
    fetch(REVALIDATE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: path,
        secret: REVALIDATE_SECRET,
      }),
    });
  }
}
