'use client';

import DashboardPage from '@/components/templates/DashboardPage/DashboardPage';
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck';

export default function Dashboard() {
  const { shouldLoadContent } = useRedirectByUserCheck();
  return <>{shouldLoadContent && <DashboardPage />}</>;
}
