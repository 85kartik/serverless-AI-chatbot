from zipfile import ZipFile
from xml.etree import ElementTree as ET
ppt='work/ppt-build/serverless-ai-chatbot-updated-draft.pptx'; ns={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships','rel':'http://schemas.openxmlformats.org/package/2006/relationships'}
with ZipFile(ppt) as z:
 slide=ET.fromstring(z.read('ppt/slides/slide10.xml')); rels=ET.fromstring(z.read('ppt/slides/_rels/slide10.xml.rels')); targets={e.attrib['Id']:e.attrib.get('Target') for e in rels.findall('rel:Relationship',ns)}
 for sp in slide.findall('.//a:sp',ns):
  texts=[t.text or '' for t in sp.findall('.//a:t',ns)]; links=[]
  for h in sp.findall('.//a:hlinkClick',ns): links.append(targets.get(h.attrib.get('{'+ns['r']+'}id')))
  if texts or links: print(repr(''.join(texts)),repr(links))
