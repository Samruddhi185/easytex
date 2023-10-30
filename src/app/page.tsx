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

  const textInp = document.getElementById("textInput");
  var latexresp = document.getElementById('latexResponse');
  (async () => {
      const gptResponse = await openai.complete({
          engine: 'gpt-3.5-turbo',
          prompt: textInp?.innerHTML,
          maxTokens: 5,
          temperature: 0.9,
          topP: 1,
          presencePenalty: 0,
          frequencyPenalty: 0,
          bestOf: 1,
          n: 1,
          stream: false,
          stop: ['\n', "testing"]
      });

      latexresp!.innerHTML = gptResponse.data;
  })();
}