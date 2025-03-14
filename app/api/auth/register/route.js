import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export const POST = async (request) => {
  await dbConnect();

  try {
    const body = await request.json();
    console.log("Request body:", body); // Log the request payload
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "Email is already registered" }),
        { status: 409 }
      );
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    return new NextResponse(
      JSON.stringify({ message: "User registered successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
