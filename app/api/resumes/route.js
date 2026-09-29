import { NextResponse } from "next/server";
import dbConnect from "@/lib/db"; // Ya aapka db connection path (e.g. ../../../lib/db)
import Resume from "@/models/Resume";

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const skills = formData.get("skills");
    const experience = formData.get("experience");
    const file = formData.get("file");

    let fileName = "";
    if (file && typeof file !== "string") {
      fileName = file.name || "uploaded-file";
    }

    // Save metadata to MongoDB without writing file to local disk (EROFS Fix)
    const newResume = await Resume.create({
      name,
      email,
      phone,
      skills,
      experience,
      fileName,
    });

    return NextResponse.json({
      success: true,
      data: newResume,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}