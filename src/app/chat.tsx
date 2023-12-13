import { Card, CardBody, Textarea, Input, image, CardHeader, Button } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { generateLatexFromImage } from "./page";

export default function ChatContainer({ chatHistory, onChatInput, setCodeString, setProgressVisibility, showInput, setShowInput, renderLatex }: { chatHistory: string[], onChatInput: any, setCodeString: any, setProgressVisibility: any, showInput: boolean, setShowInput: any, renderLatex: any }) {
    const [chatData, setChatData] = useState('');
    const [inputFileBase64, setinputFileBase64] = useState<any>(null);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        //@ts-ignore
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [chatHistory]);

    return (
        <Card className="py-4 px-2 h-full" shadow="sm">
            <CardHeader>
                <h4>Chat with EasyTex</h4>
                <Button onClick={() => window.location.reload()} isIconOnly color="warning" variant="faded" className="ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </Button>
            </CardHeader>
            <CardBody className="h-full">
                <div className="h-full flex flex-col">
                    <Card className="w-full h-[88%] max-h-[88%] mb-2 overflow-y-auto px-4 shrink">
                        <CardBody>
                            <div className="chat chat-start" >
                                {
                                    chatHistory.map((data, key) => {
                                        return (<div key={key} className="chat-bubble my-2">{data}</div>)
                                    })
                                }
                                <div ref={messagesEndRef} />
                            </div>

                        </CardBody>
                    </Card>

                    <Textarea
                        className="grow"
                        fullWidth
                        minRows={3}
                        maxRows={10}
                        onChange={(e) => {
                            setChatData(e.target.value);
                        }}
                        onKeyDown={(key) => {
                            if (key.key === 'Enter' && !key.shiftKey) {
                                if (chatData.length > 0) {
                                    onChatInput(chatData);
                                }
                                setChatData(String.raw``);
                            }
                        }}
                        value={chatData}
                    />
                    {showInput && <center><Input type="file" className="fileInput" onChange={async (e) => {
                        const target = e.target as HTMLInputElement;
                        if (!target.files) return;
                        const imageFile = target.files[0];

                        if (imageFile) {
                            const reader = new FileReader();
                            setProgressVisibility(true);

                            reader.onloadend = async (event) => {
                                const imageAsBase64 = event.target?.result;
                                setinputFileBase64(imageAsBase64);
                                console.log("Base64 Encoded Image:", imageAsBase64);
                                if (imageAsBase64) {
                                    let newData = await generateLatexFromImage(imageAsBase64?.toString());
                                    if (newData === "API failed to generate...") {
                                        newData = await generateLatexFromImage(imageAsBase64?.toString());
                                    }
                                    console.log("Returned data from vision api: " + newData);
                                    setShowInput(false);
                                    await renderLatex(newData);
                                    setCodeString(newData);
                                    setProgressVisibility(false);
                                }
                            };

                            reader.readAsDataURL(imageFile);
                        }


                    }}></Input></center>}
                </div>
            </CardBody>
        </Card>
    );
}
