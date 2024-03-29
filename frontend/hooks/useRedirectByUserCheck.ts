import { checkUserAuthFx } from '@/api/auth';
import { setUser } from '@/context/user';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const useRedirectByUserCheck = (isAuthPage = false) => {
  const [shouldLoadContent, setShouldLoadContent] = useState(false);
  const router = useRouter();
  const shouldCheckAuth = useRef(true);

  useEffect(() => {
    if (shouldCheckAuth.current) {
      shouldCheckAuth.current = false;
      checkUser();
    }
  }, []);

  const checkUser = async () => {
    const user = await checkUserAuthFx('/user/login-check');

    if (isAuthPage) {
      if (!user) {
        setShouldLoadContent(true);
        return;
      }

      router.push('/dashboard');
      return;
    }

    if (user) {
      setUser(user);
      setShouldLoadContent(true);
      return;
    }

    router.push('/');
  };

  return { shouldLoadContent };
};

export default useRedirectByUserCheck;
