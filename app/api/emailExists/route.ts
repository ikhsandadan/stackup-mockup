import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongodb";
import User from "@/app/utils/user";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { email } = await request.json();
        const user = await User.findOne({ email }).select("_id");
        return NextResponse.json({ user });
    } catch (error: any) {
        console.log(error);
    }
};