import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongodb";
import User from "@/app/utils/user";

export async function GET() {
    try {
        await connectToDatabase();
        const users = await User.find({}).select("username quests bounty imageProfile");
        return NextResponse.json({ users });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred while fetching quests." }, { status: 500 });
    }
};