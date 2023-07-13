import { useEffect, useState } from 'react';

export const usePopup = () => {
  const [open, seetOpen] = useState(false);

  const toggleOpen = () => {
    window.scrollTo(0, 0);
    document.querySelector('.overlay')?.classList.toggle('open');
    document.querySelector('.body')?.classList.toggle('overflow-hidden');
    seetOpen(!open);
  };

  const closePopup = () => {
    document.querySelector('.overlay')?.classList.remove('open');
    document.querySelector('.body')?.classList.remove('overflow-hidden');
    seetOpen(false);
  };

  useEffect(() => {
    const overlay = document.querySelector('.overlay');

    overlay?.addEventListener('click', closePopup);

    return () => overlay?.removeEventListener('click', closePopup);
  }, [open]);

  return { toggleOpen, open, closePopup };
};
