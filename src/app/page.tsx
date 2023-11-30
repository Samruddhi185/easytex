'use client';
import { Card, CardBody, CardHeader, Input } from '@nextui-org/react';
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
  const [showInput, setShowInput] = useState<boolean>(true);

  const components = [
    {name: "chat", component: <Chat chatHistory={chatHistory} setCodeString={setCodeString} setProgressVisibility={setProgressVisibility} showInput={showInput} setShowInput={setShowInput} onChatInput={async(data:string) => {
      setChatHistory([...chatHistory, data]);
      setProgressVisibility(true);
      {}
      const newData = await generateLatexUsingAssistantsAPI(data, codeString);
      console.log("New data: " + newData);
      if (newData != codeString) {
        setShowInput(false);
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

export const generateLatex = async (userInput:string, prev: string): Promise<string> => {
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

export const generateLatexUsingAssistantsAPI = async (userInput:string, prev: string): Promise<string> => {
  console.log("calling openai assistant api");
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Data visualizer",
      description: "You are a latex code generator, directed by the user's prompts. You must use the previously generatted latex code and perform modifications. Make sure to import any packages when you use a command. Return only the latex code, and remove the backticks.",
      model: "gpt-4-1106-preview",
      tools: [{"type": "code_interpreter"}],
    });

    const myThread = await openai.beta.threads.create();

    const myThreadMessage = await openai.beta.threads.messages.create(
      (myThread.id),
      {
        role: "user",
        content: userInput,
      }
    );
    console.log("This is the message object: ", myThreadMessage, "\n");

    const myRun = await openai.beta.threads.runs.create(
      (myThread.id),
      {
        assistant_id: assistant.id,
        instructions: "Please return the latex code.",
      }
    );
    console.log("This is the run object: ", myRun, "\n");

    // Step 5: Periodically retrieve the Run to check on its status to see if it has moved to completed
    const retrieveRun = async () => {
      let keepRetrievingRun;

      while (myRun.status !== "completed") {
        keepRetrievingRun = await openai.beta.threads.runs.retrieve(
          (myThread.id),
          (myRun.id)
        );

        console.log(`Run status: ${keepRetrievingRun.status}`);

        if (keepRetrievingRun.status === "completed") {
          console.log("\n");
          break;
        }
      }
    };
    retrieveRun();

    const waitForAssistantMessage = async () : Promise<string> => {
      await retrieveRun();
  
      const allMessages = await openai.beta.threads.messages.list(
        (myThread.id)
      );
  
      console.log(
        "------------------------------------------------------------ \n"
      );
  
      console.log("User: ", myThreadMessage.content[0].text.value);
      console.log("Assistant: ", allMessages.data[0].content[0].text.value);
      let content = allMessages.data[0].content[0].text.value;
      if (content.substring(0, 3) == '```') {
        content = content.substring(3, content.length-3);
      }
      content = content.substring(content.indexOf("\\documentclass"), content.indexOf("\\end{document}") + "\\end{document}".length);
      return content;
    };
    waitForAssistantMessage();
    return prev;
  } catch(e) {
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
          { "role": 'system', "content": "You are a latex code generator, directed to extract text from the image and convert it to latex code. Return only the latex code within begin{document} and end{document} latex tags." },
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
        if (content.substring(0, 3) == '```') {
          content = content.substring(3, content.length-3);
        }
        content = content.substring(content.indexOf("\\documentclass"), content.indexOf("\\end{document}") + "\\end{document}".length);
        return content;
      }
    
    // console.log(openai.apiKey);
    // const { data: chatCompletion, response: raw } = await openai.chat.completions.create({
    //   messages: [
    //     { role: 'system', content: "You are a latex code generator, directed to convert the image to latex code. You must process the image and return the content as latex code. Make sure to import any packages when you use a command. Return only the latex code." },
    //     { role: 'user', content: [
    //       {
    //           type: "image_url", 
    //           image_url: 
    //           {
    //             "url": imageContent
    //           }
    //         }
    //       ]
    //     },
    //   ],
    //   model: 'gpt-4-vision-preview',
    // }).withResponse();
    // if (chatCompletion.choices[0].message.content) {
    //   let content = chatCompletion.choices[0].message.content;
    //   console.log("Vision API content: " + content);
    //   if (content.substring(0, 3) == '```') {
    //     content = content.substring(3, content.length-3);
    //   }
    //   content = content.substring(content.indexOf("\\documentclass"), content.indexOf("\\end{document}") + "\\end{document}".length);
    //   return content;
    // }
    return "";
  }
  catch (e) {
    return "";
  }
}