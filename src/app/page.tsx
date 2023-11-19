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
  const [showProgress, setProgressVisibility] = useState<boolean>(false);

  const components = [
    {name: "chat", component: <Chat chatHistory={chatHistory} onChatInput={async(data:string) => {
      setChatHistory([...chatHistory, data]);
      setProgressVisibility(true);
      {}
      const newData = await generateLatex(data, codeString);
      if (newData != codeString) {
        setCodeString(newData);
        setProgressVisibility(false);
      }
    }} ></Chat>, title: "Chat with EasyTex"},
    { name: "code", component: <Code code={codeString} showProgress={showProgress}></Code>, title: "TeX code" },
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
  console.log("calling open ai");
  try {
    const { data: chatCompletion, response: raw } = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: "You are a latex code generator, directed by the user's prompts. You must return the entire document after modifications. Make sure to import any packages when you use a command. Return only the latex code, and remove the backticks." },
        { role: 'user', content: `The latex document you're working on is backticks below: 
          \`\`\`${prev}\`\`\`
          
          The users's prompt is in the backticks below:

          \`\`\`${userInput}\`\`\`
          ` }
      ],
      model: 'gpt-4-1106-preview',
    }).withResponse();
    if (chatCompletion.choices[0].message.content) {
      let content = chatCompletion.choices[0].message.content;
      if (content.substring(0, 3) == '```') {
        content = content.substring(3, content.length-3);
      }
      content = content.substring(content.indexOf("\\documentclass"), content.indexOf("\\end{document}") + "\\end{document}".length);
      return content;
    }
    return prev;
  } catch(e) {
    return prev;
  }
}
