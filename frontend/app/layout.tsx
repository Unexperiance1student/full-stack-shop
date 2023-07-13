import '../styles/globals.css';

export const metadata = {
  title: 'Авторизация',
  description: 'Авторизация/Регистрация',
  charSet: 'UTF-8',
  httpEquiv: 'X-UA-Compatible',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <div className='overlay'></div>
        {children}
      </body>
    </html>
  );
}
