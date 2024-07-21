import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

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

interface FormData {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    imageProfile: string[];
    balance: number;
    quests: number;
    bounty: number;
    stackcoin: number;
    nationality: string;
    careerLevel: string;
    role: string[];
    techStacks: string[];
    myOrder: dataProduct[];
    agreement: boolean;
    contentsEmail: boolean;
}

interface Errors {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    agreement: string;
}

interface SignupModalProps {
    openSignupModal: boolean;
    handleSignupClose: () => void;
    handleLoginOpen: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ openSignupModal, handleSignupClose, handleLoginOpen, }) => {
    const { setSuccessAlertMessage, setErrorAlertMessage, isUsernameAvailable, isEmailAvailable } = useAppContext();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        imageProfile: [],
        balance: 0,
        quests: 0,
        bounty: 0,
        stackcoin: 0,
        nationality: '',
        careerLevel: '',
        role: [],
        techStacks: [],
        myOrder: [],
        agreement: false,
        contentsEmail: false

    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [showEmailIcon, setShowEmailIcon] = useState<JSX.Element | null>(null);
    const [showUsernameIcon, setShowUsernameIcon] = useState<JSX.Element | null>(null);
    const [errors, setErrors] = useState<Errors>({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        agreement: '',
    });

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // If the email field changes, check if the email is available
        if (name === 'email') {
            const available = await isEmailAvailable(value);
            setEmailAvailable(available);
            if (available === null) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: 'Error checking email availability.',
                }));
            } else if (available) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: '',
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: 'Email is already taken.',
                }));
            }
        }

        if (name === 'username') {
            const available = await isUsernameAvailable(value);
            setUsernameAvailable(available);
            if (available === null) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    username: 'Error checking username availability.',
                }));
            } else if (available) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    username: '',
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    username: 'Username is already taken.',
                }));
            }
        }
    };

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,}$/;
        const usernameRegex = /^[a-zA-Z0-9_]{4,40}$/;

        const validationErrors: Partial<Errors> = {};

        // Validate email
        if (!isValidEmail(formData.email)) {
            validationErrors.email = 'Please enter a valid email address.';
        } else if (emailAvailable === false) {
            validationErrors.email = 'Email is already taken.';
        }

        // Validate username
        if (!usernameRegex.test(formData.username) && formData.username.length < 4 || formData.username.length > 40) {
            validationErrors.username = 'Username must be 4-40 characters and may include letters, numbers, or underscores.';
        } else if (usernameAvailable === false) {
            validationErrors.username = 'Username is already taken.';
        }

        // Validate password
        if (!passwordRegex.test(formData.password)) {
            validationErrors.password = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.';
        }

        // Validate confirm password
        if (formData.password !== formData.confirmPassword) {
            validationErrors.confirmPassword = 'Passwords do not match.';
        }

        // Validate agreement
        if (!formData.agreement) {
            validationErrors.agreement = 'You must agree to the terms of service and privacy policy.';
        }

        // Set errors if any
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...validationErrors
        }));

        if (Object.keys(validationErrors).length > 0) return;

        // Proceed with signup if no errors
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                    imageProfile: formData.imageProfile,
                    balance: formData.balance,
                    quests: formData.quests,
                    bounty: formData.bounty,
                    stackcoin: formData.stackcoin,
                    nationality: formData.nationality,
                    careerLevel: formData.careerLevel,
                    role: formData.role,
                    techStacks: formData.techStacks,
                    myOrder: formData.myOrder,
                    agreement: formData.agreement,
                    contentsEmail: formData.contentsEmail,
                }),
            });

            if (res.ok) {
                // Handle successful signup
                setSuccessAlertMessage('You have successfully signed up!');
                handleLoginOpen();
            } else {
                setErrorAlertMessage('An error occurred while registering the user.');
            }
        } catch (error) {
            setErrorAlertMessage('An error occurred while registering the user.');
            console.error('Error while registering the user', error);
        }
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    useEffect(() => {
        if (emailAvailable !== null) {
            setShowEmailIcon(
                emailAvailable ? (
                    <img src="checktrue.svg" alt="checktrue" className="w-5 h-5" id="email-true" />
                ) : (
                    <img src="checkfalse.svg" alt="checkfalse" className="w-5 h-5 mb-5" id="email-false" />
                )
            );
        }

        if (usernameAvailable !== null) {
            setShowUsernameIcon(
                usernameAvailable ? (
                    <img src="checktrue.svg" alt="checktrue" className="w-5 h-5" id="username-true" />
                ) : (
                    <img src="checkfalse.svg" alt="checkfalse" className="w-5 h-5 mb-5" id="username-false" />
                )
            );
        }
    }, [emailAvailable, usernameAvailable]);

    return (
        <Modal
            aria-labelledby="Signup"
            open={openSignupModal}
            onClose={handleSignupClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={openSignupModal}>
                <Box sx={style} className="rounded-md">
                    <div className='w-full rounded-lg md:mt-0 sm:max-w-lg xl:p-0'>
                        <div className='p-6 space-y-4 md:space-y-6'>
                            <div className='flex justify-center items-center self-stretch gap-2'>
                                <img src="loginlogo.svg" alt="loginlogo" className='h-8 w-auto' />
                            </div>
                            <div className='flex flex-col items-center gap-1'>
                                <h1 className='text-2xl leading-9 font-bold text-center'>Create your account</h1>
                                <h3 className='text-gray-500 leading-6 text-center'>Let's init your developer journey.</h3>
                            </div>
                            <form className='space-y-4 md:space-y-6' onSubmit={handleSignup}>
                                <div className='space-y-1'>
                                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Email</label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                                            {showEmailIcon}
                                        </div>
                                        <input
                                            type="email"
                                            name='email'
                                            autoComplete='email'
                                            data-required='true'
                                            className='bg-white border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1'
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                        <p className={`input-msg text-sm first-letter:capitalize ${!emailAvailable ? 'text-red-700' : 'text-green-700'}`}>{errors.email}</p>
                                    </div>
                                </div>
                                <div className='space-y-1'>
                                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Username</label>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>Within 4-40 characters and may include letters, numbers or underscores (_).</p>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                                            {showUsernameIcon}
                                        </div>
                                        <input
                                            type="text"
                                            name="username"
                                            data-required='true'
                                            maxLength={40}
                                            pattern='^[a-zA-Z0-9_]{4,40}$'
                                            className='bg-white border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1'
                                            value={formData.username}
                                            onChange={handleInputChange}
                                        />
                                        <p className={`input-msg text-sm first-letter:capitalize ${!usernameAvailable ? 'text-red-700' : 'text-green-700'}`}>{errors.username}</p>
                                    </div>
                                    <div className='flex flex-row items-center'>
                                        <p className='input-msg text-sm first-letter:capitalize'></p>
                                        <div className='text-sm text-gray-500 dark:text-gray-400 pt-1 ml-auto'>{formData.username.length}/40</div>
                                    </div>
                                </div>
                                <div className='space-y-2'>
                                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Password</label>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>At least 8 alphanumeric characters and 1 special character.</p>
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
                                    <p className='input-msg text-sm first-letter:capitalize text-red-700'>{errors.password}</p>
                                </div>
                                <div>
                                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Confirm Password</label>
                                    <div className='relative'>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name='confirmPassword'
                                            autoComplete='current-password'
                                            className='bg-white border text-gray-900 sm:text-sm rounded-lg block w-full border-gray-300 focus:ring-blue-600 focus:border-blue-600 py-2 px-1'
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                        <span className='flex items-center absolute right-4 inset-y-0 cursor-pointer' onClick={handleToggleConfirmPassword}>
                                            {showConfirmPassword ? (
                                                <img src="eyeblackclosed.svg" alt="eyeclosed" className='w-6 h-6' />
                                            ) : (
                                                <img src="eyeblack.svg" alt="eyeopen" className='w-6 h-6' />
                                            )}
                                        </span>
                                    </div>
                                    <p className='input-msg text-sm first-letter:capitalize text-red-700'>{errors.confirmPassword}</p>
                                </div>
                                <div className='space-y-3'>
                                    <div className='flex flex-col items-start'>
                                        <div className='flex'>
                                            <input
                                                type="checkbox"
                                                name='agreement'
                                                id='agreement'
                                                className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300'
                                                checked={formData.agreement}
                                                onChange={handleInputChange}
                                            />
                                            <label className='ml-3 text-sm text-gray-500 dark:text-gray-400'>
                                                I've read and agree to StackUp platform's <a href="https://stackup.dev/terms" className="text-gray-900 dark:text-gray-400 font-medium">Terms of Service</a> and <a href="https://stackup.dev/privacy" className="text-gray-900 dark:text-gray-400 font-medium">Privacy Policy</a>.
                                            </label>
                                        </div>
                                        <p className='input-msg text-sm first-letter:capitalize text-red-700'>{errors.agreement}</p>
                                        <p className='ml-7 input-msg text-sm first-letter:capitalize'></p>
                                    </div>
                                    <div className='flex items-start'>
                                        <div className='flex'>
                                            <input
                                                type="checkbox"
                                                name='contentsEmail'
                                                id='contentsEmail'
                                                className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300'
                                                checked={formData.contentsEmail}
                                                onChange={handleInputChange}
                                            />
                                            <label className='ml-3 text-sm text-gray-500 dark:text-gray-400'>
                                                I would like emails on StackUp's product and content updates.
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className='space-y-4'>
                                    <button
                                        type='submit'
                                        className='w-full text-white bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                                    >
                                        Sign Up
                                    </button>
                                    <p className='text-sm font-light text-gray-500 dark:text-gray-400 text-center'>
                                        Already have an account? <a href="#" onClick={handleLoginOpen} className="font-medium text-gray-900 dark:text-white hover:underline">Log In</a>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
};

export default SignupModal;