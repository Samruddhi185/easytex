import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <h1 className="title">EasyTex</h1>
      <h3 className="subtitle">Text to LaTeX conversion</h3>
      <div className="container">
        <div id="div1">
          <p>Enter Your Input</p><br></br>
          <textarea name='textInput' placeholder='Enter text to convert...' rows={17} cols={40}></textarea>
          <button>Generate LaTeX</button>
        </div>
        <div id="div2">
          <p>LaTeX</p>
        </div>
        <div id="div3">
          <p>PDF Preview</p>
        </div>
      </div>
    </main>
  )
}
