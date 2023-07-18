import ProfileSvg from '@/components/elements/ProfileSvg/ProfileSvg';
import { $mode } from '@/context/mode';
import { IWrappedComponentProps } from '@/types/common';
import { useStore } from 'effector-react';
import React, { forwardRef } from 'react';
import styles from '@/styles/profileDropDown/index.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import LogoutSvg from '@/components/elements/LogoutSvg/LogoutSvg';
import { useRouter } from 'next/navigation';
import { withClickOutside } from '@/utils/withClickOutside';
import { $user } from '@/context/user';
import { logoutFx } from '@/api/auth';

const ProfileDropdown = forwardRef<HTMLDivElement, IWrappedComponentProps>(
  ({ open, setOpen }, ref) => {
    const mode = useStore($mode);
    const user = useStore($user);
    const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : '';

    const router = useRouter();

    const handleLogout = async () => {
      await logoutFx('/user/logout');
      router.push('/');
    };

    const toggleProfileDropDown = () => setOpen(!open);

    return (
      <div
        className={styles.profile}
        ref={ref}>
        <button
          className={styles.profile__btn}
          onClick={toggleProfileDropDown}>
          <span className={styles.profile__span}>
            <ProfileSvg />
          </span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className={`${styles.profile__dropdown} ${darkModeClass}`}
              style={{ transformOrigin: 'right top' }}>
              <li className={styles.profile__dropdown__user}>
                <span
                  className={`${styles.profile__dropdown__username} ${darkModeClass}`}>
                  {user.username}
                </span>
                <span
                  className={`${styles.profile__dropdown__email} ${darkModeClass}`}>
                  {user.email}
                </span>
              </li>
              <li className={styles.profile__dropdown__item}>
                <button
                  className={styles.profile__dropdown__item__btn}
                  onClick={handleLogout}>
                  <span
                    className={`${styles.profile__dropdown__item__text} ${darkModeClass}`}>
                    Выйти
                  </span>
                  <span
                    className={`${styles.profile__dropdown__item__svg} ${darkModeClass}`}>
                    <LogoutSvg />
                  </span>
                </button>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ProfileDropdown.displayName = 'ProfileDropdown';
export default withClickOutside(ProfileDropdown);
