import fs from 'node:fs/promises';
import path from 'node:path';
import { Presentation, PresentationFile } from 'file:///C:/Users/karti/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';

const base = 'C:/Users/karti/Documents/Codex/2026-10-31/project-serverless-ai-chatbot-with-llm';
const build = path.join(base, 'work/ppt-build');
const out = path.join(base, 'outputs');
await fs.mkdir(build, {recursive:true}); await fs.mkdir(out,{recursive:true});
const ppt = Presentation.create({slideSize:{width:1280,height:720}});
const C={navy:'#101D2B',deep:'#172A3A',ink:'#1C2C3A',muted:'#5F7180',paper:'#F5F7F6',white:'#FFFFFF',green:'#4F8068',mint:'#D9EAE1',lime:'#B8DDC7',blue:'#5C94B5',line:'#D8E2DE',soft:'#EAF0ED',gold:'#D4A65A'};
const FONT='Arial';
function shape(slide,geometry,x,y,w,h,fill,opts={}){return slide.shapes.add({geometry,name:opts.name,position:{left:x,top:y,width:w,height:h},fill,line:{style:'solid',fill:opts.stroke||'none',width:opts.sw||0},borderRadius:opts.radius});}
function txt(slide,text,x,y,w,h,size,color=C.ink,bold=false,opts={}){const s=shape(slide,'textbox',x,y,w,h,'none');s.text=text;s.text.style={fontSize:size,color,bold,typeface:FONT,alignment:opts.align||'left',verticalAlignment:opts.valign||'middle',wrap:'word',autoFit:'shrinkText',insets:0};return s;}
function block(slide,x,y,w,h,fill=C.white,stroke=C.line){return shape(slide,'roundRect',x,y,w,h,fill,{stroke,sw:1.2,radius:18});}
function title(slide,kicker,head,sub){txt(slide,kicker.toUpperCase(),74,40,600,23,14,C.green,true);txt(slide,head,74,75,1120,58,39,C.navy,true);if(sub)txt(slide,sub,76,137,1100,44,21,C.muted,false);}
function footer(slide,n){shape(slide,'rect',74,674,1132,1,C.line);txt(slide,'SERVERLESS AI CHATBOT  •  PROJECT WALKTHROUGH',74,682,720,18,12,C.muted,true);txt(slide,String(n).padStart(2,'0'),1158,680,45,22,13,C.green,true,{align:'right'});}
function addNotes(slide,text){slide.speakerNotes.text=text;}
function bullet(slide,head,body,x,y,w,color=C.green){shape(slide,'ellipse',x,y+5,11,11,color);txt(slide,head,x+25,y,w-25,27,20,C.ink,true);txt(slide,body,x+25,y+30,w-30,48,17,C.muted,false);}
function baseSlide(kicker,head,sub){const s=ppt.slides.add();s.background.fill=C.paper;title(s,kicker,head,sub);return s;}
// 1. Cover
{
 const s=ppt.slides.add();s.background.fill=C.navy;
 shape(s,'rect',0,0,18,720,C.green);shape(s,'ellipse',875,95,380,380,'#1C3445');shape(s,'ellipse',940,160,250,250,'#24485A');shape(s,'ellipse',1010,230,110,110,C.green);
 txt(s,'FULL-STACK PROJECT  /  2026',78,78,500,26,15,C.lime,true);
 txt(s,'Serverless AI\nChatbot',78,150,715,180,67,C.white,true);
 txt(s,'From React interface to live, AI-powered serverless app',82,365,690,55,25,'#C5D3DB',false);
 shape(s,'rect',82,468,118,5,C.green);txt(s,'BUILD  •  CONNECT  •  DEPLOY',82,493,460,30,17,C.lime,true);
 txt(s,'React + Vite   /   Express MVC   /   OpenAI-compatible API   /   Vercel',82,630,1000,26,16,'#C5D3DB',false);
 addNotes(s,'Project presentation for the Serverless AI Chatbot. The live app root URL is inferred from the user-supplied health endpoint; the health endpoint is listed separately on the final slide.');
}
// 2. Overview
{
 const s=baseSlide('01  /  Project overview','A complete chat experience, from browser to model','The project pairs a responsive React client with a Node.js API that runs as Vercel serverless functions.');
 const items=[['01','React + Vite','Fast single-page interface','CLIENT'],['02','Express MVC','Small, modular API layer','SERVER'],['03','OpenAI SDK','Chat completions via server config','AI SERVICE'],['04','Vercel','Static frontend + API functions','DEPLOYMENT']];
 items.forEach((d,i)=>{let x=74+i*286;block(s,x,235,258,220);txt(s,d[0],x+20,256,50,27,17,C.green,true);txt(s,d[1],x+20,302,220,42,25,C.navy,true);txt(s,d[2],x+20,352,215,50,17,C.muted);shape(s,'rect',x+20,419,48,4,C.green);txt(s,d[3],x+20,430,200,17,12,C.green,true);});
 txt(s,'Outcome',76,516,120,30,19,C.navy,true);txt(s,'A public chatbot with conversation controls, protected server-side AI credentials, and a deployable API.',194,512,965,52,21,C.ink);
 footer(s,2);addNotes(s,'Project implementation details summarized from the repository: https://github.com/85kartik/serverless-AI-chatbot');
}
// 3. Architecture diagram
{
 const s=baseSlide('02  /  System architecture','One request travels through four clear layers','The browser sends chat history to the app API; the AI provider response returns through the same path.');
 const ys=290,bw=230,bh=132,gap=45,xs=[74,350,626,902];
 const boxes=[['BROWSER','React chat UI','Input • history • bubbles'],['VERCEL','Static site + functions','/api/chat • /api/health'],['EXPRESS MVC','Route → controller','Validation • error handling'],['AI PROVIDER','OpenAI SDK client','Model response']];
 boxes.forEach((a,i)=>{block(s,xs[i],ys,bw,bh,i===3?'#E4EFE9':C.white);txt(s,a[0],xs[i]+17,ys+16,bw-34,20,13,C.green,true);txt(s,a[1],xs[i]+17,ys+48,bw-34,30,22,C.navy,true);txt(s,a[2],xs[i]+17,ys+86,bw-34,23,15,C.muted);});
 for(let i=0;i<3;i++){shape(s,'rect',xs[i]+bw+7,ys+61,gap-12,3,C.green);shape(s,'chevron',xs[i]+bw+gap-17,ys+53,18,18,C.green);}
 txt(s,'POST /api/chat',75,468,250,26,16,C.green,true);txt(s,'Messages + conversation context',75,496,300,24,16,C.muted);
 txt(s,'JSON reply',902,468,220,26,16,C.green,true);txt(s,'Assistant message',902,496,250,24,16,C.muted);
 shape(s,'rect',76,568,1128,1,C.line);txt(s,'The provider key stays on the server; it is never bundled into the React app.',76,588,1100,38,20,C.navy,true);
 footer(s,3);addNotes(s,'Architecture reflects the project entry points and server code. Vercel function configuration and routing are defined in the root vercel.json. See https://vercel.com/docs/project-configuration/vercel-json');
}
// 4. MVC structure
{
 const s=baseSlide('03  /  Project structure','MVC keeps each responsibility in its place','The repository separates the chat interface, request handling, and AI-provider work.');
 const cols=[{x:74,w:342,label:'MODEL / SERVICE',name:'server/services',desc:'Calls the AI provider with a reusable system prompt and selected model.',files:['aiService.js','config/openai.js','utils/promptTemplate.js']},{x:469,w:342,label:'CONTROLLER / ROUTES',name:'server/controllers',desc:'Validates the request, checks message history, and returns an HTTP response.',files:['chatController.js','routes/chatRoutes.js','middleware/errorMiddleware.js']},{x:864,w:342,label:'VIEW',name:'client/src',desc:'Renders chat, navigation, loading, error states, and conversation controls.',files:['App.jsx','components/','services/chatService.js']}];
 cols.forEach(c=>{block(s,c.x,230,c.w,350);txt(s,c.label,c.x+22,251,c.w-44,22,13,C.green,true);txt(s,c.name,c.x+22,288,c.w-44,35,22,C.navy,true);txt(s,c.desc,c.x+22,335,c.w-44,78,17,C.muted,false,{valign:'top'});shape(s,'rect',c.x+22,426,c.w-44,1,C.line);c.files.forEach((f,i)=>txt(s,'›  '+f,c.x+22,443+i*30,c.w-44,26,16,C.ink));});
 footer(s,4);addNotes(s,'Files are based on the repository structure. This is a lightweight MVC-style separation: the React app is the view, the Express controller and routes handle requests, and the AI service/config layer acts as the model integration.');
}
// 5 UX
{
 const s=baseSlide('04  /  User experience','Designed around everyday conversation','A ChatGPT-inspired interface includes useful controls for starting, revisiting, and clearing chats.');
 block(s,74,219,610,393,C.navy,C.navy);shape(s,'roundRect',96,241,185,346,'#1B3040',{radius:15});txt(s,'CHAT HISTORY',115,259,150,20,12,C.lime,true);shape(s,'roundRect',111,296,152,42,C.green,{radius:12});txt(s,'＋  New chat',126,304,130,28,16,C.white,true);txt(s,'Today',115,360,120,18,12,'#9FB0BB',true);['How does serverless work?','Help me debug an API','Explain MVC simply'].forEach((v,i)=>txt(s,v,117,391+i*40,150,30,13,'#DFE7EB',false));
 shape(s,'roundRect',303,241,360,346,'#F7F9F8',{radius:15});txt(s,'AI CHAT',327,258,150,20,12,C.green,true);shape(s,'roundRect',327,297,260,62,'#E6EEEA',{radius:14});txt(s,'Hi! What are you building?',344,310,228,36,15,C.ink);shape(s,'roundRect',390,378,242,56,C.green,{radius:14});txt(s,'A serverless AI chatbot.',406,388,212,34,15,C.white,true);shape(s,'roundRect',327,456,260,66,'#E6EEEA',{radius:14});txt(s,'I can help you design it step by step.',344,465,228,46,14,C.ink);shape(s,'roundRect',327,540,307,32,C.white,{stroke:C.line,sw:1,radius:10});txt(s,'Message your assistant…',340,544,230,22,13,C.muted);
 bullet(s,'Conversation sidebar','Browse saved chats and open the panel again after collapsing it.',728,238,466);bullet(s,'New and clear chat','Start fresh or remove a conversation with clear controls.',728,337,466);bullet(s,'Responsive layout','Use the chat on desktop or a narrow mobile screen.',728,436,466);bullet(s,'Feedback states','Loading indicator, recoverable errors, and automatic scroll.',728,535,466);
 footer(s,5);addNotes(s,'The conversation mockup is a conceptual depiction of implemented chat UI elements and is not a screenshot of the live app.');
}
// 6 Lifecycle
{
 const s=baseSlide('05  /  Request lifecycle','From typed message to assistant reply','Each request is validated and assembled on the server before the provider is called.');
 const steps=[['01','Compose','Client rejects blank input and sends current conversation history.'],['02','Validate','Controller checks roles, message lengths, and history limits.'],['03','Prompt','AI service adds the reusable system instruction.'],['04','Generate','Official OpenAI SDK requests a chat completion.'],['05','Return','API sends assistant text; UI appends it and scrolls to latest.']];
 steps.forEach((a,i)=>{let x=75+i*230;shape(s,'ellipse',x+10,260,58,58,i===4?C.green:C.navy);txt(s,a[0],x+10,270,58,36,18,C.white,true,{align:'center'});if(i<4){shape(s,'rect',x+73,288,146,2,C.line);shape(s,'chevron',x+211,281,15,15,C.green);}txt(s,a[1],x,341,210,31,22,C.navy,true);txt(s,a[2],x,384,204,110,17,C.muted,false,{valign:'top'});});
 block(s,75,531,1130,74,'#E8F1EC','#D2E1D9');txt(s,'API contract',98,549,150,25,15,C.green,true);txt(s,'POST /api/chat   →   { message, history }   →   { reply: "..." }',265,543,900,40,21,C.navy,true);
 footer(s,6);addNotes(s,'Request flow described from the frontend chat service, Express chat controller, and server/services/aiService.js implementation.');
}
// 7 Reliability security
{
 const s=baseSlide('06  /  Security & reliability','Protect credentials and make failures understandable','Practical guardrails cover browser input, API access, and provider failures.');
 const left=[['Server-only secret','The provider API key is read from server environment variables.'],['Request limits','Payload size and conversation history are bounded; rate limiting is configured.'],['Restricted browser access','CORS and security headers help control who can call the API.']];
 const right=[['Useful HTTP errors','Invalid JSON, oversized messages, provider quota, and connection errors map to clear responses.'],['Safe diagnostics','Server logs capture error metadata without printing prompts or secrets.'],['Recoverable UI','Chat data remains in browser storage, with retry and clear-chat paths.']];
 left.forEach((a,i)=>bullet(s,a[0],a[1],78,228+i*123,520));right.forEach((a,i)=>bullet(s,a[0],a[1],665,228+i*123,520,C.blue));
 shape(s,'rect',638,226,1,383,C.line);
 txt(s,'Deployment note',78,603,160,20,14,C.green,true);txt(s,'Set OPENAI_API_KEY in Vercel project settings; never place it in client code.',241,595,934,37,18,C.navy,true);
 footer(s,7);addNotes(s,'Security controls are described based on project code. Rate limiting uses process memory, which can reset between serverless invocations; a shared persistent limiter would be needed for stronger production enforcement. Do not add real API credentials to source control.');
}
// 8 Deployment
{
 const s=baseSlide('07  /  Deployment','GitHub to Vercel, with the API in the same project','The root configuration builds the Vite client and routes serverless endpoints from the root api directory.');
 const xs=[82,363,644,925],y=278,w=225,h=142;
 const ar=[['01  PUSH','GitHub main','Source of truth'],['02  BUILD','Vercel build','npm run build'],['03  PUBLISH','client/dist','Static React assets'],['04  SERVE','/api/*','Serverless functions']];
 ar.forEach((a,i)=>{block(s,xs[i],y,w,h,i===3?'#E3EFE8':C.white);txt(s,a[0],xs[i]+18,y+18,w-36,20,13,C.green,true);txt(s,a[1],xs[i]+18,y+56,w-36,32,22,C.navy,true);txt(s,a[2],xs[i]+18,y+101,w-36,25,16,C.muted);if(i<3){shape(s,'rect',xs[i]+w+5,y+69,47,2,C.green);shape(s,'chevron',xs[i]+w+40,y+62,16,16,C.green);}});
 txt(s,'Deployment detail',84,479,260,27,18,C.navy,true);txt(s,'Vercel functions must live in the root /api directory to match the configured function patterns.',84,514,700,57,19,C.muted);
 block(s,841,472,365,110,C.navy,C.navy);txt(s,'VERCEL PROJECT SETTINGS',863,488,315,20,12,C.lime,true);txt(s,'OPENAI_API_KEY',863,519,315,30,24,C.white,true);txt(s,'Environment variable • server only',863,553,315,18,14,'#C8D6DE');
 footer(s,8);addNotes(s,'Deployment sequence corresponds to the root vercel.json: buildCommand npm run build, outputDirectory client/dist, function patterns api/chat.js and api/health.js, with SPA fallback rewrite. Vercel configuration docs: https://vercel.com/docs/project-configuration/vercel-json. GitHub repo: https://github.com/85kartik/serverless-AI-chatbot');
}
// 9 Lessons & next improvements
{
 const s=baseSlide('08  /  What we learned','Ship a working baseline, then strengthen it','The project demonstrates an end-to-end AI feature and leaves a clear path for production improvements.');
 txt(s,'DELIVERED',79,228,300,25,14,C.green,true);txt(s,'NEXT ITERATIONS',671,228,400,25,14,C.blue,true);shape(s,'rect',628,222,1,380,C.line);
 const l=[['Full chat path','React UI → Express controller → AI provider'],['Serverless deployment','Static frontend and API functions on one Vercel project'],['Useful interactions','History, new chat, clear, loading, errors, mobile layout']];
 const r=[['Persistent rate limiting','Use shared storage such as Redis across function instances'],['Accounts & sync','Add authentication and durable conversation storage'],['Streaming responses','Return tokens incrementally for faster perceived response']];
 l.forEach((a,i)=>bullet(s,a[0],a[1],82,275+i*100,500));r.forEach((a,i)=>bullet(s,a[0],a[1],671,275+i*100,510,C.blue));
 block(s,80,591,1118,46,'#E9F0ED','#E9F0ED');txt(s,'The deployment is a strong assignment-ready foundation; future changes can improve scale and personalization.',99,599,1080,29,17,C.ink,true);
 footer(s,9);addNotes(s,'Current-state and future-work summary. The existing rate limiter uses in-memory state and therefore should be replaced with shared storage if strict global limits are needed across serverless instances.');
}
// 10 Resources
{
 const s=ppt.slides.add();s.background.fill=C.navy;shape(s,'rect',0,0,18,720,C.green);
 txt(s,'09  /  PROJECT LINKS',78,58,520,24,14,C.lime,true);txt(s,'Explore the project',78,98,1000,56,43,C.white,true);txt(s,'Source, live app, health endpoint, and LinkedIn sharing link',80,160,970,33,20,'#C5D3DB');
 const links=[['GITHUB REPOSITORY','github.com/85kartik/serverless-AI-chatbot','https://github.com/85kartik/serverless-AI-chatbot'],['LIVE CHAT APP','serverless-ai-chatbot-coral.vercel.app','https://serverless-ai-chatbot-coral.vercel.app/'],['API HEALTH CHECK','…/api/health','https://serverless-ai-chatbot-coral.vercel.app/api/health'],['SHARE ON LINKEDIN','Share the live app','https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fserverless-ai-chatbot-coral.vercel.app%2F']];
 links.forEach((a,i)=>{let y=235+i*88;shape(s,'rect',80,y+6,3,59,C.green);txt(s,a[0],102,y,310,20,13,C.lime,true);const t=txt(s,a[1],102,y+25,770,31,22,C.white,true);t.text.set([{runs:[{run:a[1],style:{bold:true,fontSize:'22px',typeface:FONT,color:C.white,underline:'sng'},link:{uri:a[2],isExternal:true}}]}]);txt(s,'↗',900,y+25,40,31,22,C.lime,true);});
 txt(s,'The health check returns service status. Open the root URL for the chat interface.',81,610,1060,28,17,'#C5D3DB');txt(s,'THANK YOU',81,660,300,20,12,C.lime,true);
 addNotes(s,'Links: repository https://github.com/85kartik/serverless-AI-chatbot. Live application root is inferred from the supplied health URL https://serverless-ai-chatbot-coral.vercel.app/api/health. Health endpoint: https://serverless-ai-chatbot-coral.vercel.app/api/health. LinkedIn share flow: https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fserverless-ai-chatbot-coral.vercel.app%2F.');
}

const draft=path.join(build,'serverless-ai-chatbot-draft.pptx');
for(let i=0;i<ppt.slides.items.length;i++){
 const sl=ppt.slides.items[i]; const blob=await ppt.export({slide:sl,format:'png',scale:1});
 await fs.writeFile(path.join(build,`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await blob.arrayBuffer()));
}
await (await PresentationFile.exportPptx(ppt)).save(draft);
console.log(JSON.stringify({draft,slides:ppt.slides.items.length}));


