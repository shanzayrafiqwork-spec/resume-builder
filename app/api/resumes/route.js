import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Resume from "@/models/Resume";

// GET: Fetch all resumes
export async function GET() {
  try {
    await dbConnect();
    const resumes = await Resume.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: resumes }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new resume record
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const { fullName, email, phone, skills, experience, education, filePath } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, error: "Full Name and Email are required fields." },
        { status: 400 }
      );
    }

    const newResume = await Resume.create({
      fullName,
      email,
      phone,
      skills: Array.isArray(skills) ? skills : skills ? skills.split(",").map(s => s.trim()) : [],
      experience,
      education,
      filePath,
    });

    return NextResponse.json({ success: true, data: newResume }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}