// import { NextResponse } from 'next/server';
// import fs from 'fs/promises';
// import path from 'path';

// export async function POST(request: Request) {
//   const uploadDir = path.join(process.cwd(), 'public/images');
//   try {
//     // Ensure the upload directory exists
//     await fs.mkdir(uploadDir, { recursive: true });

//     // Parse the FormData from the Request
//     const formData = await request.formData();
//     const file = formData.get('image') as File | null;

//     if (!file) {
//       return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
//     }

//     // Validate file extension
//     const validExtensions = ['.jpeg', '.jpg', '.img', '.png'];
//     const extension = path.extname(file.name).toLowerCase();
//     if (!validExtensions.includes(extension)) {
//       return NextResponse.json(
//         { error: 'Invalid file type. Only JPEG, JPG, IMG, PNG allowed.' },
//         { status: 400 }
//       );
//     }

//     // Generate a unique filename to avoid conflicts
//     const filename = `${Date.now()}-${file.name}`;
//     const filepath = path.join(uploadDir, filename);

//     // Save the file to public/images/
//     const buffer = Buffer.from(await file.arrayBuffer());
//     await fs.writeFile(filepath, buffer);

//     const imagePath = `/images/${filename}`;
//     console.log('Uploaded image path:', imagePath);

//     return NextResponse.json({ imagePath });
//   } catch (error) {
//     console.error('Upload error:', error);
//     return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
//   }
// }

// app/api/upload/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file extension
    const validExtensions = ['.jpeg', '.jpg', '.png', '.webp'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !validExtensions.includes(`.${extension}`)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, JPG, PNG, WEBP allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 2MB.' },
        { status: 400 }
      );
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Return the base64 string as the image path
    return NextResponse.json({ 
      imagePath: base64String,
      filename: file.name
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}