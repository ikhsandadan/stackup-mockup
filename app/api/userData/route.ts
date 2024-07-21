import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongodb";
import User from "@/app/utils/user";

// Find the user by _id and return all fields
export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { id } = await request.json();
        const user = await User.findById(id);
        return NextResponse.json({ user });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: 'An error occurred while fetching the user data' }, { status: 500 });
    }
};