import { Card, CardBody, Textarea, Input, image } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { generateLatexFromImage } from "./page";

export default function ChatContainer( {chatHistory, onChatInput, setCodeString, setProgressVisibility}:{chatHistory:string[], onChatInput:any, setCodeString:any, setProgressVisibility:any}) {
    const [chatData, setChatData] = useState('');
    const [inputFileBase64, setinputFileBase64] = useState<any>(null);
    const [showInput, setShowInput] = useState<boolean>(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        //@ts-ignore
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [chatHistory]);
    
    return (<div className="h-full flex flex-col">
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
                if (key.key === 'Enter' && !key.shiftKey){
                    if (chatData.length > 0) {
                        onChatInput(chatData);
                    }
                    setChatData(String.raw``);
                }
            }}
            value={chatData}
        />
        {showInput && <center><Input type="file" className="fileInput" onChange={async (e) => {
            const target= e.target as HTMLInputElement;
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
                        console.log("Returned data from vision api: " + newData);
                        setShowInput(false);
                        setCodeString(newData);
                        setProgressVisibility(false);
                    }
                };

                reader.readAsDataURL(imageFile);
            }

            
        }}></Input></center>}
    </div>);
}
