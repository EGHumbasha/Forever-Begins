function e(e,t){let n=new Blob([t],{type:`text/plain;charset=utf-8`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e.endsWith(`.txt`)?e:`${e}.txt`,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(r)}function t(e,t){let n=window.open(``,`_blank`,`width=800,height=900`);if(!n){alert(`Please allow pop-ups to print or save this document as a PDF.`);return}let r=String(t).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);n.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${e}</title>
        <meta charset="utf-8" />
        <style>
          @media print {
            @page { margin: 2cm; }
          }
          body {
            font-family: Georgia, 'Times New Roman', serif;
            line-height: 1.7;
            color: #1c1b18;
            max-width: 680px;
            margin: 3rem auto;
            padding: 0 1.5rem;
            white-space: pre-wrap;
          }
          h1 {
            font-size: 1.4rem;
            margin-bottom: 2rem;
            text-align: center;
            letter-spacing: 0.02em;
          }
        </style>
      </head>
      <body>
        <h1>${e}</h1>
        ${r}
      </body>
    </html>
  `),n.document.close(),n.focus(),setTimeout(()=>n.print(),300)}export{t as n,e as t};