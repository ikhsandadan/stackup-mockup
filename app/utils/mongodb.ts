import mongoose from 'mongoose';

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('MongoDB connected successfully');
    } catch (error: any) {
        console.error('MongoDB connection error:', error);
    }
};