'use client';
// @ts-ignore
import { parse, HtmlGenerator, LaTeXJSComponent } from 'latex.js';
import React, { useState } from 'react';
import Chat from './chat';
import Code from './code';
// import RenderedTexContainer from './rendered';
import openai from '@/utils/openai';
import dynamic from "next/dynamic";

const RenderedTexContainer = dynamic(() => import("./rendered"), { ssr: false });

export default function Home() {
  const [codeString, setCodeString] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [showProgress, setProgressVisibility] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(true);
  
  React.useEffect(() => {
    window.customElements.get('latex-js') || window.customElements.define("latex-js", LaTeXJSComponent);
  });

  return (
    <main>
      <div className="flex h-screen">
        <div className="m-auto h-full w-full px-3 py-8 grid grid-cols-3 gap-4 ">
          <Chat chatHistory={chatHistory}
            setCodeString={setCodeString}
            setProgressVisibility={setProgressVisibility}
            showInput={showInput}
            setShowInput={setShowInput}
            onChatInput={async (data: string) => {
              setChatHistory([...chatHistory, data]);
              setProgressVisibility(true);
              // let newData = await callAssistant(data);
              let newData = await generateLatex(data, codeString);
              if (newData != codeString) {
                setShowInput(false);
                // const renderError = checkForRenderErrors(codeString);
                // if (renderError !== null && renderError != undefined && renderError.message !== null && renderError.message !== undefined) {
                //   console.log("render error was", renderError);
                //   newData = await callAssistant(`There's a bug in the code with this error, make sure to remove any unnecessary packages or add missing characters - \"${renderError.message}\"`);
                // }
                setCodeString(newData);
                setProgressVisibility(false);
              }
            }} ></Chat>
          <Code code={codeString} showProgress={showProgress}></Code>
          <RenderedTexContainer code={codeString}/>
        </div>
      </div>
    </main>
  )
}

const checkForRenderErrors = (code: string): (any|null) => {
  let generator = new HtmlGenerator({ hyphenate: false });
  try {
    let doc = parse(code, { generator: generator }).htmlDocument();
    console.log("Doc is ", doc, doc.documentElement.outerHTML, doc.innerHTML, doc.outerHTML);
    return null;
  } catch (error: any) {
    console.log("failed to render tex", error.message);
    return error;
  }
}

const callAssistant = async(input: string): Promise<string> => {
  const response = await fetch('/api/gpt', {
    method: 'POST',
    body: JSON.stringify({
      userInput: input,
    })
  });

  if (response.status == 200) {
    const message = await response.json();
    return message.message;
  } else {
    return "";
  }
}

export const generateLatex = async (userInput: string, prev: string): Promise<string> => {
  console.log("calling open ai");
  try {
    const { data: chatCompletion, response: raw } = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: "You are a latex code generator, directed by the user's prompts. You must return the entire document after modifications. Make sure to import any packages when you use a command. Return only the latex code, and remove the backticks." },
        {
          role: 'user', content: `The latex document you're working on is backticks below: 
          \`\`\`${prev}\`\`\`
          
          The users's prompt is in the backticks below:

          \`\`\`${userInput}\`\`\`
          ` }
      ],
      model: 'gpt-4-1106-preview',
    }).withResponse();
    if (chatCompletion.choices[0].message.content) {
      let content = chatCompletion.choices[0].message.content;
      
      const regex = /\\documentclass[\s\S]*?\\end{document}/;
      const match = content.match(regex);

      // If there is a match, return the matched LaTeX code
      if (match) {
        return match[0];
      }
    }
    return prev;
  } catch (e) {
    return prev;
  }
}

export const generateLatexFromImage = async (imageAsBase64: string): Promise<string> => {
  try {
    // const imageContent = `data:image/png;base64,${imageAsBase64}`;
    console.log("Image Content: " + imageAsBase64);

    const axios = require('axios');

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        "model": "gpt-4-vision-preview",
        "messages": [
          { "role": 'system', "content": "You are a latex code generator, directed to extract text from the image and convert it to latex code. Return the entire document and only the latex code within \\documentclass and end{document} latex tags." },
          {
            "role": "user",
            "content": [
              {
                "type": "image_url",
                "image_url": {
                  "url": imageAsBase64
                }
              }
            ]
          }
        ],
        "max_tokens": 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_KEY}`,
        },
      }
    );

    console.log(response.data);
    if (response.data.choices[0].message.content) {
        let content = response.data.choices[0].message.content;
         console.log("Vision API content: " + content);
        const regex = /\\documentclass[\s\S]*?\\end{document}/;
        const match = content.match(regex);

        // If there is a match, return the matched LaTeX code
        if (match) {
          return match[0];
        }
      }
    
    return "";
  }
  catch (e) {
    return "";
  }
}