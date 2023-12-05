import { NextRequest, NextResponse } from "next/server";
import latex from 'node-latex';
import fs from 'fs';

export async function POST(request: NextRequest) {
    const path = "/Users/bhaveshvasnani/Projects/easytex/public/out.pdf";

    const body = await request.json();
    const input = body.input;

    // const input = "\\documentclass{article}\n\n\\usepackage{amsmath}\n\n\\title{Israel v Palestine}\n\\author{}\n\\date{}\n\n\\begin{document}\n\n\\maketitle\n\n\\section{Introduction}\nThis section introduces the context and the historical background of the conflict between Israel and Palestine. It may also provide insights into the purpose and structure of the document.\n\n\\section{Historical Background}\nThis section delves into the historical roots of the conflict, discussing the significant events that have shaped the …ty to the conflict, including the role of the United Nations, peace initiatives, and the position of major global powers.\n\n\\section{Current Situation}\nAn analysis of the current state of affairs in the Israel-Palestine conflict, considering recent developments and ongoing challenges.\n\n\\section{Conclusion}\nA concluding section that summarizes the findings and discussions of the document, and may propose suggestions for the way forward or reflect on the complexity of the conflict.\n\n\\end{document}";
    console.log("reached", input);
    const buffer = latex(input);
    console.log(buffer);
    try {
        fs.unlinkSync(path);
    } catch (e) {

    }

    fs.writeFileSync(path, '');
    const output = fs.createWriteStream(path);
    try {
        const stream = buffer.pipe(output);
        await new Promise<void>((resolve, reject) => {
            stream.on('finish', () => {
                resolve();
            }).on('error', (e) => {
                reject(e);
            });
        });
    } catch {

    } finally {
        output!.close();
    }

    return NextResponse.json({
        message: 'success'
    });
}