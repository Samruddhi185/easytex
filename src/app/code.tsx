import { Card } from '@nextui-org/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeContainer({code}:{code:string;}) {
    console.log("rendering", code);
    return (<div className = 'h-full'>
        <Card className="w-full h-full overflow-y-auto p-1">
            {code.length > 0? <SyntaxHighlighter children={code} language="latex" style={atomDark} />:null}
        </Card>
    </div>);
}