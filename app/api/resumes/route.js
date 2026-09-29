import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import path from "path";
import fs from "fs";

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.formData();

    const name = data.get("name");
    const email = data.get("email");
    const phone = data.get("phone");
    const skills = data.get("skills");
    const experience = data.get("experience");
    const file = data.get("file");

    let imageUrl = "";

    // File handling
    if (file && typeof file === "object" && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Unique filename create karein
      const uniqueName = Date.now() + "-" + file.name.replace(/\s+/g, "_");
      const uploadDir = path.join(process.cwd(), "uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, uniqueName);
      fs.writeFileSync(filePath, buffer);

      // Browser URL set karein
      imageUrl = `/api/uploads/${uniqueName}`;
    }

    const newResume = await Resume.create({
      name,
      email,
      phone,
      skills,
      experience,
      imageUrl, 
    });

    return NextResponse.json({ success: true, data: newResume });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}