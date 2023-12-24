import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from "path";

export async function POST(request: NextRequest) {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const dirRelativeToPublicFolder = "uploads";
    const dir = path.resolve("./", "public", dirRelativeToPublicFolder);
    // console.log(dir);

    if (!file) {
        return NextResponse.json({ success: false })
    }

    const bytes = await file.arrayBuffer()
    return NextResponse.json({ path: dir })
    // const buffer = Buffer.from(bytes)

    // const filePath = `${dir}/${file.name}`
    // await writeFile(filePath, buffer)

    // return NextResponse.json({ success: true })
}

export async function GET() {
    return NextResponse.json({ url: '/api/upload', type: 'GET' })
}