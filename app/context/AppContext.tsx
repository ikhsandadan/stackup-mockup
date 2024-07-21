"use client";
import {
    createContext,
    FC,
    ReactNode,
    useContext,
    useState,
    useEffect
} from "react";
import { Slide, ToastContainer, toast } from 'react-toastify';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import { type } from "os";

type ToastType = 'info' | 'success' | 'warning' | 'error';

const getTheme = (darkMode: boolean) =>
    createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: darkMode ? "#FFFFFF" : "#111827", // Adjust primary color based on mode
            },
            secondary: {
                main: darkMode ? "#111827" : "#FFFFFF", // Adjust secondary color based on mode
            },
            background: {
                default: darkMode ? "#111827" : "#FFFFFF", // Default background color
                paper: darkMode ? "#111827" : "#FFFFFF", // Paper background color
            },
        },
    });

interface AppContextType {
    darkMode: boolean;
    userId: string;
    userName: string;
    userEmail: string;
    imageProfile: string;
    role: string[];
    techStack: string[];
    nationality: string;
    careerLevel: string;
    balance: number;
    quests: number;
    bounty: number;
    stackcoin: number;
    allUsersData: any[];
    top3Users: any[];
    myCart: dataProduct[];
    flagCart: boolean;
    myOrder: dataProduct[];
    setFlagCart: React.Dispatch<React.SetStateAction<boolean>>;
    setMyCart: React.Dispatch<React.SetStateAction<dataProduct[]>>;
    toggleDarkMode: () => void;
    convertToBase64: (file: File) => Promise<any>;
    setSuccessAlertMessage: (message: string | null) => void;
    setErrorAlertMessage: (message: string | null) => void;
    setLoadingAlertMessage: (message: string | null) => void;
    setLoadingUpdateAlertMessage: (id: any | null, message: string | null, type: ToastType | null) => void;
    findUserById: (id: string) => Promise<any>;
    isUsernameAvailable: (username: string) => Promise<any>;
    isEmailAvailable: (email: string) => Promise<any>;
    uploadImageToDatabase: (id: string, image: string, command: string) => Promise<any>;
    updateRoleToDatabase: (id: string, role: string[], command: string) => Promise<any>;
    updateTechStacksToDatabase: (id: string, techStack: string[], command: string) => Promise<any>;
    fetchCountryList: () => Promise<any>;
    updateNationalityToDatabase: (id: string, nationality: string, command: string) => Promise<any>;
    updateCareerLevelToDatabase: (id: string, careerLevel: string, command: string) => Promise<any>;
    updateUsernameToDatabase: (id: string, username: string, command: string) => Promise<any>;
    updateBalanceToDatabase: (id: string, balance: number, command: string) => Promise<any>;
    updateQuestsToDatabase: (id: string, quests: number, command: string) => Promise<any>;
    updateBountyToDatabase: (id: string, bounty: number, command: string) => Promise<any>;
    fetchAllUsersQuestsandBounty: () => Promise<any>;
    updateStackcoinToDatabase: (id: string, stackcoin: number, command: string) => Promise<any>;
    updateMyOrderToDatabase: (id: string, newStackcoin: number, command: string, myOrder: dataProduct[]) => Promise<any>;
}

interface User {
    email: string;
    quests: number;
    bounty: number;
    score?: number; // Optional because it will be added later
}

