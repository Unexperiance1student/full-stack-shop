'use client';
import CatalogPage from '@/components/templates/CatalogPage/CatalogPage';
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck';

export default function Catalog() {
  const { shouldLoadContent } = useRedirectByUserCheck();
  return <>{shouldLoadContent && <CatalogPage />}</>;
}
