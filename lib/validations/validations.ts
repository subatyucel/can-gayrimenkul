import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email('Geçerli bir e-posta adresi girin')),
  password: z
    .string()
    .trim()
    .min(8, 'Şifre en az 8 karakterli olmalıdır')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      'Şifre en az bir harf ve bir rakam içermelidir',
    ),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, 'İsim en az 3 karakterli olmalıdır')
      .max(50, 'İsim 50 karakterden fazla olamaz'),

    email: z.string().trim().pipe(z.email('Geçerli bir e-posta adresi girin')),

    password: z
      .string()
      .min(8, 'Şifre en az 8 karakterli olmalıdır')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        'Şifre en az bir harf ve bir rakam içermelidir',
      ),

    confirmPassword: z
      .string()
      .min(8, 'Şifre en az 8 karakterli olmalıdır')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        'Şifre en az bir harf ve bir rakam içermelidir',
      ),
    token: z.jwt('Davet bağlantısı geçersiz! Yöneticiniz ile iletişime geçin!'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor!',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().pipe(z.email('Geçerli bir e-posta adresi girin')),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Şifre en az 8 karakterli olmalıdır')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        'Şifre en az bir harf ve bir rakam içermelidir',
      ),

    confirmPassword: z
      .string()
      .min(8, 'Şifre en az 8 karakterli olmalıdır')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        'Şifre en az bir harf ve bir rakam içermelidir',
      ),
    token: z.jwt(
      'Şifre sıfırlama bağlantısı geçersiz! Şifremi unuttum ekranından yeni bağlantı talep edin.',
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor!',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
