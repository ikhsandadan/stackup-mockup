import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongodb";
import User from "@/app/utils/user";

// Function to add order to database
export async function PUT(req: Request, { params }: any = {}) {
    try {
        await connectToDatabase();
        const { id } = params;
        const body = await req.json();
        const myCart = body.myCart;
        const command = body.command;

        if (command === "push") {
            const updateUserData = await User.findByIdAndUpdate(
                id,
                { $push: { myOrder: myCart } },  // Use $push to replace myOrder with new data
            );

            return NextResponse.json({ message: "Order Updated", user: updateUserData }, { status: 200 });
        } else if (command === "set") {
            const updateUserData = await User.findByIdAndUpdate(
                id,
                { $set: { myOrder: myCart } },  // Use $set to replace myOrder with new data
            );

            return NextResponse.json({ message: "Order Updated", user: updateUserData }, { status: 201 });
        }

    } catch (error) {
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
};
