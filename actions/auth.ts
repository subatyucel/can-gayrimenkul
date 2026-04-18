'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
  LoginFormValues,
  loginSchema,
  RegisterFormValues,
  registerSchema,
} from '@/lib/validations/validations';
import { createSession, generateToken, verifyToken } from '@/lib/auth';
import { ActionResponseFactory, formatZodErrors } from '@/lib/action-response';
import { sendResetPasswordMail } from '@/lib/mail';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function registerUser(formValues: RegisterFormValues) {
  try {
    const { data, error, success } = registerSchema.safeParse(formValues);

    if (!success) {
      return ActionResponseFactory.error(
        'Lütfen formdaki alanları uygun değerler ile doldurun!',
        formatZodErrors(error),
      );
    }

    const payload = await verifyToken(data.token);
    if (!payload || payload.purpose !== 'invite') {
      return ActionResponseFactory.error(
        'Davet linkiniz geçerli değil! Lütfen yöneticiniz ile görüşün.',
      );
    }

    const isUserExist = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (isUserExist) {
      return ActionResponseFactory.error(
        'Bu mail adresi kullanımda. Şifremi unuttum ekranından şifrenizi sıfırlayabilirsiniz.',
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const { confirmPassword, token, ...dbData } = data;

    await prisma.$transaction([
      prisma.user.create({
        data: { ...dbData, password: hashedPassword, role: 'admin' },
      }),
    ]);

    return ActionResponseFactory.success(
      'Kayıt işlemi başarılı. Bilgilerinizle giriş yapabilirsiniz.',
    );
  } catch (error) {
    console.error('💥💥Register action error', error);
    return ActionResponseFactory.error(
      'Sunucu tarafında beklenmeyen bir hata oluştu.',
    );
  }
}

export async function login(formValues: LoginFormValues) {
  try {
    const { data, error, success } = loginSchema.safeParse(formValues);
    if (!success) {
      return ActionResponseFactory.error(
        'Lütfen formdaki alanları uygun değerler ile doldurun!',
        formatZodErrors(error),
      );
    }

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return ActionResponseFactory.error('Giriş bilgileri hatalı!');
    }

    await createSession(user.id, user.role);

    return ActionResponseFactory.success('Başarıyla giriş yapıldı!');
  } catch (error) {
    console.error('💥💥Login action error: ', error);
    return ActionResponseFactory.error(
      'Sunucu tarafında beklenmeyen bir hata oluştu.',
    );
  }
}

export async function requestPasswordReset(
  formValues: ForgotPasswordFormValues,
) {
  try {
    const { data, error, success } = forgotPasswordSchema.safeParse(formValues);
    if (!success) {
      return ActionResponseFactory.error(
        'Lütfen formdaki alanları uygun değerler ile doldurun!',
        formatZodErrors(error),
      );
    }

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (user) {
      const TOKEN = await generateToken(
        { id: user.id, email: user.email },
        'password-reset',
        '30m',
      );

      await sendResetPasswordMail(user.email, TOKEN, user.fullName);
    }

    // Returns success anyway to prevent enumaration attacks
    return ActionResponseFactory.success(
      'Eğer bu e-posta adresi kayıtlıysa, sıfırlama linki gönderilmiştir.',
    );
  } catch (error) {
    console.error('💥💥Send reset mail action error: ', error);
    return ActionResponseFactory.error(
      'Mail gönderirken sunucu tarafında beklenmeyen bir hata oluştu.',
    );
  }
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.set('admin_session', '', {
    path: '/',
    maxAge: 0,
  });

  redirect('/admin/login');
}

export async function resetPasswordWithToken(formData: FormData) {
  const parsed = ResetPasswordSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { token, newPassword } = parsed.data;

  let email: string;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (payload.purpose !== 'password-reset') {
      return { error: 'Geçersiz link!' };
    }
    email = payload.email as string;
  } catch {
    return { error: 'Şifre sıfırlama linki geçersiz veya süresi dolmuş!' };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: 'Kullanıcı bulunamadı!' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  redirect('/admin/giris-yap?reset=success');
}

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, fullName: true, role: true },
  });
}
