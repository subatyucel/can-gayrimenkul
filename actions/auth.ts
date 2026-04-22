'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
  LoginFormValues,
  loginSchema,
  RegisterFormValues,
  registerSchema,
  ResetPasswordFormValues,
  resetPasswordSchema,
} from '@/lib/validations/validations';
import {
  createSession,
  deleteSession,
  generateToken,
  verifyToken,
} from '@/lib/auth';
import { ActionResponseFactory, formatZodErrors } from '@/lib/action-response';
import { sendResetPasswordMail } from '@/lib/mail';

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
        { email: user.email },
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

export async function resetPassword(formValues: ResetPasswordFormValues) {
  try {
    const { data, error, success } = resetPasswordSchema.safeParse(formValues);

    if (!success) {
      return ActionResponseFactory.error(
        'Lütfen formdaki alanları uygun değerler ile doldurun!',
        formatZodErrors(error),
      );
    }

    const payload = await verifyToken(data.token);
    if (!payload || payload.purpose !== 'password-reset' || !payload.id) {
      return ActionResponseFactory.error(
        'Şifre sıfırlama linkiniz geçerli değil! Şifremi unuttum sayfasından yeniden işlem yapınız.',
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.update({
      where: { email: payload.email as string },
      data: { password: hashedPassword },
    });

    return ActionResponseFactory.success(
      'Şifre başarı ile güncellenmiştir. Yeni şifreniz ile giriş yapabilirsiniz.',
    );
  } catch (error) {
    console.error('👺👺Reset password action error: ', error);
    return ActionResponseFactory.error(
      'Şifre güncellenirken bir hata oluştu. Yeniden deneyiniz!',
    );
  }
}

export async function logout() {
  try {
    await deleteSession();
    return ActionResponseFactory.success('Çıkış işlemi başarılı.');
  } catch (error) {
    console.error('💥💥Logout action error: ', error);
    return ActionResponseFactory.error(
      'Çıkış yapılırken bir hata meydana geldi!',
    );
  }
}
