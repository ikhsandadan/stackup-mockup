"use client";
import { useEffect, useState } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useAppContext } from '../context/AppContext';
import techRoles from '../utils/role';
import TechStacks from '../utils/techstacks';
import careerlevel from '../utils/careerlevel';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name: string, personName: string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const Account = () => {
    const { 
        userId, 
        userName, 
        imageProfile, 
        role, 
        techStack,
        nationality,
        careerLevel,
        balance,
        quests,
        bounty,
        stackcoin,
        convertToBase64,
        setLoadingAlertMessage,
        setLoadingUpdateAlertMessage,
        isUsernameAvailable, 
        uploadImageToDatabase, 
        findUserById, 
        updateRoleToDatabase,
        updateTechStacksToDatabase,
        fetchCountryList,
        updateNationalityToDatabase,
        updateCareerLevelToDatabase,
        updateUsernameToDatabase,
        updateBalanceToDatabase,
        updateQuestsToDatabase,
        updateBountyToDatabase,
        updateStackcoinToDatabase,
    } = useAppContext();
    const theme = useTheme();

    type EditableFields = 'userName' | 'nationality' | 'careerLevel' | 'roles' | 'techStacks' | 'balance' | 'quests' | 'bounty' | 'stackcoin';

    const [editing, setEditing] = useState(false);
    const [showUsernameIcon, setShowUsernameIcon] = useState<JSX.Element | null>(null);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [profilePicture, setProfilePicture] = useState<string>('defaultprofile.svg');
    const [newProfilePicture, setNewProfilePicture] = useState<string | undefined>(undefined);
    const [countryList, setCountryList] = useState<string[]>([]);

    const sortCountryList = () => {
        const sortedList = [...countryList].sort((a, b) => a.localeCompare(b));
        setCountryList(sortedList);
    };

    const [values, setValues] = useState<Record<EditableFields, string | string[] | number>>({
        userName: userName || '',
        nationality: nationality || '',
        careerLevel: careerLevel || '',
        roles: Array.isArray(role) ? role : (role ? [role] : []),
        techStacks: Array.isArray(techStack) ? techStack : (techStack ? [techStack] : []),
        balance: balance || 0,
        quests: quests || 0,
        bounty: bounty || 0,
        stackcoin: stackcoin || 0,
    });

    const [initialValues, setInitialValues] = useState<Record<EditableFields, string | string[] | number>>(values);

    const handleEditToggle = async () => {
        setEditing(!editing);
        if (!editing) {
            setInitialValues(values);
        } else {
            setUsernameAvailable(null);
            setValues(initialValues);
            await findUserById(userId);
            if (imageProfile) {
                setProfilePicture(imageProfile);
            } else {
                setProfilePicture('defaultprofile.svg');
            }
        }
    };

    const handleChange = async (field: EditableFields, value: string | string[]) => {
        setValues(prevState => ({
            ...prevState,
            [field]: value,
        }));

        if (field === 'userName') {
            const available = await isUsernameAvailable(value as string);
            setUsernameAvailable(available);
        }
    };

    const handleSave = async (e: any) => {
        e.preventDefault();

        const loadingMessage = 'Updating Profile...';
        const idMessage = setLoadingAlertMessage(loadingMessage);
    
        try {

            if (newProfilePicture) {
                if (imageProfile) {
                    // Handle change to a new profile picture
                    await uploadImageToDatabase(userId, newProfilePicture, 'set');
                } else {
                    // Handle profile picture upload
                    await uploadImageToDatabase(userId, newProfilePicture, 'push');
                }
                
                // After uploading image, fetch updated user data
                await findUserById(userId); // Ensure imageProfile is updated
        
                // Update profilePicture with the new image
                setProfilePicture(imageProfile || 'defaultprofile.svg');
            }
    
            const rolesArray = Array.isArray(values.roles) ? values.roles : [values.roles];
            const techStacksArray = Array.isArray(values.techStacks) ? values.techStacks : [values.techStacks];

            // Update username in database
            await updateUsernameToDatabase(userId, values.userName as string, 'set');
    
            // Update roles in database
            await updateRoleToDatabase(userId, rolesArray as string[], 'set');
    
            // Update techStacks in database
            await updateTechStacksToDatabase(userId, techStacksArray as string[], 'set');
    
            // Update nationality in database
            await updateNationalityToDatabase(userId, values.nationality as string, 'set');
    
            // Update careerLevel in database
            await updateCareerLevelToDatabase(userId, values.careerLevel as string, 'set');

            // Update balance in database
            await updateBalanceToDatabase(userId, values.balance as number, 'set');

            // Update quests in database
            await updateQuestsToDatabase(userId, values.quests as number, 'set');

            // Update bounty in database
            await updateBountyToDatabase(userId, values.bounty as number, 'set');

            // Update stackcoin in database
            await updateStackcoinToDatabase(userId, values.stackcoin as number, 'set');
    
            await findUserById(userId);

            setLoadingUpdateAlertMessage(idMessage, 'Profile updated successfully', 'success');

            handleEditToggle();
        } catch (error: any) {
            setLoadingUpdateAlertMessage(idMessage, 'An error occurred while updating profile', 'error');
        }
    };    

    useEffect(() => {
        if (usernameAvailable !== null) {
            setShowUsernameIcon(
                usernameAvailable ? (
                    <img src="checktrue.svg" alt="checktrue" className="w-5 h-5" id="username-true" />
                ) : (
                    <img src="checkfalse.svg" alt="checkfalse" className="w-5 h-5" id="username-false" />
                )
            );
        }
    }, [usernameAvailable]);

    const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const base64 = await convertToBase64(file!);

        setNewProfilePicture(base64 as any);
        setProfilePicture(base64 as any);
    };

    useEffect(() => {
        if (userName) {
            setValues(prevState => ({
                ...prevState,
                userName: userName
            }));
        }

        if (imageProfile) {
            setProfilePicture(imageProfile);
        }

        if (role) {
            setValues(prevState => ({
                ...prevState,
                roles: role
            }));
        }

        if (techStack) {
            setValues(prevState => ({
                ...prevState,
                techStacks: techStack
            }));
        }

        if (nationality) {
            setValues(prevState => ({
                ...prevState,
                nationality: nationality
            }));
        }

        if (careerLevel) {
            setValues(prevState => ({
                ...prevState,
                careerLevel: careerLevel
            }));
        }

        if (balance) {
            setValues(prevState => ({
                ...prevState,
                balance: balance
            }));
        }

        if (quests) {
            setValues(prevState => ({
                ...prevState,
                quests: quests
            }));
        }

        if (bounty) {
            setValues(prevState => ({
                ...prevState,
                bounty: bounty
            }));
        }

        if (stackcoin) {
            setValues(prevState => ({
                ...prevState,
                stackcoin: stackcoin
            }));
        }

        sortCountryList();
    }, [userName, imageProfile, role, techStack, nationality, careerLevel, balance, quests, bounty, stackcoin]);

    useEffect(() => {
        const fetchDataCountry = async () => {
            try {
                const countries = await fetchCountryList();
                const countryNames = countries.map((country: any) => country.name.common);
                setCountryList(countryNames);
            } catch (error) {
                console.error('Error fetching country list:', error);
            }
        };
    
        fetchDataCountry();
    }, []);
    
    const handleRoleChange = (event: SelectChangeEvent<typeof values.roles>) => {
        const {
            target: { value },
        } = event;
    
        const selectedRoles = Array.isArray(value) ? value : [value];
    
        setValues(prevState => ({
            ...prevState,
            roles: selectedRoles as string[],
        }));
    };       

    const handleTechStacksChange = (event: SelectChangeEvent<typeof values.techStacks>) => {
        const {
            target: { value },
        } = event;
    
        const selectedTechStacks = Array.isArray(value) ? value : [value];
    
        setValues(prevState => ({
            ...prevState,
            techStacks: selectedTechStacks as string[],
        }));
    };

    const handleCountryChange = (event: SelectChangeEvent<string>) => {
        sortCountryList();
        const {
            target: { value },
        } = event;
    
        setValues(prevState => ({
            ...prevState,
            nationality: value,
        }));
    };

    const handleCareerLevelChange = (event: SelectChangeEvent<string>) => {
        const {
            target: { value },
        } = event;
    
        setValues(prevState => ({
            ...prevState,
            careerLevel: value,
        }));
    };

    return (
        <div className='w-full sm:p-14 p-5 min-h-screen dark:bg-gray-900 dark:text-white text-black transition-colors duration-300'>
            <div className='max-w-7xl mx-auto'>
                <section className='flex flex-col max-w-3xl sm:pb-12 space-y-10'>
                    <h1 className='text-2xl font-bold'>My Profile</h1>
                    <div className='flex border rounded-lg p-5'>
                        <div className='relative cursor-pointer'>
                            <div className='w-20 h-20'>
                                <img src={profilePicture} alt="profilepicture" className='bg-auto w-20 h-20 rounded-full' />
                            </div>
                            {editing && (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className='absolute inset-0 bg-auto opacity-0 cursor-pointer rounded-full w-20 h-20'
                                    />
                                    <label className='absolute bottom-0 w-full text-center text-white bg-black bg-opacity-50 p-1 rounded-b-full'>Change</label>
                                </div>
                            )}
                        </div>
                        <div className='ml-7 flex flex-col place-content-center'>
                            <p className='font-semibold pb-2'>Username</p>
                            {editing ? (
                                <div className='relative'>
                                    <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                                        {showUsernameIcon}
                                    </div>
                                    <input
                                        type="text"
                                        value={values.userName as string}
                                        onChange={(e) => handleChange('userName', e.target.value)}
                                        className='mr-2 bg-[#f5f5f5] dark:bg-[#272d3b] p-1'
                                    />
                                </div>
                            ) : (
                                <p className='mr-2'>{values.userName}</p>
                            )}
                        </div>
                    </div>
                    <p className='text-[#777777] font-semibold'>Your username is retrieved from your StackUp account.</p>
                    <div className='flex flex-col place-content-center'>
                        <p className='font-semibold pb-2'>Nationality</p>
                        {editing ? (
                            <Select
                                labelId="nationality-select-label"
                                id="nationality-select"
                                value={values.nationality as string}
                                onChange={handleCountryChange}
                                input={<OutlinedInput label="Nationality" />}
                                MenuProps={MenuProps}
                                className='bg-[#f5f5f5] dark:bg-[#272d3b] p-1 text-black dark:text-white'
                            >
                                {countryList.map((country) => (
                                    <MenuItem key={country} value={country}>
                                        {country}
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : (
                            <p>{values.nationality}</p>
                        )}
                    </div>
                    <div className='flex flex-col place-content-center'>
                        <p className='font-semibold pb-2'>Career Level</p>
                        {editing ? (
                            <Select
                                labelId="careerlevel-select-label"
                                id="careerlevel-select"
                                value={values.careerLevel as string}
                                onChange={handleCareerLevelChange}
                                input={<OutlinedInput label="careerlevel" />}
                                MenuProps={MenuProps}
                                className='bg-[#f5f5f5] dark:bg-[#272d3b] p-1 text-black dark:text-white'
                            >
                                {careerlevel.map((career) => (
                                    <MenuItem key={career} value={career}>
                                        {career}
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : (
                            <p>{values.careerLevel}</p>
                        )}
                    </div>
                    <div className='flex flex-col place-content-center'>
                        <p className='font-semibold pb-2'>Role / Expertise Area(s)</p>
                        {editing ? (
                            <FormControl sx={{ m: 1, width: 'auto'}}>
                                <Select
                                    labelId="role-multiple-select-label"
                                    id="role-multiple-select"
                                    multiple
                                    value={values.roles as string[]}
                                    onChange={handleRoleChange}
                                    input={<OutlinedInput label="Roles" />}
                                    MenuProps={MenuProps}
                                    className='bg-[#f5f5f5] dark:bg-[#272d3b] p-1 text-black dark:text-white'
                                >
                                    {techRoles.map((role) => (
                                        <MenuItem
                                            key={role}
                                            value={role}
                                            style={getStyles(role, values.roles as string[], theme)}
                                        >
                                            {role}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : (
                            <p>{Array.isArray(values.roles) ? values.roles.join(', ') : ''}</p>
                        )}
                    </div>
                    <div className='flex flex-col place-content-center'>
                        <p className='font-semibold pb-2'>Tech Stacks</p>
                        {editing ? (
                            <FormControl sx={{ m: 1, width: 'auto'}}>
                                <Select
                                    labelId="techstacks-multiple-select-label"
                                    id="techstacks-multiple-select"
                                    multiple
                                    value={values.techStacks as string[]}
                                    onChange={handleTechStacksChange}
                                    input={<OutlinedInput label="TechStacks" />}
                                    MenuProps={MenuProps}
                                    className='bg-[#f5f5f5] dark:bg-[#272d3b] p-1 text-black dark:text-white'
                                >
                                    {TechStacks.map((techstack) => (
                                        <MenuItem
                                            key={techstack}
                                            value={techstack}
                                            style={getStyles(techstack, values.techStacks as string[], theme)}
                                        >
                                            {techstack}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : (
                            <p>{Array.isArray(values.techStacks) ? values.techStacks.join(', ') : ''}</p>
                        )}
                    </div>

                    <div className='font-semibold text-xl self-center'>This is for testing purposes</div>

                    <div className='flex flex-col place-content-center'>
                        <p className='font-semibold pb-2'>Balance</p>
                        {editing ? (
                            <input
                                type="number"
                                value={values.balance as number}
                                onChange={(e) => handleChange('balance', e.target.value)}
                                className='mr-2 bg-[#f5f5f5] dark:bg-[#272d3b] p-1'
                            />
                        ) : (
                            <p className='mr-2'>{values.balance}</p>
                        )}
                    </div>
                    <div className='flex flex-col place-content-center'>
                        <p className='font-semibold pb-2'>Quests Completed</p>
                        {editing ? (
                            <input
                                type="number"
                                value={values.quests as number}
                                onChange={(e) => handleChange('quests', e.target.value)}
                                className='mr-2 bg-[#f5f5f5] dark:bg-[#272d3b] p-1'
                            />
                        ) : (
                            <p className='mr-2'>{values.quests}</p>
                        )}
                    </div>
                    <div className='flex flex-col place-content-center'>
                        <p className='font-semibold pb-2'>Bounty Completed</p>
                        {editing ? (
                            <input
                                type="number"
                                value={values.bounty as number}
                                onChange={(e) => handleChange('bounty', e.target.value)}
                                className='mr-2 bg-[#f5f5f5] dark:bg-[#272d3b] p-1'
                            />
                        ) : (
                            <p className='mr-2'>{values.bounty}</p>
                        )}
                    </div>
                    <div className='flex flex-col place-content-center'>
                        <p className='font-semibold pb-2'>Stackcoin Collected</p>
                        {editing ? (
                            <input
                                type="number"
                                value={values.stackcoin as number}
                                onChange={(e) => handleChange('stackcoin', e.target.value)}
                                className='mr-2 bg-[#f5f5f5] dark:bg-[#272d3b] p-1'
                            />
                        ) : (
                            <p className='mr-2'>{values.stackcoin}</p>
                        )}
                    </div>
                    {editing ? (
                        <div className='flex space-x-4 self-center'>
                            <button
                                onClick={(e) => handleSave(e)}
                                className={`p-2 border rounded-lg hover:bg-[#d1d5db] dark:hover:text-black ${usernameAvailable === false ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={usernameAvailable === false}
                            >
                                Save
                            </button>
                            <button
                                onClick={handleEditToggle}
                                className='p-2 border rounded-lg hover:bg-[#d1d5db] dark:hover:text-black'
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleEditToggle}
                            className='mt-4 p-2 border rounded-lg self-center hover:bg-[#d1d5db] dark:hover:text-black'
                        >
                            Edit Profile
                        </button>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Account;
