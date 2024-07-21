import mongoose, { Schema, Document, Model } from 'mongoose';
import { dataProduct } from '../context/AppContext';

interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    imageProfile: string[];
    balance: number;
    quests: number;
    bounty: number;
    stackcoin: number;
    nationality: string;
    careerLevel: string;
    role: string[];
    techStacks: string[];
    myOrder: [
        {
            orderId: Number,
            productId: String,
            productName: String,
            price: Number,
            quantity: Number,
            image: String,
            size: String,
            delivered: Boolean,
            firstName: String,
            lastName: String,
            address: String,
            city: String,
            state: String,
            country: String,
            zipCode: String,
            phoneNumber: String,
        }
    ];
    agreement: boolean;
    contentsEmail: boolean;
}

// Define the user schema
const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageProfile: { type: [String] },
    balance: { type: Number, default: 0 },
    quests: { type: Number, default: 0 },
    bounty: { type: Number, default: 0 },
    stackcoin: { type: Number, default: 0 },
    nationality: { type: String },
    careerLevel: { type: String },
    role: { type: [String] },
    techStacks: { type: [String] },
    myOrder: [
        {
            orderId: Number,
            productId: String,
            productName: String,
            price: Number,
            quantity: Number,
            image: String,
            size: String,
            delivered: Boolean,
            firstName: String,
            lastName: String,
            address: String,
            city: String,
            state: String,
            country: String,
            zipCode: String,
            phoneNumber: String,
        }
    ],
    agreement: { type: Boolean, required: true },
    contentsEmail: { type: Boolean },
}, { timestamps: true });

// Define the User model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;