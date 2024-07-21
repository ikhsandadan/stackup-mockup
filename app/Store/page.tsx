"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

import products from '../utils/products';
import ProductModal from '../(components)/ProductModal';

type Size = {
    xs: number;
    s: number;
    m: number;
    lg: number;
    xl: number;
    xxl: number;
};

type Product = {
    id: string;
    image: { src: string };
    name: string;
    category: string;
    price: number;
    description: string;
    size: Size;
};

const Store = () => {
    const router = useRouter();
    const [openProductModal, setOpenProductModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleOpenProductModal = (product: Product) => {
        setSelectedProduct(product);
        setOpenProductModal(true);
    };

    const handleCloseProductModal = () => {
        setOpenProductModal(false);
        setSelectedProduct(null);
    };

    return (
        <div className='w-full sm:p-14 p-5 min-h-screen dark:bg-gray-900 dark:text-white text-black transition-colors duration-300'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex flex-col gap-4'>
                    <div className='flex justify-between'>
                        <h1 className='text-3xl font-bold'>StackStore</h1>
                        <div className='flex'>
                            <Tooltip title={<span style={{ fontSize: '1rem' }}>My Cart</span>} placement="bottom" TransitionComponent={Zoom}>
                                <img onClick={() => router.push('/Cart')} src="cart.svg" alt="cart" className='w-12 h-12 cursor-pointer p-2 hover:scale-125 hover:border rounded-lg hover:mx-2' />
                            </Tooltip>
                            <Tooltip title={<span style={{ fontSize: '1rem' }}>Order History</span>} placement="bottom" TransitionComponent={Zoom}>
                                <img onClick={() => router.push('/OrderHistory')} src="history.svg" alt="cart" className='w-12 h-12 cursor-pointer p-2 hover:scale-125 hover:border rounded-lg hover:mx-2' />
                            </Tooltip>
                        </div>
                    </div>
                    <h2 className='text-xl font-semibold mt-6 mb-4'>Featured Product</h2>
                    <div className='flex flex-row gap-6 self-center'>
                        {products.map((product: any, index: number) => (
                            <div key={index} onClick={() => handleOpenProductModal(product)} className="max-w-max hover:scale-105 transition duration-500 cursor-pointer bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <div className="flex flex-col p-6 max-w-max hover:scale-105 transition duration-500">
                                    <img className="w-40 h-40 mb-3 rounded-lg shadow-lg self-center" src={product.image.src} alt="product" />
                                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{product.name}</h5>
                                    <span className='text-sm text-gray-500 dark:text-gray-400'>{product.category}</span>
                                    <span className="text-sm text-gray-900 dark:text-white mt-4">{product.price} Stackcoins</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ProductModal selectedProduct={selectedProduct} openProductModal={openProductModal} handleProductModalClose={handleCloseProductModal}/>
        </div>
    )
}

export default Store;