export type dataProduct = {
    orderId: number;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
    size: string;
    delivered: boolean;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phoneNumber: string;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [imageProfile, setImageProfile] = useState<string>('defaultprofile.svg');
    const [role, setRole] = useState<string[]>([]);
    const [techStack, setTechStack] = useState<string[]>([]);
    const [nationality, setNationality] = useState<string>('');
    const [careerLevel, setCareerLevel] = useState<string>('');
    const [balance, setBalance] = useState<number>(0);
    const [quests, setQuests] = useState<number>(0);
    const [bounty, setBounty] = useState<number>(0);
    const [stackcoin, setStackcoin] = useState<number>(0);
    const [allUsersData, setAllUsersData] = useState<any[]>([]);
    const [top3Users, setTop3Users] = useState<any[]>([]);
    const [myCart, setMyCart] = useState<dataProduct[]>([]);
    const [flagCart, setFlagCart] = useState<boolean>(false);
    const [myOrder, setMyOrder] = useState<dataProduct[]>([]);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setDarkMode(storedTheme === 'dark');
        }

        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    useEffect(() => {
        const storedCart = localStorage.getItem('myCart');
        if (storedCart) {
            setMyCart(JSON.parse(storedCart));
        }
    }, [flagCart]);

    const toggleDarkMode = () => {
        setDarkMode(prevDarkMode => {
            const newDarkMode = !prevDarkMode;
            localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
            return newDarkMode;
        });
    };

    const convertToBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error: any) => {
                reject(error);
            };
        });
    };

    const setSuccessAlertMessage = (message: string | null) => {
        return (
            toast.success(message)
        );
    };

    const setErrorAlertMessage = (message: string | null) => {
        return (
            toast.error(message)
        );
    };

    const setLoadingAlertMessage = (message: string | null) => {
        return toast.loading(message);
    };

    const setLoadingUpdateAlertMessage = (id: any | null, message: string | null, type: ToastType | null) => {

        return toast.update(id, { 
            render: message, 
            type: type, 
            isLoading: false, 
            autoClose: 5000, 
            hideProgressBar: false, 
            closeOnClick: true,
            transition: Slide,
            pauseOnFocusLoss: true,
            rtl: false,
            draggable: true,
            theme: darkMode ? 'dark' : 'light',
            style: {width: 'auto'},
        });
        
    };

    const isUsernameAvailable = async (username: string) => {
        try {
            const res = await fetch('/api/usernameExists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });
    
            const { user } = await res.json();
            return !user; // Assuming `user` is null if the email is available
        } catch (error) {
            console.error('Error checking email availability:', error);
            return null;
        }
    };

    const isEmailAvailable = async (email: string) => {
        try {
            const res = await fetch('/api/emailExists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
    
            const { user } = await res.json();
            return !user; // Assuming `user` is null if the email is available
        } catch (error) {
            console.error('Error checking email availability:', error);
            return null;
        }
    };

    const findUserById = async (id: string) => {
        try {
            const res = await fetch('/api/userData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const userData = await res.json();

            setUserId(userData.user._id);
            setUserEmail(userData.user.email);
            setUserName(userData.user.username);
            setImageProfile(userData.user.imageProfile[0]);
            setRole(userData.user.role);
            setTechStack(userData.user.techStacks);
            setNationality(userData.user.nationality);
            setCareerLevel(userData.user.careerLevel);
            setBalance(userData.user.balance);
            setQuests(userData.user.quests);
            setBounty(userData.user.bounty);
            setStackcoin(userData.user.stackcoin);
            setMyOrder(userData.user.myOrder);
            fetchAllUsersQuestsandBounty();

            return userData;
        } catch (error: any) {
            console.log('Error while finding user by id: ', error);
        }
    };

    const fetchCountryList = async () => {
        const res = await fetch('/api/countries');
        const data = await res.json();
        return data;
    };

    const uploadImageToDatabase = async (id: string, image: string, command: string) => {
        try {
            const res = await fetch(`/api/userData/${id}/imageprofile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image, command }),
            });
    
            const userData = await res.json();
            console.log(userData);
        } catch (error: any) {
            console.log('Error while uploading image to database: ', error);
        }
    };

    const updateRoleToDatabase = async (id: string, role: string[], command: string) => {
        try {
            const res = await fetch(`/api/userData/${id}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role, command }),
            });
    
            const userData = await res.json();
            console.log(userData);
        } catch (error: any) {
            console.log('Error while updating role to database: ', error);
        }
    };

    const updateTechStacksToDatabase = async (id: string, techStack: string[], command: string) => {
        try {
            const res = await fetch(`/api/userData/${id}/techstacks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ techStack, command }),
            });
    
            const userData = await res.json();
            console.log(userData);
        } catch (error: any) {
            console.log('Error while updating tech stacks to database: ', error);
        }
    };

    const updateNationalityToDatabase = async (id: string, nationality: string, command: string) => {
        try {
            const res = await fetch(`/api/userData/${id}/nationality`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nationality, command }),
            });
    
            const userData = await res.json();
            console.log(userData);
        } catch (error: any) {
            console.log('Error while updating nationality to database: ', error);
        }
    };

    const updateCareerLevelToDatabase = async (id: string, careerLevel: string, command: string) => {
        try {
            const res = await fetch(`/api/userData/${id}/careerlevel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ careerLevel, command }),
            });
    
            const userData = await res.json();
            console.log(userData);
        } catch (error: any) {
            console.log('Error while updating career level to database: ', error);
        }
    };

    const updateUsernameToDatabase = async (id: string, username: string, command: string) => {
        try {
            const res = await fetch(`/api/userData/${id}/username`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, command }),
            });
    
            const userData = await res.json();
            console.log(userData);
        } catch (error: any) {
            console.log('Error while updating username to database: ', error);
        }
    };

    const updateBalanceToDatabase = async (id: string, balance: number, command: string) => {
        try {
            const res = await fetch(`/api/userData/${id}/balance`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ balance, command }),
            });
    
            const userData = await res.json();
            console.log(userData);
        } catch (error: any) {
            console.log('Error while updating balance to database: ', error);
        }
    };

    const updateQuestsToDatabase = async (id: string, quests: number, command: string) => {
        try {
            const res = await fetch(`/api/userData/${id}/quests`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quests, command }),
            });
    
            const userData = await res.json();
            console.log(userData);
        } catch (error: any) {
            console.log('Error while updating quests to database: ', error);
        }
    };

    const updateBountyToDatabase = async (id: string, bounty: number, command: string) => {
        try {
            const res = await fetch(`/api/userData/${id}/bounty`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bounty, command }),
            });
    
            const userData = await res.json();
            console.log(userData);
        } catch (error: any) {
            console.log('Error while updating bounty to database: ', error);
        }
    };

    const fetchAllUsersQuestsandBounty = async () => {
        try {
            const res = await fetch('/api/userData/all/questsandbounty', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const userData = await res.json();

            // Calculate the score for each user and add it to the user object
            const usersWithScores = userData.users.map((user: User) => {
                const questsPoints = user.quests * 1;
                const bountyPoints = user.bounty * 3;
                const score = questsPoints + bountyPoints;
                return { ...user, score };
            });

            // Sort users by the calculated score in descending order
            const sortedUsers = usersWithScores.sort((a: User, b: User) => (b.score ?? 0) - (a.score ?? 0));

            // Select the top 3 users
            const top3Users = sortedUsers.slice(0, 3);

            // Set the state with the top 3 users
            setAllUsersData(sortedUsers);
            setTop3Users(top3Users);

        } catch (error: any) {
            console.log('Error while fetching all users quests and bounty: ', error);
        }
    };

    const updateStackcoinToDatabase = async (id: string, stackcoin: number, command: string) => {
        try {
            const res = await fetch(`/api/userData/${id}/stackcoin`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stackcoin, command }),
            });
    
            const userData = await res.json();
            console.log(userData);

            return res;
        } catch (error: any) {
            console.log('Error while updating stackcoin to database: ', error);
        }
    };

    const updateMyOrderToDatabase = async (id: string, newStackcoin: number, command: string, myCart: dataProduct[]) => {
        try {
            // Update stackcoin
            const resStackcoin = await updateStackcoinToDatabase(id, newStackcoin, 'set');

            if (!resStackcoin || !resStackcoin.ok) {
                setErrorAlertMessage('Failed to update stackcoin');
                throw new Error('Failed to update stackcoin');
            }

            // Update cart
            const resCart = await fetch(`/api/userData/${id}/cart`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ myCart, command }),
            });
    
            // Check if response was successful
            if (!resCart.ok) {
                const errorMessage = await resCart.text(); // Get error message from response
                const resStackcoin = await updateStackcoinToDatabase(id, stackcoin, 'set');
                setErrorAlertMessage(`Failed to update cart: ${errorMessage}`);
                throw new Error(`Failed to update cart: ${errorMessage}`);
            }
    
            const updatedOrder = await resCart.json();
            console.log('Order updated:', updatedOrder);
            setSuccessAlertMessage('Successfully submit your order!');
    
        } catch (error: any) {
            console.error('Error while updating database:', error.message);
            setErrorAlertMessage('Error while updating database');
        }
    };    

    return (
        <ThemeProvider theme={getTheme(darkMode)}>
        <AppContext.Provider 
        value={{ 
            darkMode, 
            userId,
            userName, 
            userEmail,
            imageProfile,
            role,
            techStack,
            nationality,
            careerLevel,
            balance,
            quests,
            bounty,
            stackcoin,
            allUsersData,
            top3Users,
            myCart,
            flagCart,
            myOrder,
            setFlagCart,
            setMyCart,
            toggleDarkMode,
            convertToBase64,
            setSuccessAlertMessage, 
            setErrorAlertMessage,
            setLoadingAlertMessage,
            setLoadingUpdateAlertMessage,
            findUserById,
            isUsernameAvailable,
            isEmailAvailable,
            uploadImageToDatabase,
            updateRoleToDatabase,
            updateTechStacksToDatabase,
            fetchCountryList,
            updateNationalityToDatabase,
            updateCareerLevelToDatabase,
            updateUsernameToDatabase,
            updateBalanceToDatabase,
            updateQuestsToDatabase,
            updateBountyToDatabase,
            fetchAllUsersQuestsandBounty,
            updateStackcoinToDatabase,
            updateMyOrderToDatabase,
            }}>
            {children}
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={darkMode ? 'dark' : 'light'}
                transition={Slide}
                style={{width: 'auto'}}
            />
        </AppContext.Provider>
        </ThemeProvider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};

export { AppProvider };
