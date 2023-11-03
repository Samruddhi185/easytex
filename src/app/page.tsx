'use client';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
// @ts-ignore
import { parse, HtmlGenerator, LaTeXJSComponent } from 'latex.js';
import React, { useState } from 'react';
import Chat from './chat';
import Code from './code';
import RenderedTexContainer from './rendered';
import openai from '@/utils/openai';

export default function Home() {
  const [codeString, setCodeString] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  const components = [
    {name: "chat", component: <Chat chatHistory={chatHistory} onChatInput={async(data:string) => {
      setChatHistory([...chatHistory, data]);
      const newData = await generateLatex(data, codeString);
      if (newData != codeString) {
        setCodeString(newData);
      }
    }} ></Chat>, title: "Chat with EasyTex"},
    { name: "code", component: <Code code={codeString}></Code>, title: "TeX code" },
    { name: "render", component: <RenderedTexContainer code={codeString}/>, title: "Rendered LaTeX"}
  ];
  React.useEffect(() => {
    window.customElements.get('latex-js') || window.customElements.define("latex-js", LaTeXJSComponent);
  });

  return (
    <main>
      <div className="flex h-screen">
      <div className="m-auto h-full w-full px-3 py-8 grid grid-cols-3 gap-4 ">
        {
          components.map((componentMetadata) => {
            return (
              <Card className="py-4 px-2 h-full" shadow="sm" key={componentMetadata.name}>
                <CardHeader>
                  <h4>{componentMetadata.title}</h4>
                </CardHeader>
                <CardBody className="h-full">
                  {componentMetadata.component}
                </CardBody>
              </Card>
            );
          })
        }
      </div>
      </div>
    </main>
  )
}

const generateLatex = async (userInput:string, prev: string): Promise<string> => {
  openai.apiKey = process.env.OPEN_AI_KEY || '';
  console.log("calling open ai");
  try {
    const { data: chatCompletion, response: raw } = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: "You are responsible for understanding a user's prompts for generating a latex document. You must return the entire document after modifications. Don't add any sentences before or after the latex code." },
        { role: 'user', content: `The latex document you're working on is backticks below: 
          \`\`\`${prev}\`\`\`
          
          The users's prompt is in the backticks below:

          \`\`\`${userInput}\`\`\`
          ` }
      ],
      model: 'gpt-3.5-turbo',
    }).withResponse();
    if (chatCompletion.choices[0].message.content) {
      return chatCompletion.choices[0].message.content;
    }
    return prev;
  } catch(e) {
    return prev;
  }
}
