import { NextResponse } from "next/server";

import { connectToDatabase } from "@/app/utils/mongodb";
import User from "@/app/utils/user";

// Function to add image to database
export async function PUT(req: Request, { params }: any = {}) {
    try {
        await connectToDatabase();
        const { id } = params;
        const body = await req.json();
        const image = body.image;
        const command = body.command;

        if (command === "push" ){
            const updateUserData = await User.findByIdAndUpdate(id, {
                $push: {imageProfile: image}
            })

            return NextResponse.json({ message: "Image Uploaded"}, { status: 200 });
        } else if (command === "set") {
                const updateUserData = await User.findByIdAndUpdate(id, {
                $set: { imageProfile: image } // This replaces the entire array or value with the new image
            }, { new: true }); // { new: true } returns the updated document
    
            return NextResponse.json({ message: "Image Updated", user: updateUserData }, { status: 200 });
        }
        
    } catch (error) {
        return NextResponse.json({ message: "Error", error}, { status: 500 });
    }
};