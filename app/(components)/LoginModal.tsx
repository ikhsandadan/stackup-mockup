import { useState, ChangeEvent, FormEvent } from 'react';
import { signIn, useSession } from 'next-auth/react';
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
    width: 400,
    bgcolor: 'background.paper',
    border: '0px',
    boxShadow: 24,
    p: 4,
};

interface LoginModalProps {
    openLoginModal: boolean;
    handleLoginClose: () => void;
    handleSignupOpen: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ openLoginModal, handleLoginClose, handleSignupOpen, }) => {
    const { data: session } = useSession();
    const { setSuccessAlertMessage, setErrorAlertMessage} = useAppContext();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        try {
            const res = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })

            if (res?.error) {
                setErrorAlertMessage('Invalid email or password');
                return;
            }

            if (res?.ok) {
                setSuccessAlertMessage('Welcome back!');
                handleLoginClose();
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    return (
        <Modal
            aria-labelledby="Login"
            open={openLoginModal}
            onClose={handleLoginClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={openLoginModal}>
                <Box sx={style} className="rounded-md">
                    <div className='w-full rounded-lg md:mt-0 sm:max-w-lg xl:p-0'>
                        <div className='p-6 space-y-4 md:space-y-6'>
                            <div className='flex justify-center items-center self-stretch gap-2'>
                                <img src="loginlogo.svg" alt="loginlogo" className='h-8 w-auto' />
                            </div>
                            <div className='flex flex-col items-center gap-1'>
                                <h1 className='text-2xl leading-9 font-bold text-center text-gray-900 dark:text-white'>Welcome back</h1>
                                <h3 className='text-gray-500 leading-6 text-center'>Log in to your StackUp account.</h3>
                            </div>
                            <form className='space-y-4 md:space-y-6' onSubmit={onSubmit}>
                                <div>
                                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Email</label>
                                    <input
                                        type="email"
                                        name='email'
                                        autoComplete='email'
                                        className='border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1'
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Password</label>
                                    <div className='relative'>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name='password'
                                            autoComplete='current-password'
                                            className='bg-white border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1'
                                            value={formData.password}
                                            onChange={handleInputChange}
                                        />
                                        <span className='flex items-center absolute right-4 inset-y-0 cursor-pointer' onClick={handleTogglePassword}>
                                            {showPassword ? (
                                                <img src="eyeblackclosed.svg" alt="eyeclosed" className='w-6 h-6' />
                                            ) : (
                                                <img src="eyeblack.svg" alt="eyeopen" className='w-6 h-6' />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-start invisible'></div>
                                    <a className='text-sm font-medium text-gray-900 dark:text-white hover:underline' href="#">Forgot password?</a>
                                </div>
                                <div className='space-y-4'>
                                    <button
                                        type='submit'
                                        className='w-full text-white bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                                    >
                                        Log In
                                    </button>
                                    <p className='text-sm font-light text-gray-500 dark:text-gray-300 text-center'>Don&apos;t have an account? <a href="#" onClick={handleSignupOpen} className='font-medium text-gray-900 dark:text-white hover:underline'>Sign up</a></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </Box>
            </Fade>
        </Modal>
    )
};

export default LoginModal;