import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <section className="wrapper">
        <div className="top">EasyTex</div>
        <div className="bottom" aria-hidden="true">EasyTex</div>
      </section>
      <h3 className="typewriter">Text to LaTeX conversion</h3>
      <div className="container">
        <div id="div1">
          <h5>Enter Your Input</h5><br></br>
          <textarea name='textInput' placeholder='Enter text to convert...' rows={17} cols={40}></textarea>
          <button>Generate LaTeX</button>
        </div>
        <div id="div2">
          <h5>LaTeX</h5>
        </div>
        <div id="div3">
          <h5>PDF Preview</h5>
        </div>
      </div>
    </main>
  )
}
