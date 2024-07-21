"use client";
import React from 'react';

import { useAppContext } from '../context/AppContext';
import CartItem from './components/cart-item';
import Summary from './components/summary';

const Cart = () => {
    const { myCart } = useAppContext();

    return (
        <div className='w-full sm:p-14 p-5 min-h-screen dark:bg-gray-900 dark:text-white text-black transition-colors duration-300'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex flex-col gap-4'>
                    <h1 className='text-3xl font-bold'>My Cart</h1>
                    <div className='mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12'>
                        <div className='lg:col-span-7'>
                            {myCart.length === 0 && <p className='text-neutral-500'>No items added to cart</p>}
                            <ul>
                                {myCart.map((item: any, index: number) => (
                                    <CartItem
                                        key={index}
                                        data={item}
                                    />
                                ))}
                            </ul>
                        </div>

                        <Summary />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart;