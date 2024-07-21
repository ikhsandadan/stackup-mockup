"use client";
import React, { useEffect } from 'react';

import { useAppContext } from '../context/AppContext';

const Top3Leaderboard = () => {
    const { top3Users } = useAppContext();

    if (!top3Users || top3Users.length < 3) {
        return <div className='text-center'>Loading...</div>;
    }

    return (
        <div className='h-full flex flex-col md:flex-row justify-center items-center py-6 space-y-4 md:space-y-0 md:space-x-6'>
            <div className='border rounded-lg p-8'>
                <div className='flex-1 flex flex-col items-center gap-2'>
                    <img src={top3Users[1].imageProfile.length > 0 ? top3Users[1].imageProfile : 'defaultprofile.svg'} alt="second place" className='h-24 w-24 rounded-full'/>
                    <div className='text-center font-semibold text-xl'>{top3Users[1].username}</div>
                    <div className='text-center text-4xl font-bold'>2</div>
                </div>
            </div>
            <div className='border rounded-lg p-8'>
                <div className='flex-1 flex flex-col items-center gap-2'>
                    <img src={top3Users[0].imageProfile.length > 0 ? top3Users[0].imageProfile : 'defaultprofile.svg'} alt="first place" className='h-28 w-28 rounded-full'/>
                    <div className='text-center font-semibold text-xl'>{top3Users[0]?.username}</div>
                    <div className='text-center text-6xl font-bold'>1</div>
                </div>
            </div>
            <div className='border rounded-lg p-8'>
                <div className='flex-1 flex flex-col items-center gap-2'>
                    <img src={top3Users[2].imageProfile.length > 0 ? top3Users[2].imageProfile : 'defaultprofile.svg'} alt="third place" className='h-20 w-20 rounded-full'/>
                    <div className='text-center font-semibold text-xl'>{top3Users[2]?.username}</div>
                    <div className='text-center text-3xl font-bold'>3</div>
                </div>
            </div>
        </div>
    );
};

export default Top3Leaderboard;