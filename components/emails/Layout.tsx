import {
  Body,
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

interface MailLayoutProps {
  title?: string;
  previewText?: string;
  children: React.ReactNode;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default function MailLayout({
  title = 'Can Gayrimenkul',
  previewText = 'Can Gayrimenkul Bilgilendirme',
  children,
}: MailLayoutProps) {
  return (
    <Html lang="tr">
      <Head>
        <title>{title}</title>
      </Head>
      <Preview>{previewText}</Preview>

      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Container className="border border-solid max-w-116 w-full bg-white border-[#eaeaea] rounded-lg mx-auto mt-10 mb-10">
            <Section className="p-8">
              {/* Header */}
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

              {children}

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
