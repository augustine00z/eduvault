import { NextResponse } from "next/server";
import { pinata } from "@/lib/pinata";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const image = form.get("thumbnail");

    if (!file) {
      return NextResponse.json({ error: "No document file provided" }, { status: 400 });
    }

    const results = {};

    // 1️⃣ Upload the main file
    const uploadedFile = await pinata.upload.public.file(file);
    const fileUrl = await pinata.gateways.public.convert(uploadedFile.cid);
    results.fileUrl = fileUrl;

    // 2️⃣ Upload thumbnail (if provided)
    if (image) {
      const fileThumb = await pinata.upload.public.file(image);
      const imgUrl = await pinata.gateways.public.convert(fileThumb.cid);
      results.imgUrl = imgUrl;
    }

    // 3️⃣ Prepare the rest of the form data as JSON
    const otherFields = {};
    for (const [key, value] of form.entries()) {
      if (key !== "file" && key !== "thumbnail") {
        otherFields[key] = value;
      }
    }

    // Include file URLs inside the metadata
    const metadataJSON = {
      ...otherFields,
      file: results.fileUrl,
      image: results.imgUrl || null,
      timestamp: new Date().toISOString(),
    };
    console.log("Metadata JSON to upload:", metadataJSON);

    // 4️⃣ Upload metadata JSON to Pinata
    const uploadedJson = await pinata.upload.public.json(metadataJSON);
    const jsonUrl = await pinata.gateways.public.convert(uploadedJson.cid);
    results.metadataUrl = jsonUrl;

    console.log("Pinata Upload Results:", results);

    // 5️⃣ Return the JSON file URL
    return NextResponse.json({
      success: true,
      fileUrl: results.fileUrl,
      image: results.imgUrl || "",
      metadata: results.metadataUrl,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
