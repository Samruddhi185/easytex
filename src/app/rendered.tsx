import { Card } from '@nextui-org/react';
import React from 'react';

export default function RenderedTexContainer({code}:{code:string;}) {
    console.log("got new props", code);
    React.useEffect(() => {
        console.log("use effect was called", code);
        const htmlData = `<latex-js id="latex-code" baseURL="https://cdn.jsdelivr.net/npm/latex.js/dist/">
            ${code}
        </latex-js> '`;
        document.getElementById("latex-code")!.innerHTML = htmlData;
    });
    return (<div className='h-full'>
        <Card id="latex-code" className="w-full h-full overflow-y-auto p-1"></Card>
    </div>);   
}
