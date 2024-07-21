"use client";
import { usePathname } from 'next/navigation';
import Homepage from './Homepage/page';
import Account from './Account/page';
import Leaderboard from './Leaderboard/page';
import Store from './Store/page';
import Cart from './Cart/page';
import OrderHistory from './OrderHistory/page';

export default function Home() {
  const pathName = usePathname();
  return (
    <>
      {pathName === '/' && <Homepage />}
      {pathName === '/account' && <Account />}
      {pathName === '/Leaderboard' && <Leaderboard />}
      {pathName === '/Store' && <Store />}
      {pathName === '/Cart' && <Cart />}
      {pathName === '/OrderHistory' && <OrderHistory />}
    </>
  );
};