import { $mode } from '@/context/mode';
import { useStore } from 'effector-react';
import { useState } from 'react';
import styles from '@/styles/catalog/index.module.scss';
import { IBoilerPart } from '@/types/boilerpars';
import Link from 'next/link';
import { formatPrice } from '@/utils/common';
import CartHoverCheckedSvg from '@/components/elements/CartHoverCheckedSvg/CartHoverCheckedSvg';
import CartHoverSvg from '@/components/elements/CartHoverSvg/CartHoverSvg';
import spinnerStyles from '@/styles/spinner/index.module.scss';
import { $shoppingCart } from '@/context/shopping-cart';
import { toggleCartItem } from '@/utils/shopping-cart';
import { $user } from '@/context/user';

const CatalogItem = ({ item }: { item: IBoilerPart }) => {
  const mode = useStore($mode);
  const user = useStore($user);
  const shoppingCart = useStore($shoppingCart);
  const isInCart = shoppingCart.some((cartItem) => cartItem.partId === item.id);
  const [spinner, setSpinner] = useState(false);
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : '';

  const toggleToCart = () => toggleCartItem(user.username, item.id, isInCart);

  return (
    <li className={`${styles.catalog__list__item} ${darkModeClass}`}>
      <img
        src={JSON.parse(item.images)[0]}
        alt={item.name}
      />
      <div className={styles.catalog__list__item__inner}>
        <Link
          href={`/catalog/${item.id}`}
          passHref
          legacyBehavior>
          <h3 className={styles.catalog__list__item__title}>{item.name}</h3>
        </Link>
        <span className={styles.catalog__list__item__code}>
          Артикул: {item.vandor_code}
        </span>
        <span className={styles.catalog__list__item__price}>
          {formatPrice(item.price)} P
        </span>
      </div>
      <button
        className={`${styles.catalog__list__item__cart} ${
          isInCart ? styles.added : ''
        }`}
        disabled={spinner}
        onClick={toggleToCart}>
        {spinner ? (
          <div
            className={spinnerStyles.spinner}
            style={{ top: 6, left: 6 }}
          />
        ) : (
          <span>{isInCart ? <CartHoverCheckedSvg /> : <CartHoverSvg />}</span>
        )}
      </button>
    </li>
  );
};

export default CatalogItem;
