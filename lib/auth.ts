import { jwtVerify } from 'jose';

export async function verifyToken(token: string) {
  try {
    const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (_) {
    return null;
  }
}
