"use client";
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

import { useAppContext } from '../context/AppContext';

interface SideDrawerProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    auth: boolean;
};

export default function SideDrawer({ open, setOpen, auth }: SideDrawerProps) {
    const { userName, imageProfile } = useAppContext();
    const [profilePicture, setProfilePicture] = useState<string>('defaultprofile.svg');

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    useEffect(() => {
        if (imageProfile) {
            setProfilePicture(imageProfile);
        }
    }, [imageProfile]);

    const DrawerList = (
        <Box sx={{ width: 70, display: 'flex', flexDirection: 'column', height: '100%' }} onClick={toggleDrawer(false)}>
            <div className='flex flex-col flex-grow items-center py-4'>
                {auth ? (
                    <div className='w-full flex flex-col'>
                    <Tooltip title={<span style={{ fontSize: '1rem' }}>{userName}</span>} placement="bottom" TransitionComponent={Zoom}>
                        <div className='w-12 h-12 self-center'>
                            <img src={profilePicture} alt="profilepicture" className='bg-auto w-12 h-12 rounded-full' />
                        </div>
                    </Tooltip>

                    <Divider sx={{ color: '#777788', mt: 3, mb: 1 }} orientation="horizontal" variant="middle" flexItem/>
                    </div>
                ) : (null)}
                
                <Tooltip title={<span style={{ fontSize: '1rem' }}>Earn</span>} placement="bottom" TransitionComponent={Zoom}>
                    <button className='text-[#777788] hover:border hover:rounded-lg p-2'>
                        <img src='stackupicon.svg' className='w-8 h-8'/>
                    </button>
                </Tooltip>

                <Tooltip title={<span style={{ fontSize: '1rem' }}>Learn</span>} placement="bottom" TransitionComponent={Zoom}>
                    <button className='text-[#777788] hover:border hover:rounded-lg p-2 mt-4'>
                        <img src='stackuplearn.svg' className='w-8 h-8'/>
                    </button>
                </Tooltip>

                <Box sx={{ flexGrow: 1 }}></Box>

                {auth ? (
                    <div className='w-full flex flex-col'>
                        <Divider sx={{ color: '#777788', mt: 3, mb: 1 }} orientation="horizontal" variant="middle" flexItem/>

                        <Tooltip title={<span style={{ fontSize: '1rem' }}>Settings</span>} placement="top" TransitionComponent={Zoom}>
                            <button className='text-[#777788] hover:border hover:rounded-lg p-2 mt-4 self-center'>
                                <img src='gear.svg' className='w-8 h-8'/>
                            </button>
                        </Tooltip>
                    </div>
                ) : (null)}
            </div>
        </Box>
    );

    return (
        <div>
        <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
        </Drawer>
        </div>
    );
};