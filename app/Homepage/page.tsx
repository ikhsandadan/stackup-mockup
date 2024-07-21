"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppContext } from '../context/AppContext';
import { campaigns, moreCampaigns } from '../utils/campaigns';
import Top3Leaderboard from '../(components)/Top3Leaderboard';

const Homepage = () => {
    const router = useRouter();
    const { userName } = useAppContext();
    const [currentTime, setCurrentTime] = useState<string>('');
    const [localTimezone, setLocalTimezone] = useState<string>('');
    const [isoCurrentTime, setIsoCurrentTime] = useState<string>('');
    const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);
    const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

    const getStatus = (startDate: string, endDate: string) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) {
            return 'Upcoming';
        } else if (now >= start && now <= end) {
            return 'Ongoing';
        } else {
            return 'Ended';
        }
    };

    const formatDateTime = (dateTime: string) => {
        const date = new Date(dateTime);
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
            timeZone: timezone,
        };
        return date.toLocaleString('en-US', options);
    };

    const getRemainingTime = (targetDate: string) => {
        const now = new Date();
        const target = new Date(targetDate);
        const diff = target.getTime() - now.getTime();

        if (diff < 0) {
            return '0d 0h 0m';
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${days}d ${hours}h ${minutes}m`;
    };

    const moveToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLeaderboardOpen = () => {
        router.push('/Leaderboard');
    };

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

            setCurrentTime(now.toLocaleDateString(undefined, options as any));
            setLocalTimezone(timezone);
            setIsoCurrentTime(now.toISOString());
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollToTop(true);
            } else {
                setShowScrollToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        setDetailsOpen(true);

        return () => {
            clearInterval(interval);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`flex flex-col text-black dark:text-white dark:bg-gray-900 transition-colors duration-300`}>
            <div className='bg-[#f5f5f5] dark:bg-gray-800'>
                <div className='flex flex-col gap-y-4 mx-5 sm:mx-20 lg:mx-28 py-10'>
                    <h1 className='text-xl md:text-2xl font-semibold'>🚀 Welcome back, {userName}!</h1>
                </div>
            </div>
            <div className='max-w-6xl flex flex-col items-center mt-10 gap-y-9 mx-5 sm:mx-8 md:mx-9 xl:mx-auto pt-5 pb-14 sm:px-20 lg:px-0'>
                <div className='flex flex-col space-y-5 w-full mb-10'>
                    <details className='group h-auto lg:h-full w-full p-5 bg-[#f5f5f5] dark:bg-gray-800 rounded-2xl cursor-pointer' tabIndex={1} open={detailsOpen}>
                        <summary className='list-none relative flex w-full items-center'>
                            <div className='font-semibold text-lg'>📢 New: Monthly Happenings Calendar</div>
                            <img src='min.svg' className='hidden group-open:block ml-auto h-5 w-5'/>
                            <img src='plus.svg' className='block group-open:hidden ml-auto h-5 w-5'/>
                        </summary>
                        <div className='group-open:visible'>
                            <div className='my-4'>
                                <div className='markdown-body'>
                                    <p>Want to find out what is upcoming at a glance? You now have a home to visit! Visit our <a href="https://go.stackup.dev/monthly-happenings-july" target='_blank'>Monthly Happenings Calendar</a> to view all upcoming quests, bounties, events and challenges.</p>
                                </div>
                            </div>
                        </div>
                        <p className='text-xs text-[#b8b8b8]'>
                            <time dateTime={isoCurrentTime}>{currentTime}</time>
                        </p>
                    </details>
                </div>

                <div className='flex flex-col items-center space-y-1'>
                    <h2 className='font-bold text-3xl'>Featured Campaigns</h2>
                    <p className='text-sm'>
                        All times are shown in your timezone <b>{localTimezone}</b>
                    </p>
                </div>

                <ul className='flex flex-col md:flex-row sm:flex-wrap lg:flex-nowrap gap-6 lg:justify-center'>
                    {campaigns.map((campaign, index) => {
                        const status = getStatus(campaign.dateStart, campaign.dateEnd);
                        const remainingTime = status === 'Upcoming' ? getRemainingTime(campaign.dateStart) : getRemainingTime(campaign.dateEnd);

                        const [days, hours, minutes] = remainingTime.split(' ').map(str => parseInt(str, 10));

                        return (
                            <li key={index} className='w-full lg:w-1/3 grayscale-11 rounded-3xl overflow-hidden border-l border-r border-b border-grayscale-8 cursor-pointer'>
                                <div className='flex flex-col'>
                                    <img src={campaign.image.src} className='object-fill aspect-[2/1]' />
                                    <div className='flex px-6 pb-7 pt-6 w-full rounded-b-3xl'>
                                        <div className='flex flex-col w-full justify-between space-y-4'>
                                            <div className='flex items-center space-x-5 justify-between md:justify-start'>
                                                <div className='flex md:flex-row md:space-y-0 flex-col space-y-2 items-start w-full gap-x-2'>
                                                    <h3 className='text-lg md:text-xl text-grayscale-2 font-semibold'>{campaign.title}</h3>
                                                    <div className='md:ml-auto'>
                                                        {status === 'Upcoming' ? (
                                                            <span className='bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-md'>Upcoming</span>
                                                        ) : status === 'Ongoing' ? (
                                                            <span className='bg-green-100 text-green-800 text-sm px-3 py-1 rounded-md'>Ongoing</span>
                                                        ) : (
                                                            <span className='bg-red-100 text-red-800 text-sm px-3 py-1 rounded-md'>Ended</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex-inline break-words'>{campaign.description}</div>
                                            <div className='flex md:flex-row flex-col md:space-x-8'>
                                                <div>
                                                    <p>
                                                        <span className='font-bold'>{campaign.rewardPool}</span> Reward Pool
                                                    </p>
                                                </div>
                                                <div>
                                                    <p>
                                                        <span className='font-bold'>{campaign.quests}</span> Quests
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='flex space-x-8 flex-row'>
                                                <div className='flex flex-col space-y-1'>
                                                    <p className='text-xs font-semibold text-[#b8b8b8]'>Start</p>
                                                    <span className='text-sm'>{formatDateTime(campaign.dateStart)}</span>
                                                </div>
                                                <div className='flex flex-col space-y-1'>
                                                    <p className='text-xs font-semibold text-[#b8b8b8]'>End</p>
                                                    <span className='text-sm'>{formatDateTime(campaign.dateEnd)}</span>
                                                </div>
                                            </div>
                                            {status !== 'Ended' ? (
                                                <div>
                                                    {status === 'Upcoming' ? (
                                                        <div className='flex flex-col space-y-1'>
                                                            <div className='whitespace-nowrap text-xs font-semibold text-[#b8b8b8]'>Starts in</div>
                                                            <div className='flex space-x-2.5 items-center'>
                                                                <div className='flex flex-col space-y-1 items-center'>
                                                                    <p className='bg-[#f5f5f5] pt-2 text-center rounded-xl font-bold text-xl w-10 h-10 text-black'>
                                                                        {days}
                                                                    </p>
                                                                    <p>Days</p>
                                                                </div>
                                                                <div className='flex flex-col space-y-1 items-center'>
                                                                    <p className='bg-[#f5f5f5] pt-2 text-center rounded-xl font-bold text-xl w-10 h-10 text-black'>
                                                                        {hours}
                                                                    </p>
                                                                    <p>Hours</p>
                                                                </div>
                                                                <div className='flex flex-col space-y-1 items-center'>
                                                                    <p className='bg-[#f5f5f5] pt-2 text-center rounded-xl font-bold text-xl w-10 h-10 text-black'>
                                                                        {minutes}
                                                                    </p>
                                                                    <p>Minutes</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className='flex flex-col space-y-1'>
                                                            <div className='whitespace-nowrap text-xs font-semibold text-[#b8b8b8]'>Ends in</div>
                                                            <div className='flex space-x-2.5 items-center'>
                                                                <div className='flex flex-col space-y-1 items-center'>
                                                                    <p className='bg-[#f5f5f5] pt-2 text-center rounded-xl font-bold text-xl w-10 h-10 text-black'>
                                                                        {days}
                                                                    </p>
                                                                    <p>Days</p>
                                                                </div>
                                                                <div className='flex flex-col space-y-1 items-center'>
                                                                    <p className='bg-[#f5f5f5] pt-2 text-center rounded-xl font-bold text-xl w-10 h-10 text-black'>
                                                                        {hours}
                                                                    </p>
                                                                    <p>Hours</p>
                                                                </div>
                                                                <div className='flex flex-col space-y-1 items-center'>
                                                                    <p className='bg-[#f5f5f5] pt-2 text-center rounded-xl font-bold text-xl w-10 h-10 text-black'>
                                                                        {minutes}
                                                                    </p>
                                                                    <p>Minutes</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                
                <div className='xl:w-full max-w-6xl flex flex-col items-center gap-y-9 mx-5 sm:mx-8 md:mx-9 xl:mx-auto pt-14 pb-20 md:pb-10 lg:pb-32 xl:pb-20 border-t border-grayscale-8'>
                    <div className='flex sm:flex-row flex-col items-center gap-y-2 px-2 sm:px-0 w-full'>
                        <p className='font-semibold text-2xl'>Check out more campaigns</p>
                        <a href="" className='font-semibold ml-auto border border-grayscale-2 rounded-lg px-4 py-2 w-full sm:w-auto text-center hover:bg-[#f5f5f5] dark:hover:text-black cursor-pointer'>
                            All Campaigns
                            <img src='arrowright.svg' className='inline-block ml-2' />
                        </a>
                    </div>

                    <ul className='lg:w-full flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-6 justify-start lg:justify-center'>
                    {moreCampaigns.map((campaign, index) => {
                        const status = getStatus(campaign.dateStart, campaign.dateEnd);
                        const remainingTime = status === 'Upcoming' ? getRemainingTime(campaign.dateStart) : getRemainingTime(campaign.dateEnd);

                        const [days, hours, minutes] = remainingTime.split(' ').map(str => parseInt(str, 10));

                        return (
                            <li key={index} className='w-full lg:w-1/3 grayscale-11 rounded-3xl overflow-hidden border-l border-r border-b border-grayscale-8 cursor-pointer'>
                                <div className='flex flex-col'>
                                    <img src={campaign.image.src} className='object-fill aspect-[2/1]' />
                                    <div className='flex px-6 pb-7 pt-6 w-full rounded-b-3xl'>
                                        <div className='flex flex-col w-full justify-between space-y-4'>
                                            <div className='flex items-center space-x-5 justify-between md:justify-start'>
                                                <div className='flex md:flex-row md:space-y-0 flex-col space-y-2 items-start w-full gap-x-2'>
                                                    <h3 className='text-lg md:text-xl text-grayscale-2 font-semibold'>{campaign.title}</h3>
                                                    <div className='md:ml-auto'>
                                                        {status === 'Upcoming' ? (
                                                            <span className='bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-md'>Upcoming</span>
                                                        ) : status === 'Ongoing' ? (
                                                            <span className='bg-green-100 text-green-800 text-sm px-3 py-1 rounded-md'>Ongoing</span>
                                                        ) : (
                                                            <span className='bg-red-100 text-red-800 text-sm px-3 py-1 rounded-md'>Ended</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex-inline break-words'>{campaign.description}</div>
                                            <div className='flex md:flex-row flex-col md:space-x-8'>
                                                <div>
                                                    <p>
                                                        <span className='font-bold'>{campaign.rewardPool}</span> Reward Pool
                                                    </p>
                                                </div>
                                                <div>
                                                    <p>
                                                        <span className='font-bold'>{campaign.quests}</span> Quests
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='flex space-x-8 flex-row'>
                                                <div className='flex flex-col space-y-1'>
                                                    <p className='text-xs font-semibold text-[#b8b8b8]'>Start</p>
                                                    <span className='text-sm'>{formatDateTime(campaign.dateStart)}</span>
                                                </div>
                                                <div className='flex flex-col space-y-1'>
                                                    <p className='text-xs font-semibold text-[#b8b8b8]'>End</p>
                                                    <span className='text-sm'>{formatDateTime(campaign.dateEnd)}</span>
                                                </div>
                                            </div>
                                            {status !== 'Ended' ? (
                                                <div>
                                                    {status === 'Upcoming' ? (
                                                        <div className='flex flex-col space-y-1'>
                                                            <div className='whitespace-nowrap text-xs font-semibold text-[#b8b8b8]'>Starts in</div>
                                                            <div className='flex space-x-2.5 items-center'>
                                                                <div className='flex flex-col space-y-1 items-center'>
                                                                    <p className='bg-[#f5f5f5] pt-2 text-center rounded-xl font-bold text-xl w-10 h-10 text-black'>
                                                                        {days}
                                                                    </p>
                                                                    <p>Days</p>
                                                                </div>
                                                                <div className='flex flex-col space-y-1 items-center'>
                                                                    <p className='bg-[#f5f5f5] pt-2 text-center rounded-xl font-bold text-xl w-10 h-10 text-black'>
                                                                        {hours}
                                                                    </p>
                                                                    <p>Hours</p>
                                                                </div>
                                                                <div className='flex flex-col space-y-1 items-center'>
                                                                    <p className='bg-[#f5f5f5] pt-2 text-center rounded-xl font-bold text-xl w-10 h-10 text-black'>
                                                                        {minutes}
                                                                    </p>
                                                                    <p>Minutes</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className='flex flex-col space-y-1'>
                                                            <div className='whitespace-nowrap text-xs font-semibold text-[#b8b8b8]'>Ends in</div>
                                                            <div className='flex space-x-2.5 items-center'>
                                                                <div className='flex flex-col space-y-1 items-center'>
                                                                    <p className='bg-[#f5f5f5] pt-2 text-center rounded-xl font-bold text-xl w-10 h-10 text-black'>
                                                                        {days}
                                                                    </p>
                                                                    <p>Days</p>
                                                                </div>
                                                                <div className='flex flex-col space-y-1 items-center'>
                                                                    <p className='bg-[#f5f5f5] pt-2 text-center rounded-xl font-bold text-xl w-10 h-10 text-black'>
                                                                        {hours}
                                                                    </p>
                                                                    <p>Hours</p>
                                                                </div>
                                                                <div className='flex flex-col space-y-1 items-center'>
                                                                    <p className='bg-[#f5f5f5] pt-2 text-center rounded-xl font-bold text-xl w-10 h-10 text-black'>
                                                                        {minutes}
                                                                    </p>
                                                                    <p>Minutes</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <div className='xl:w-full max-w-6xl flex flex-col items-center gap-y-9 mx-5 sm:mx-8 md:mx-9 xl:mx-auto pt-14 pb-20 md:pb-10 lg:pb-32 xl:pb-20 border-t border-grayscale-8'>
                    <div className='flex sm:flex-row flex-col items-center gap-y-2 px-2 sm:px-0 w-full'>
                        <p className='font-semibold text-2xl'>Check out our top 3 users</p>
                        <a onClick={handleLeaderboardOpen} className='font-semibold ml-auto border border-grayscale-2 rounded-lg px-4 py-2 w-full sm:w-auto text-center hover:bg-[#f5f5f5] dark:hover:text-black cursor-pointer'>
                            Leaderboard
                            <img src='arrowright.svg' className='inline-block ml-2' />
                        </a>
                    </div>
                    <Top3Leaderboard />
                </div>

                {showScrollToTop && (
                    <button
                        onClick={moveToTop}
                        className={`fixed bottom-5 right-5 bg-[#b8b8b8] text-white p-3 mb-16 rounded-lg shadow-lg hover:bg-[#777777] transition-opacity duration-500 ease-in-out ${showScrollToTop ? 'opacity-100' : 'opacity-0'}`}
                    >
                        ↑ Top
                    </button>
                )}
                </div>
            </div>
        </div>
    );
};

export default Homepage;
