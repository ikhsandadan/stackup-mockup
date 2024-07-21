import { NextResponse } from "next/server";

import { connectToDatabase } from "@/app/utils/mongodb";
import User from "@/app/utils/user";

// Function to add Stackcoin to database
export async function PUT(req: Request, { params }: any = {}) {
    try {
        await connectToDatabase();
        const { id } = params;
        const body = await req.json();
        const stackcoin = body.stackcoin;
        const command = body.command;

        if (command === "push" ){
            const updateUserData = await User.findByIdAndUpdate(id, {
                $push: {stackcoin: stackcoin}
            })

            return NextResponse.json({ message: "Stackcoin Updated", user: updateUserData}, { status: 200 });
        } else if (command === "set") {
                const updateUserData = await User.findByIdAndUpdate(id, {
                $set: { stackcoin: stackcoin } // This replaces the entire array or value with the new Stackcoin
            }, { new: true }); // { new: true } returns the updated document
    
            return NextResponse.json({ message: "Stackcoin Updated", user: updateUserData }, { status: 200 });
        }
        
    } catch (error) {
        return NextResponse.json({ message: "Error", error}, { status: 500 });
    }
};