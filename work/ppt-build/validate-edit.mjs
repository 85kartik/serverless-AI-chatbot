import { PresentationFile, FileBlob } from 'file:///C:/Users/karti/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
const p=await PresentationFile.importPptx(await FileBlob.load('C:/Users/karti/Documents/Codex/2026-10-31/project-serverless-ai-chatbot-with-llm/work/ppt-build/serverless-ai-chatbot-updated-draft.pptx'));
console.log(JSON.stringify({slideCount:p.slides.items.length,slide10Notes:p.slides.items[9].speakerNotes.text.includes('https://www.linkedin.com/in/karteek-parab-293508371/')}));
