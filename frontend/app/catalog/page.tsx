'use client';
import CatalogPage from '@/components/templates/CatalogPage/CatalogPage';
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck';

// async function getProjects(context: { query: IQueryParams }) {
//   return {
//     props: { query: { ...context.query } },
//   };
// }

// export async function loadProps(query: IQueryParams) {
//   return {
//     props: { query: { ...query } },
//   };
// }

export default function Catalog({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { shouldLoadContent } = useRedirectByUserCheck();
  return <>{shouldLoadContent && <CatalogPage query={searchParams} />}</>;
}

// export async function getServerSideProps(context: { query: IQueryParams }) {
//   return {
//     props: { query: { ...context.query } },
//   };
// }
