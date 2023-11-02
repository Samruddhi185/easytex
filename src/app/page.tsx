'use client';
import Head from 'next/head'
import Image from 'next/image'
import openai from "@/utils/openai";
import React, { MouseEvent } from 'react';
import type { NextApiRequest, NextApiResponse } from "next";

export default function Home() {
  return (
    <main>
      <section className="wrapper">
        <div className="top">EasyTex</div>
        <div className="bottom" aria-hidden="true">EasyTex</div>
      </section>
      <div className="scroll-content" id="page-2">
        <h3 className="typewriter">Text to LaTeX conversion</h3>
        <div className="container">
          <div id="div1">
            <h5>Enter Your Input</h5><br></br>
            <textarea id='textInput' placeholder='Enter text to convert...' rows={22} cols={40}></textarea>
          </div>
          <div id="div2">
            <h5>LaTeX</h5>
            <textarea id='latexResponse' placeholder='Generate LaTeX first...' rows={22} cols={40}></textarea>
          </div>
          <div id="div3">
            <h5>PDF Preview</h5>
          </div>
        </div>
        <div className="container">
          <button onClick={generateLaTexBtnClick}>Generate LaTeX</button>
          <button>Generate PDF Preview</button>
          <button>Download</button>
        </div>
      </div>
    </main>
  )
}

const generateLaTexBtnClick = (e: React.MouseEvent<HTMLElement>) => {
  console.log("API Key:", process.env.NEXT_PUBLIC_OPENAI_API_KEY);

  const textInp = document.getElementById("textInput") as HTMLInputElement | null;
  var latexresp = document.getElementById('latexResponse');
  (async () => {
      const userInput = textInp?.value || '';
      const { data: chatCompletion, response: raw } = await openai.chat.completions.create({
          messages: [
            {role: 'system', content: "You are a helpful assistant."},
            {role: 'user', content: userInput}
          
          ],
          model: 'gpt-3.5-turbo',
          
      }).withResponse();
      // console.log("resp ", chatCompletion.choices[0].message.content)
      if(chatCompletion.choices[0].message.content) {
        latexresp!.innerHTML = chatCompletion.choices[0].message.content;
      }
  })();
}