import { PresentationFile, FileBlob } from 'file:///C:/Users/karti/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
const file='C:/Users/karti/Documents/Codex/2026-10-31/project-serverless-ai-chatbot-with-llm/outputs/serverless-ai-chatbot-project-walkthrough.pptx';
const p=await PresentationFile.importPptx(await FileBlob.load(file));
const result=await p.inspect({kind:'slide,textbox,shape,notes',search:'LINKEDIN',maxChars:6000});
console.log(result.ndjson);
const s=p.slides.items[9]; console.log('NOTES',s.speakerNotes.text);
