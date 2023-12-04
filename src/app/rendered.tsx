import { Card, CardBody, CardHeader, Button } from '@nextui-org/react';
import React from 'react';
import { jsPDF } from "jspdf";
import html2canvas  from "html2canvas";

// @ts-ignore
import { parse, HtmlGenerator, LaTeXJSComponent } from 'latex.js';

export default function RenderedTexContainer({ code }: { code: string; }) {
    React.useEffect(() => {
        const htmlData = `<latex-js id="latex-content" baseURL="https://cdn.jsdelivr.net/npm/latex.js/dist/">
            ${code}
        </latex-js> '`;
        document.getElementById("latex-code")!.innerHTML = htmlData;
    });

    return (
        <Card className="py-4 px-2 h-full" shadow="sm" >
            <CardHeader>
                <h4>TeX code</h4>
                <Button onClick={() => download(code)} isIconOnly color="warning" variant="faded" className="ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </Button>
            </CardHeader>
            <CardBody className="h-full">
                <div className='h-full'>
                    <Card id="latex-code" className="w-full h-full overflow-y-auto p-1"></Card>
                </div>
            </CardBody>
        </Card>
    );
}


const download = async(code: string): Promise<void> => {
    await fetch('/api/pdf', {
        method: 'POST',
        body: JSON.stringify({input : code})
    });
}

const downloadOld = async (code: string): Promise<void> => {
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'in',
        format: 'letter',
        putOnlyUsedFonts: true,
        compress: true
    });

    const content = document.getElementById("latex-content")!.shadowRoot?.querySelector('.page');
    console.log("innerhtml", document.getElementById("latex-content")!.shadowRoot?.querySelector('.page'));
    let generator = new HtmlGenerator({ hyphenate: false });
    let doc = parse(code, { generator: generator }).htmlDocument();
    console.log("Content", content);
    console.log("doc", doc);
    const canvas = await html2canvas(content! as HTMLElement, {
        backgroundColor: '#000000',
    });

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const canvasData = canvas.toDataURL("image/png", 1.0);
    console.log("canvas", canvasHeight, canvasWidth, canvasData);
    // await pdf.html(content!);
    pdf.addImage(canvasData, "PNG", 0, 0, canvasWidth, canvasHeight, "", "FAST");
    console.log("done asdsdadasdd");
    pdf.save();
}
