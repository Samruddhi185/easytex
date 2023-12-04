import { NextRequest, NextResponse } from "next/server";
import latex from 'node-latex';
import fs from 'fs';
import { Readable } from 'stream'

export async function POST(request: NextRequest) {
    const body = await request.json();
    const input = body.input;
    // const dataStream = Readable['from']([input]);
    console.log("reached", body);
    const buffer = latex(input);
    console.log(buffer);
    fs.writeFileSync('C:\\Users\\imtoo\\Downloads\\out.pdf', '');
    
    const output = fs.createWriteStream('C:\\Users\\imtoo\\Downloads\\out.pdf');
    buffer.pipe(output);
    
    return NextResponse.json({
        success: true,
    });
}