'use client';
import AuthPage from '@/components/templates/AuthPage/AuthPage';
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck';

export default function Auth() {
  const { shouldLoadContent } = useRedirectByUserCheck(true);

  return <>{shouldLoadContent && <AuthPage />}</>;
}
