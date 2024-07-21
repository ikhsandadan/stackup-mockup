"use client";
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Pagination from '@mui/material/Pagination';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

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

const Leaderboard = () => {
    const { darkMode, top3Users, allUsersData, userName } = useAppContext();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [myPosition, setMyPosition] = useState<number>(0);
    const usersPerPage = 10;

    // Calculate the total number of pages
    const totalPages = Math.ceil(allUsersData.length / usersPerPage);

    // Calculate the start and end index of the users to display on the current page
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const currentUsers = allUsersData.slice(startIndex, endIndex);

    // Handler to change page
    const handlePageChange = (event: React.ChangeEvent<unknown>, page: any) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const index = allUsersData.findIndex(user => user.username === userName);

        // If the user is found, update the position
        if (index !== -1) {
            setMyPosition(index + 1);
        } else {
            setMyPosition(0);
        }
    }, [allUsersData, userName]);
    

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <div className='w-full sm:p-14 p-5 min-h-screen dark:bg-gray-900 dark:text-white text-black transition-colors duration-300'>
            <h1 className='text-center text-4xl'>Leaderboard</h1>
            <div>
                <div className='flex flex-col gap-y-4 mx-5 sm:mx-20 lg:mx-28 py-10'>
                    <h1 className='text-xl md:text-2xl font-semibold text-center'>🏆 Top 3</h1>
                    <div className='h-full flex flex-col md:flex-row justify-center items-center py-6 space-y-4 md:space-y-0 md:space-x-6'>
                        <div className='border rounded-lg p-8'>
                            <div className='flex-1 flex flex-col items-center gap-2'>
                                <img
                                    src={top3Users[1]?.imageProfile.length > 0 ? top3Users[1].imageProfile : 'defaultprofile.svg'}
                                    alt="second place"
                                    className='h-24 w-24 rounded-full'
                                />
                                <div className='text-center font-semibold text-xl'>{top3Users[1]?.username}</div>
                                <div className='text-center text-lg font-bold'>{top3Users[1]?.score} <small>Points</small></div>
                                <div className='text-center text-4xl font-bold'>2</div>
                            </div>
                        </div>
                        <div className='border rounded-lg p-8'>
                            <div className='flex-1 flex flex-col items-center gap-2'>
                                <img
                                    src={top3Users[0]?.imageProfile.length > 0 ? top3Users[0].imageProfile : 'defaultprofile.svg'}
                                    alt="first place"
                                    className='h-28 w-28 rounded-full'
                                />
                                <div className='text-center font-semibold text-xl'>{top3Users[0]?.username}</div>
                                <div className='text-center text-lg font-bold'>{top3Users[0]?.score} <small>Points</small></div>
                                <div className='text-center text-6xl font-bold'>1</div>
                            </div>
                        </div>
                        <div className='border rounded-lg p-8'>
                            <div className='flex-1 flex flex-col items-center gap-2'>
                                <img
                                    src={top3Users[2]?.imageProfile.length > 0 ? top3Users[2].imageProfile : 'defaultprofile.svg'}
                                    alt="third place"
                                    className='h-20 w-20 rounded-full'
                                />
                                <div className='text-center font-semibold text-xl'>{top3Users[2]?.username}</div>
                                <div className='text-center text-lg font-bold'>{top3Users[2]?.score} <small>Points</small></div>
                                <div className='text-center text-3xl font-bold'>3</div>
                            </div>
                        </div>
                    </div>
                </div>
                <h1 className='text-xl md:text-2xl font-semibold text-center'>Your Position</h1>
                <h2 className='text-center text-4xl font-semibold mt-2'>{myPosition}</h2>
                <div className='flex flex-col gap-y-4 mx-5 sm:mx-20 lg:mx-28 py-10'>
                    <h1 className='text-xl md:text-2xl font-semibold text-center'>All Users</h1>
                    <ul className='flex flex-col gap-4 self-center w-2/4'>
                        {/* Header row */}
                        <li className='grid grid-cols-6 items-center border-b p-2 bg-gray-300 dark:bg-gray-700'>
                            <div className='font-bold text-lg text-center'>Rank</div>
                            <div className='font-bold text-lg text-center'>Profile</div>
                            <div className='font-bold text-lg text-center'>Username</div>
                            <div className='font-bold text-lg text-center'>Score</div>
                            <div className='font-bold text-lg text-center'>Quests Completed</div>
                            <div className='font-bold text-lg text-center'>Bounties Completed</div>
                        </li>

                        {/* User rows */}
                        {currentUsers.map((user, index) => (
                            <li key={startIndex + index + 1} className={`grid grid-cols-6 items-center border-b p-2 last:border-b-0 ${user.username === userName ? 'dark:bg-gray-600 bg-gray-200' : ''}`}>
                                <div className='font-semibold text-lg text-center'>{startIndex + index + 1}</div>
                                <div className='flex justify-center'>
                                    <img
                                        src={user.imageProfile.length > 0 ? user.imageProfile : 'defaultprofile.svg'}
                                        alt="profilepicture"
                                        className='w-14 h-14 rounded-full'
                                    />
                                </div>
                                <div className='font-semibold text-lg text-center'>{user.username}</div>
                                <div className='font-semibold text-lg text-center'>{user.score}</div>
                                <div className='font-semibold text-lg text-center'>{user.quests}</div>
                                <div className='font-semibold text-lg text-center'>{user.bounty}</div>
                            </li>
                        ))}
                    </ul>
                    <Stack spacing={2} className='mt-4 self-center'>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            shape="rounded"
                        />
                    </Stack>

                    <div className='mx-5 sm:mx-20 lg:mx-28 py-10'>
                        <h2 className='text-xl md:text-2xl font-semibold'>Leaderboard Ranking Explanation</h2>
                        <p className='mt-2'>
                            The leaderboard ranks users based on their total score, which is calculated as follows:
                        </p>
                        <ul className='list-disc list-inside mt-2'>
                            <li>Each completed quest is worth 1 point.</li>
                            <li>Each completed bounty is worth 3 points.</li>
                        </ul>
                        <p className='mt-2'>
                            The scores from quests and bounties are summed up to determine the user&apos;s total score and their ranking on the leaderboard.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </ThemeProvider>
    );
};

export default Leaderboard;