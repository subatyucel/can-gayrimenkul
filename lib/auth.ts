import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { prisma } from './prisma';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (error) {
    console.error('💥💥 Token validation error: ', error);
    return null;
  }
}

export async function generateToken(
  payload: Record<string, string>,
  purpose: 'invite' | 'session' | 'password-reset',
  expiresIn: string = '24h',
) {
  try {
    const token = await new SignJWT({ ...payload, purpose })
      .setProtectedHeader({
        alg: 'HS256',
      })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(SECRET);

    return token;
  } catch (error) {
    console.error('💥💥 Token generation error: ', error);
    throw error;
  }
}

export async function createSession(userId: string, role: string) {
  try {
    const TOKEN = await generateToken({ userId, role }, 'session', '5d');
    const cookieStore = await cookies();

    cookieStore.set('admin_session', TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 5, //5 days
    });
  } catch (error) {
    console.error('💥💥Session creation error: ', error);
    throw new Error('Oturum oluşturulurken bir teknik hata oluştu.');
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.set('admin_session', '', {
    path: '/',
    maxAge: 0,
  });
}

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  if (!payload || payload.purpose !== 'session' || !payload.userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId as string },
    omit: { password: true },
  });

  if (!user) {
    await deleteSession();
    return null;
  }

  return user;
});
