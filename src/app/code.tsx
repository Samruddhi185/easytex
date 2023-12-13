import { Card, CardBody, CardHeader, Progress } from '@nextui-org/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeProps {
    code: string,
    showProgress: boolean,
}

export default function CodeContainer({ code, showProgress }: CodeProps) {
    console.log("rendering", code);
    return (
        <Card className="py-4 px-2 h-full" shadow="sm" >
            <CardHeader>
                <h4>LaTeX code</h4>
            </CardHeader>
            <CardBody className="h-full">
                <div className='h-full'>
                    <Card className="w-full h-full overflow-y-auto p-1">
                        {showProgress && <center><Progress size="sm" isIndeterminate aria-label="Loading..." className="max-w-md" /></center>}
                        {code.length > 0 ? <SyntaxHighlighter children={code} language="latex" style={atomDark} /> : null}
                    </Card>
                </div>
            </CardBody>
        </Card>
    );
}