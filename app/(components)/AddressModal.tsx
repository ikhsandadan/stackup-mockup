"use client";
import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

import { useAppContext } from '../context/AppContext';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '0px',
    boxShadow: 24,
    p: 4,
};

interface AddressModalProps {
    newStackcoin: number;
    openAddressModal: boolean;
    handleCloseAddressModal: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ newStackcoin, openAddressModal, handleCloseAddressModal }) => {
    const { userId, myCart, setMyCart, flagCart, setFlagCart, updateMyOrderToDatabase, findUserById, myOrder } = useAppContext();

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (myOrder.length > 0) {
            await updateMyOrderToDatabase(userId, newStackcoin, "push", myCart);
        } else {
            await updateMyOrderToDatabase(userId, newStackcoin, "set", myCart);
        }

        await findUserById(userId);
        localStorage.removeItem('myCart');
        setMyCart([]);
        setFlagCart(!flagCart);
        handleCloseAddressModal();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        myCart.forEach((item) => {
            setMyCart((prevCart) =>
                prevCart.map((cartItem) =>
                    cartItem.orderId === item.orderId
                        ? { ...cartItem, [name]: value }
                        : cartItem
                )
            );
        });
    };

    console.log(myCart);

    return (
        <Modal
            aria-labelledby="address-modal-title"
            aria-describedby="address-modal-description"
            open={openAddressModal}
            onClose={handleCloseAddressModal}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={openAddressModal}>
                <Box sx={style} className="rounded-md">
                    <h2 id="address-modal-title" className="text-xl font-medium mb-4 text-black dark:text-white">Please input your address</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <div className="flex flex-col">
                            <label htmlFor="firstName" className="mb-1 text-black dark:text-white">First Name</label>
                            <input 
                                type="text" 
                                name="firstName" 
                                id="firstName"
                                value={myCart[0]?.firstName || ''} 
                                onChange={handleChange}
                                className="p-2 border rounded-md text-black"
                                required 
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="lastName" className="mb-1 text-black dark:text-white">Last Name</label>
                            <input 
                                type="text" 
                                name="lastName" 
                                id="lastName"
                                value={myCart[0]?.lastName || ''} 
                                onChange={handleChange} 
                                className="p-2 border rounded-md text-black"
                                required 
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="phoneNumber" className="mb-1 text-black dark:text-white">Phone Number</label>
                            <input 
                                type="text" 
                                name="phoneNumber" 
                                id="phoneNumber"
                                value={myCart[0]?.phoneNumber || ''} 
                                onChange={handleChange} 
                                className="p-2 border rounded-md text-black"
                                required 
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="address" className="mb-1 text-black dark:text-white">Address</label>
                            <input 
                                type="text" 
                                name="address" 
                                id="address"
                                value={myCart[0]?.address || ''} 
                                onChange={handleChange} 
                                className="p-2 border rounded-md text-black"
                                required 
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="zipCode" className="mb-1 text-black dark:text-white">Postal Code</label>
                            <input 
                                type="text" 
                                name="zipCode" 
                                id="zipCode"
                                value={myCart[0]?.zipCode || ''} 
                                onChange={handleChange} 
                                className="p-2 border rounded-md text-black"
                                required 
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="city" className="mb-1 text-black dark:text-white">City</label>
                            <input 
                                type="text" 
                                name="city" 
                                id="city"
                                value={myCart[0]?.city || ''} 
                                onChange={handleChange} 
                                className="p-2 border rounded-md text-black"
                                required 
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="city" className="mb-1 text-black dark:text-white">State</label>
                            <input 
                                type="text" 
                                name="state" 
                                id="state"
                                value={myCart[0]?.state || ''} 
                                onChange={handleChange} 
                                className="p-2 border rounded-md text-black"
                                required 
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="country" className="mb-1 text-black dark:text-white">Country</label>
                            <input 
                                type="text" 
                                name="country" 
                                id="country"
                                value={myCart[0]?.country || ''} 
                                onChange={handleChange} 
                                className="p-2 border rounded-md text-black"
                                required 
                            />
                        </div>

                        <button type="submit" className="w-full rounded-lg bg-gray-800 p-2 text-center text-sm font-medium text-white hover:bg-gray-700 mt-6">Submit Order</button>
                    </form>
                </Box>
            </Fade>
        </Modal>
    );
}

export default AddressModal;