import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
} from 'react-email';

interface ResetPasswordEmailProps {
  fullName: string;
  resetLink: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default function ResetPasswordMail({
  fullName,
  resetLink,
}: ResetPasswordEmailProps) {
  return (
    <Html lang="tr">
      <Head>
        <title>Can Gayrimenkul | Şifre Sıfırla</title>
      </Head>
      <Preview>Can Gayrimenkul Şifre Sıfırlama Talebi</Preview>

      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Container className="border border-solid max-w-116 w-full bg-white border-[#eaeaea] rounded-lg mx-auto mt-10 mb-10">
            <Section className="p-8">
              <Section className="text-center">
                <Img
                  className="mx-auto my-5"
                  alt="Can Gayrimenkul"
                  src={`${BASE_URL}/logo.png`}
                  width="180"
                  height="auto"
                />
                <Text className="text-2xl font-bold tracking-tighter text-slate-900">
                  CAN GAYRİMENKUL
                </Text>
              </Section>

              <Section className="mt-8">
                <Text className="text-slate-800 text-[16px] leading-6">
                  Merhaba <strong>{fullName}</strong>,
                </Text>
                <Text className="text-slate-600 text-[14px] leading-6">
                  Hesabınız için bir şifre sıfırlama talebinde bulundunuz. Eğer
                  bu işlemi siz yapmadıysanız bu e-postayı güvenle görmezden
                  gelebilirsiniz.
                </Text>
              </Section>

              <Section className="text-center mt-8 mb-8">
                <Button
                  className="bg-slate-900 rounded-md text-white text-[14px] font-medium no-underline text-center px-6 py-4"
                  href={resetLink}
                >
                  Şifremi Sıfırla
                </Button>
              </Section>

              <Section className="mt-8 mb-8">
                <Text className="text-slate-500 text-[14px] leading-6">
                  Buton çalışmıyorsa aşağıdaki bağlantıyı kopyalayıp
                  tarayıcınıza yapıştırabilirsiniz:
                </Text>
                <Text className="text-blue-600 text-[12px] leading-5 break-all">
                  <a href={resetLink} className="text-blue-600 underline">
                    {resetLink}
                  </a>
                </Text>
              </Section>

              <Text className="text-slate-500 text-[12px] leading-5">
                Güvenlik uyarısı: Bu bağlantı <strong>30 dakika</strong> boyunca
                geçerlidir ve sadece bir kez kullanılabilir.
              </Text>

              <Hr className="border border-solid border-[#eaeaea] my-6 mx-0 w-full" />

              <Section>
                <Text className="text-[#8898aa] text-[12px] leading-4 text-center">
                  Karşıyaka&apos;nın en prestijli portföy yönetimi. <br />
                  İzmir, Türkiye
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
