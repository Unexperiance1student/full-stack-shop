import Footer from '@/components/modules/Footer/Footer';
import Header from '@/components/modules/Header/Header';
import '@/styles/globals.css';

export const metadata = {
  title: 'Главная страница',
  description: 'dashboard',
};

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
