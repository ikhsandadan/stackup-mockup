import React, { useState, useEffect, useRef } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Divider from '@mui/material/Divider';

import { useAppContext, dataProduct } from '../context/AppContext';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '0px',
    boxShadow: 24,
    p: 4,
};

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

interface ProductModalProps {
    openProductModal: boolean;
    handleProductModalClose: () => void;
    selectedProduct: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ selectedProduct, openProductModal, handleProductModalClose }) => {
    const { darkMode, myCart, setMyCart, flagCart, setFlagCart, setSuccessAlertMessage, myOrder } = useAppContext();
    const sizeKeys: (keyof Size)[] = ['xs', 's', 'm', 'lg', 'xl', 'xxl'];
    const [sizes, setSizes] = useState<Size | null>(null);
    const [selectedSize, setSelectedSize] = useState<keyof Size | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const handleImageConversion = (imageElement: HTMLImageElement | null): Promise<string | null> => {
        return new Promise<string | null>((resolve, reject) => {
            if (imageElement) {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = imageElement.src;

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext("2d");

                    if (ctx) {
                        ctx.drawImage(img, 0, 0);
                        const dataURL = canvas.toDataURL("image/png");
                        resolve(dataURL);
                    } else {
                        reject("Unable to get canvas context");
                    }
                };

                img.onerror = (error) => {
                    reject("Image load error: " + error);
                };
            } else {
                reject("Image element not found");
            }
        });
    };

    useEffect(() => {
        if (selectedProduct) {
            setSizes({ ...selectedProduct.size });
            setSelectedSize(null); // Reset selected size when a new product is selected
        }
    }, [selectedProduct]);

    const handleSizeClick = (size: keyof Size) => {
        if (sizes) {
            if (selectedSize === size) {
                // Deselect the size
                setSizes(prevSizes => ({
                    ...prevSizes!,
                    [size]: prevSizes![size] + 1,
                }));
                setSelectedSize(null);
            } else {
                // Select the size
                setSizes(prevSizes => ({
                    ...prevSizes!,
                    [size]: prevSizes![size] - 1,
                }));
                setSelectedSize(size);
            }
        }
    };

    const handleAddToCart = async () => {
        if (selectedProduct && selectedSize !== null) {
            const imageElement = imageRef.current;

            // Prepare the data object with default or placeholder values for required fields
            const data: dataProduct = {
                orderId: myOrder.length + 1,
                productId: selectedProduct.id ?? 'Unknown Product',
                productName: selectedProduct.name ?? 'Unknown Product',
                price: selectedProduct.price ?? 0,
                quantity: 1,
                image: '', // Initialize with an empty string, to be updated if imageElement is found
                size: selectedSize, // Ensure size is a number
                delivered: false,
                firstName: '', // Initialize with empty strings or actual data if available
                lastName: '',
                address: '',
                city: '',
                state: '',
                country: '',
                zipCode: '',
                phoneNumber: '',
            };

            try {
                if (imageElement) {
                    const base64 = await handleImageConversion(imageElement);
                    if (base64) {
                        data.image = base64; // Update the image field with the base64 data
                    }
                }

                // Add the new product to the cart
                setMyCart((prevCart) => {          
                    let updatedItems = [];
                    const itemExists = prevCart.find((item) => item.productId === selectedProduct.id);
                    if (itemExists) {
                        updatedItems = prevCart.map((item) => {
                            if (item.productId === selectedProduct.id) {
                                const updatedSizes = item.size ? `${item.size}, ${selectedSize}` : selectedSize;
                                return { 
                                    ...item, 
                                    quantity: item.quantity + 1, 
                                    price: item.price + selectedProduct.price, 
                                    size: updatedSizes 
                                };
                            }
                            return item;
                        });
                    } else {
                        updatedItems = [...prevCart, { ...data }];
                    }

                    // Save updated cart to localStorage
                    localStorage.setItem('myCart', JSON.stringify(updatedItems));
                    return updatedItems;
                });

                setFlagCart(!flagCart);
                setSuccessAlertMessage('Product added to cart successfully!');
                handleProductModalClose();
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
        }
    };

    return (
        <Modal
            aria-labelledby="Signup"
            open={openProductModal}
            onClose={handleProductModalClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={openProductModal}>
                <Box sx={style} className="rounded-md">
                    <div className='w-full rounded-lg md:mt-0 sm:max-w-lg xl:p-0'>
                        <div className='p-6 space-y-4 md:space-y-6'>
                            <div className='flex flex-row gap-4'>
                                <img
                                    className="w-64 h-64 mb-3 rounded-lg shadow-lg self-center"
                                    ref={imageRef}
                                    src={selectedProduct?.image.src}
                                    alt="product"
                                />
                                <div className='flex flex-col gap-2'>
                                    <div className="flex flex-col p-2 max-w-max">
                                        <h2 className="mb-1 text-3xl font-semibold text-gray-900 dark:text-white">{selectedProduct?.name}</h2>
                                        <span className="text-xl text-gray-900 dark:text-white mt-4">{selectedProduct?.price} Stackcoins</span>
                                    </div>
                                    <Divider sx={{ color: darkMode ? '#d1d5db' : '#777788', }} orientation="horizontal" variant='fullWidth' flexItem />
                                    <span className='text-sm text-gray-500 dark:text-gray-400'>{selectedProduct?.category}</span>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>{selectedProduct?.description}</p>
                                    <p className='text-md text-gray-900 dark:text-white'>Sizes:</p>
                                    <div className='flex flex-row gap-1 flex-wrap'>
                                        {sizes && sizeKeys.map((size) => (
                                            sizes[size] > 0 && (
                                                <button
                                                    key={size}
                                                    className={`text-sm text-gray-900 dark:text-white p-2 border rounded-md ${selectedSize === size ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-slate-200 hover:text-gray-900 dark:hover:text-gray-900'}`}
                                                    onClick={() => handleSizeClick(size)}
                                                    disabled={selectedSize !== null && selectedSize !== size || sizes[size] === 0}
                                                >
                                                    {size.toUpperCase()}: {sizes[size]}
                                                </button>
                                            )
                                        ))}
                                    </div>
                                    <button
                                        disabled={selectedSize === null}
                                        onClick={handleAddToCart}
                                        className='mt-6 text-white bg-gray-800 hover:bg-slate-200 hover:text-black focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg text-sm px-5 py-2.5 text-center'
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
};

export default ProductModal;