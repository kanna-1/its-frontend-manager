import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/upload/program?:
 *   post:
 *     description: |
 *       # Uploads program file into blob storage
 *       Uploads student's solution and teacher's reference program files into blob storage. The content of the request body is a blob object as `ReadableStream`, `String`, `ArrayBuffer` or `Blob` based on these [supported body types](https://developer.mozilla.org/docs/Web/API/fetch#body).
 *       
 *       Program file may be retrieved by performing `fetch(blob.url).then((res) => res.text())`.
 * 
 *       More details may be found in the Vercel Blob SDK [reference](https://vercel.com/docs/storage/vercel-blob/using-blob-sdk).
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: string
 *             binaryEncoding: base64
 *     parameters:
 *       - name: filename
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the program file to be uploaded
 *     responses:
 *       200:
 *         description: Successful upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                 downloadUrl:
 *                   type: string
 *                 pathname:
 *                   type: string
 *                 contentType:
 *                   type: string
 *                 contentDisposition:
 *                   type: string
 *       400:
 *         description: Bad request (missing filename or file content)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export async function POST(request: Request): Promise<NextResponse> {
  console.log(request.url)
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
