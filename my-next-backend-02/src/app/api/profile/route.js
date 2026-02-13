import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import connectToDatabase from "@/app/lib/mongodb";
import User from "@/app/lib/models/User";

// --- 1. GET: Fetch the latest user profile ---
export async function GET() {
  try {
    await connectToDatabase();
    // Find the most recently created user
    const user = await User.findOne().sort({ _id: -1 });

    if (!user) {
      return NextResponse.json({ error: "No profile found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// --- 2. POST: Upload and Create Profile (Same as before) ---
export async function POST(request) {
  try {
    await connectToDatabase();

    const formData = await request.formData();
    const file = formData.get("file");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = uuidv4() + path.extname(file.name);
    
    // Ensure "public/uploads" folder exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    
    try {
        await writeFile(path.join(uploadDir, filename), buffer);
    } catch (error) {
        return NextResponse.json({ error: "Failed to save file locally." }, { status: 500 });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      profileImage: `/uploads/${filename}`,
    });

    return NextResponse.json({ 
        message: "Profile created successfully", 
        user: newUser 
    }, { status: 201 });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}