import path from 'node:path';
import { pathToFileURL } from 'node:url';
const base='C:/Users/karti/Documents/Codex/2026-10-31/project-serverless-ai-chatbot-with-llm';
const skill='C:/Users/karti/.codex/plugins/cache/openai-primary-runtime/presentations/26.1026.10807/skills/presentations';
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const finalPath=path.join(base,'outputs/serverless-ai-chatbot-project-walkthrough.pptx');
const result=await finalizePresentation({
 workspaceDir:base,
 candidatePath:path.join(base,'work/ppt-build/serverless-ai-chatbot-draft.pptx'),
 finalPath,
 pythonExecutable:'C:/Users/karti/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',
 integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),
 layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],
 explicitTotalSlideCount:10,
 requiredNativeTableOwnerSlides:[],
 requiredNativeChartOwnerSlides:[],
 fontPolicy:{basis:'design',families:['Arial']},
 verifyArtifactToolImport:true,
 receiptPath:path.join(base,'work/ppt-build/serverless-ai-chatbot-validation.json'),
});
console.log(JSON.stringify(result));
