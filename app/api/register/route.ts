import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { connectToDatabase } from "@/app/utils/mongodb";
import User from "@/app/utils/user";

export async function POST(request: Request) {
    try {
        const { email, username, password, imageProfile, balance, quests, bounty, stackcoin, nationality, careerLevel, role, techStacks, myOrder, agreement, contentsEmail } = await request.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        await connectToDatabase();
        await User.create({ email, username, password: hashedPassword, imageProfile, balance, stackcoin, quests, bounty, nationality, careerLevel, role, techStacks, myOrder, agreement, contentsEmail });
        return NextResponse.json({ message: 'User Registered' }, { status: 201});
    } catch (error: any) {
        return NextResponse.json({ message: 'An error occurred while registering the user.' }, { status: 500 });
    }
};