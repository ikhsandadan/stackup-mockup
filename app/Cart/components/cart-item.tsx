"use client";
import React from 'react';
import Image from 'next/image';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

import { useAppContext, dataProduct } from '../../context/AppContext';

const CartItem = ({ data }: { data: dataProduct }) => {
    const { myCart, setMyCart, flagCart, setFlagCart } = useAppContext();

    const handleDelete = (id: number) => {
        const newCart = myCart.filter((item: any) => item.orderId !== id);
        setMyCart(newCart);
        localStorage.setItem('myCart', JSON.stringify(newCart));
        setFlagCart(!flagCart);
    };

    return (
        <li className='flex py-6 border-b'>
            <div className='relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48'>
                <Image
                    src={data.image}
                    alt={data.productName}
                    layout='fill'
                    objectFit='cover'
                    objectPosition='center'
                    className='rounded-md object-cover object-center'
                />
            </div>
            <div className='relative ml-4 flex-1 flex flex-col justify-between sm:ml-6'>
                <div className='absolute z-10 right-0 top-0'>
                    <Tooltip title={<span style={{ fontSize: '1rem' }}>Delete Item</span>} placement="bottom" TransitionComponent={Zoom}>
                        <button onClick={()=> {handleDelete(data.orderId)}} className='border rounded-md px-2 hover:scale-110 hover:bg-red-500 hover:text-white'>X</button>
                    </Tooltip>
                </div>
                <div className='relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0'>
                    <div className='flex justify-between'>
                        <p className='text-lg font-semibold text-black dark:text-white'>
                            {data.productName}
                        </p>
                    </div>

                    <div className='mt-1 flex text-sm'>
                        <div className='flex flex-col'>
                            <span>Size</span>
                            <p className='text-gray-500 dark:text-gray-400 text-center border-gray-200'>{data.size}</p>
                        </div>
                        <div className='flex flex-col ml-4'>
                            <span>Quantity</span>
                            <p className='text-gray-500 dark:text-gray-400 text-center border-gray-200'>{data.quantity}</p>
                        </div>
                    </div>
                    <div className='mt-1 flex text-lg font-medium text-black dark:text-white'>{data.price} Stackcoin</div>
                </div>
            </div>
        </li>
    )
};

export default CartItem;