"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Pagination from '@mui/material/Pagination';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

import { useAppContext, dataProduct } from './../context/AppContext';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#e4e6ea', // Light mode primary color
        },
        background: {
            default: '#ffffff', // Light mode background color
            paper: '#f5f5f5', // Light mode paper color
        },
        text: {
            primary: '#000000', // Light mode text color
        },
    },
    components: {
        MuiPagination: {
            styleOverrides: {
                root: {
                    color: '#000000', // Pagination color in light mode
                },
                ul: {
                    '& .MuiPaginationItem-root': {
                        borderColor: '#000000', // Border color in light mode
                        color: '#000000', // Text color in light mode
                    },
                    '& .Mui-selected': {
                        backgroundColor: '#1976d2', // Selected page background color in light mode
                        color: '#ffffff', // Selected page text color in light mode
                    },
                },
            },
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#c9cdd3', // Dark mode primary color
        },
        background: {
            default: '#121212', // Dark mode background color
            paper: '#1d1d1d', // Dark mode paper color
        },
        text: {
            primary: '#ffffff', // Dark mode text color
        },
    },
    components: {
        MuiPagination: {
            styleOverrides: {
                root: {
                    color: '#ffffff', // Pagination color in dark mode
                },
                ul: {
                    '& .MuiPaginationItem-root': {
                        borderColor: '#ffffff', // Border color in dark mode
                        color: '#ffffff', // Text color in dark mode
                    },
                    '& .Mui-selected': {
                        backgroundColor: '#90caf9', // Selected page background color in dark mode
                        color: '#000000', // Selected page text color in dark mode
                    },
                },
            },
        },
    },
});

const OrderHistory = () => {
    const { darkMode, myOrder } = useAppContext();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [myPosition, setMyPosition] = useState<number>(0);
    const ordersPerPage = 5;

    // Calculate the total number of pages
    const totalPages = Math.ceil(myOrder.length / ordersPerPage);

    // Handler to change page
    const handlePageChange = (event: React.ChangeEvent<unknown>, page: any) => {
        setCurrentPage(page);
    };

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <div className='w-full sm:p-14 p-5 min-h-screen dark:bg-gray-900 dark:text-white text-black transition-colors duration-300'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex flex-col gap-4'>
                    <h1 className='text-3xl font-bold'>Order History</h1>
                    {myOrder.length > 0 ? (
                        myOrder.map((data: dataProduct, index: number) => (
                            <li key={index} className='flex py-6 border-b'>
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
                                    <div className='relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0'>
                                        <div className='flex justify-between'>
                                            <p className='text-lg font-semibold text-black dark:text-white'>
                                                Order Id: {data.orderId}
                                            </p>
                                        </div>

                                        <div className='mt-1 flex text-sm gap-4'>
                                            <div className='flex flex-col'>
                                                <span>Size</span>
                                                <p className='text-gray-500 dark:text-gray-400 text-center border-gray-200'>{data.size}</p>
                                            </div>
                                            <div className='flex flex-col'>
                                                <span>Quantity</span>
                                                <p className='text-gray-500 dark:text-gray-400 text-center border-gray-200'>{data.quantity}</p>
                                            </div>
                                            <div className='flex flex-col'>
                                                <span>Status</span>
                                                {data.delivered ? (
                                                    <p className='text-gray-500 dark:text-gray-400 text-center border-gray-200'>Delivered</p>
                                                ) : (
                                                    <p className='text-gray-500 dark:text-gray-400 text-center border-gray-200'>On the way</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className='mt-1 flex text-lg font-medium text-black dark:text-white'>
                                            {data.price} Stackcoin
                                        </div>
                                        <div className='mt-4 flex text-md border-t-2 p-2'>
                                            <div className='flex gap-2'>
                                                <p className='text-gray-500 dark:text-gray-400'>Address:</p>
                                                <div className='flex flex-col'>
                                                    <p className='text-gray-500 dark:text-gray-400'>{data.firstName} {data.lastName}</p>
                                                    <p className='text-gray-500 dark:text-gray-400'>{data.phoneNumber}</p>
                                                    <p className='text-gray-500 dark:text-gray-400'>{data.address} {data.city} {data.state} {data.zipCode} {data.country}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No orders found.</p>
                    )}
                    <Stack spacing={2} className='mt-4 self-center'>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    shape="rounded"
                                />
                            </Stack>
                </div>
            </div>
        </div>
        </ThemeProvider>
    );
}

export default OrderHistory;