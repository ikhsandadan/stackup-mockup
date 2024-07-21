"use client";
import { useState, useEffect, MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

import Eye from '../../public/eye.svg';
import EyeOff from '../../public/eyeclosed.svg';
import SideDrawer from './SideDrawer';
import { useAppContext } from '../context/AppContext';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

const Header = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const pathName = usePathname();
    const { darkMode, toggleDarkMode, findUserById, userEmail, userName, imageProfile, balance, fetchAllUsersQuestsandBounty, allUsersData, top3Users } = useAppContext();
    const [auth, setAuth] = useState(false);
    const [page, setPage] = useState<string>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [viewBalance, setViewBalance] = useState<boolean>(false);
    const [eye, setEye] = useState(Eye);
    const [profilePicture, setProfilePicture] = useState<string>('defaultprofile.svg');
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const [openSignupModal, setOpenSignupModal] = useState(false);

    const handleLoginClose = () => setOpenLoginModal(false);
    const handleLoginOpen = () => {
        setOpenLoginModal(true);
        handleSignupClose();
    };

    const handleSignupClose = () => setOpenSignupModal(false);

    const handleSignupOpen = () => {
        setOpenSignupModal(true);
        handleLoginClose();
    };

    const handleMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };

    const handleViewBalance = () => {
        setViewBalance(!viewBalance);
    };

    const handleLogout = () => {
        setAuth(false);
        localStorage.removeItem('myCart');
        signOut({ callbackUrl: '/' });
    };

    const handleOpenAccount = () => {
        router.push('/Account');
    };

    const renderBalance = () => {
        if (!auth) return null;
    
        return (
            <div className='flex items-center gap-4'>
                <img src='wallet.svg' className='w-6 h-6' />
                {viewBalance ? (
                    <div className='flex gap-1'>
                        <div>Balance: </div>
                        <div className='font-bold'>${balance}</div>
                    </div>
                ) : (
                    <div>Balance Hidden</div>
                )}
                <Divider sx={{ color: darkMode ? '#d1d5db' : '#777788' }} orientation="vertical" flexItem />
                <Tooltip title={<span style={{ fontSize: '1rem' }}>View Balance</span>} placement="bottom" TransitionComponent={Zoom}>
                    <img src={eye.src} className='w-6 h-6 cursor-pointer' onClick={handleViewBalance} />
                </Tooltip>
            </div>
        );
    };

    useEffect(() => {
        if (pathName === '/') {
            setPage('home');
        } else if (pathName === '/Account') {
            setPage('account');
        } else if (pathName === '/Explore') {
            setPage('explore');
        } else if (pathName === '/Store') {
            setPage('store');
        } else if (pathName === '/Leaderboard') {
            setPage('leaderboard');
        } else if (pathName === '/Cart') {
            setPage('cart');
        }

        const quests = fetchAllUsersQuestsandBounty();
    }, [pathName]);

    useEffect(() => {
        if (viewBalance) {
            setEye(EyeOff);
        } else {
            setEye(Eye);
        }
    }, [viewBalance]);

    useEffect(() => {
        const findUser = async () => {
            if (session) {
                const userId = session?.user?.id;
                const user = await findUserById(userId);
                setAuth(true);
            } else {
                setAuth(false);
            }
        };

        findUser();
    }, [session]);

    useEffect(() => {
        if (imageProfile) {
            setProfilePicture(imageProfile);
        }
    }, [imageProfile]);

    return (
        <>
            <Box sx={{ flexGrow: 1, mb: 6, bgcolor: 'background.default' }}>
                <AppBar position="fixed" sx={{ boxShadow: 'none', bgcolor: 'background.paper' }} className='border-b'>
                    <Toolbar variant='dense'>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={handleDrawer}
                        >
                            <MenuIcon sx={{ color: darkMode ? '#d1d5db' : '#777788' }} />
                        </IconButton>
                        <div className='flex gap-3 items-center'>
                            <img src='stackupicon.svg' className='max-h-12' />
                            <img src='stackupearn.svg' className='max-h-12' />
                        </div>
                        <div className='flex gap-3 items-center ml-8'>
                            <button onClick={() => router.push('/')} className={`font-semibold ${darkMode ? '' : 'text-[#777788]'} hover:border hover:rounded-full px-6 py-2 rounded-full ${page === 'home' ? 'bg-[#f5f5f5] text-[#777788]' : ''}`} id='home'>Home</button>
                            <button className={`font-semibold ${darkMode ? '' : 'text-[#777788]'} hover:border hover:rounded-full px-6 py-2 rounded-full ${page === 'explore' ? 'bg-[#f5f5f5] text-[#777788]' : ''}`} id='explore'>Explore</button>
                            {auth ? (
                                <button onClick={() => router.push('/Store')} className={`font-semibold ${darkMode ? '' : 'text-[#777788]'} hover:border hover:rounded-full px-6 py-2 rounded-full ${page === 'store' ? 'bg-[#f5f5f5] text-[#777788]' : ''}`} id='explore'>Store</button>
                            ) : (null)}
                        </div>
                        <Box sx={{ flexGrow: 1 }}></Box>
                        <div className={`flex flex-row gap-4 mr-8 ${darkMode ? 'text-[#d1d5db]' : 'text-[#777788]'} place-items-center`}>
                            {renderBalance()}
                            <div className="flex items-center ml-6">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={darkMode}
                                        onChange={toggleDarkMode}
                                        className="sr-only"
                                    />
                                    <div className={`relative flex items-center justify-between w-14 h-8 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full shadow-inner`}>
                                        <span className={`absolute left-1 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}><img src='moon.svg' className='w-6 h-6' /></span>
                                        <span className={`absolute right-1 text-lg ${darkMode ? 'text-gray-800' : 'text-gray-300'}`}><img src='sun.svg' className='w-5 h-5' /></span>
                                        <div
                                            className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow transform transition-transform ${darkMode ? 'translate-x-full' : 'translate-x-0'}`}
                                        ></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        {auth ? (
                            <div>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    {imageProfile ? (
                                        <div className='w-12 h-12'>
                                            <img src={profilePicture} alt="profilepicture" className='bg-auto w-12 h-12 rounded-full' />
                                        </div>
                                    ) : (
                                        <AccountCircle fontSize='large' sx={{ color: darkMode ? '#d1d5db' : '#777788' }} />
                                    )}
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <Tooltip title={<span style={{ fontSize: '1rem' }}>My Account</span>} placement="left" TransitionComponent={Zoom}>
                                        <MenuItem onClick={handleOpenAccount} className='flex gap-2' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div className='w-10 h-10'>
                                                <img src={profilePicture} alt="profilepicture" className='bg-auto w-10 h-10 rounded-full' />
                                            </div>
                                            <div>{userName}</div>
                                        </MenuItem>
                                    </Tooltip>
                                    <Divider sx={{ color: darkMode ? '#d1d5db' : '#777788', }} orientation="horizontal" variant='middle' flexItem />
                                    <MenuItem onClick={handleClose} className='flex gap-1'>
                                        <div>My Balance</div>
                                        <Divider sx={{ color: darkMode ? '#d1d5db' : '#777788', mx: 1, height: '24px', }} orientation="vertical" variant='middle' flexItem />
                                        <div>${balance}</div>
                                    </MenuItem>
                                    <MenuItem onClick={handleClose} className='flex gap-1'>
                                        <div>My Progress</div>
                                    </MenuItem>
                                    <MenuItem onClick={handleClose} className='flex gap-1'>
                                        <div>Help Center</div>
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout} sx={{
                                        display: 'flex',
                                        gap: 1,
                                        '&:hover': {
                                            backgroundColor: '#ef4444',
                                            color: 'white',
                                        }
                                    }}>
                                        <div>Log Out</div>
                                    </MenuItem>
                                </Menu>
                            </div>
                        ) : (
                            <div className='flex gap-3 items-center'>
                                <button onClick={handleLoginOpen} className={`font-semibold ${darkMode ? '' : 'text-[#777788]'} hover:border hover:rounded-lg px-6 py-2 rounded-lg`} id='login'>Login</button>
                                <button className={`font-semibold ${darkMode ? 'text-[#777788]' : 'text-[#777788]'} bg-[#f5f5f5] hover:border hover:rounded-lg px-6 py-2 rounded-lg`} id='getstarted'>Get Started</button>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>
            <SideDrawer setOpen={setOpenDrawer} open={openDrawer} auth={auth}/>
            <LoginModal openLoginModal={openLoginModal} handleLoginClose={handleLoginClose} handleSignupOpen={handleSignupOpen}/>
            <SignupModal openSignupModal={openSignupModal} handleSignupClose={handleSignupClose} handleLoginOpen={handleLoginOpen} />
        </>
    );
}

export default Header;
