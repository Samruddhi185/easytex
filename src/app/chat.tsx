import { Card, CardBody, Textarea } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";

export default function ChatContainer( {chatHistory, onChatInput}:{chatHistory:string[], onChatInput:any}) {
    const [chatData, setChatData] = useState('');
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
    </div>);
}
