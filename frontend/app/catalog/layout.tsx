import Footer from '@/components/modules/Footer/Footer';
import Header from '@/components/modules/Header/Header';
import '@/styles/globals.css';

export const metadata = {
  title: 'Каталог',
  description: 'dashboard',
};

export default function CatalogLayout({
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
