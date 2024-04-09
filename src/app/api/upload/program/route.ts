import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

/**
 * Uploads program file into blob storage
 * Includes submitted reference programs from teachers and solution programs for students
 * @param request 
 * @returns PutBlobResult
 * Retrieve program text by fetch(blob.url).then((res) => res.text())
 */
export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json(
      { error: "Expected filename in url." },
      { status: 400 }
    );
  }
  
  if (!request.body) {
    return NextResponse.json(
      { error: "Expected file content in request body." },
      { status: 400 }
    );
  }

  const blob = await put(filename, request.body, {
    access: "public",
  });

  return NextResponse.json(blob, {status: 200});
}
