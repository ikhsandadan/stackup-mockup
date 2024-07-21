"use client";
import React, { useState, useEffect } from 'react';

import { useAppContext } from '@/app/context/AppContext';
import AddressModal from '@/app/(components)/AddressModal';

const Summary = () => {
    const { myCart, stackcoin, } = useAppContext();
    const [newStackcoin, setNewStackcoin] = useState(stackcoin);
    const [openAddressModal, setOpenAddressModal] = useState(false);

    const total = myCart.reduce((acc: number, item: any) => {
        return acc + item.price;
    }, 0);

    const handleOpenAddressModal = (newStackcoin: number) => {
        setOpenAddressModal(true);
    };

    const handleCloseAddressModal = () => {
        setOpenAddressModal(false);
    };

    useEffect(() => {
        setNewStackcoin(stackcoin - total);
    }, [stackcoin, total]);

    return (
        <div className='mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8'>
            <h2 className="text-lg font-medium text-gray-900">
                Order Summary
            </h2>
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-medium text-gray-900">Order Total</div>
                    <div className="text-base font-medium text-gray-900">{total} Stackcoin</div>
                </div>
                <div className='flex items-center justify-between pt-4'>
                    <div className="text-base font-medium text-gray-900">My Stackcoin balance</div>
                    <div className='text-base font-medium text-gray-900'>{stackcoin} Stackcoin</div>
                </div>
                <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                    <div className="text-base font-medium text-gray-900">Remaining balance</div>
                    <div className='text-base font-medium text-gray-900'>{newStackcoin} Stackcoin</div>
                </div>
            </div>
            {stackcoin < total ? (
                <button disabled={myCart.length === 0} className='w-full rounded-lg bg-red-500 p-2 text-center text-sm font-medium text-white mt-6'>Insufficient Stackcoin</button>
            ) : (
                <button disabled={myCart.length === 0} onClick={() => handleOpenAddressModal(newStackcoin)} className='w-full rounded-lg bg-gray-800 p-2 text-center text-sm font-medium text-white hover:bg-gray-700 mt-6'>Checkout</button>
            )}

            <AddressModal newStackcoin={newStackcoin} openAddressModal={openAddressModal} handleCloseAddressModal={handleCloseAddressModal} />
        </div>
    )
};

export default Summary;