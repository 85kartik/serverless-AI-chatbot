from zipfile import ZipFile
from xml.etree import ElementTree as ET
ppt='work/ppt-build/serverless-ai-chatbot-updated-draft.pptx'; ns={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships','rel':'http://schemas.openxmlformats.org/package/2006/relationships'}
with ZipFile(ppt) as z:
 slide=ET.fromstring(z.read('ppt/slides/slide10.xml')); rels=ET.fromstring(z.read('ppt/slides/_rels/slide10.xml.rels')); targets={e.attrib['Id']:e.attrib.get('Target') for e in rels.findall('rel:Relationship',ns)}
 texts=[''.join((t.text or '') for t in sp.findall('.//a:t',ns)) for sp in slide.findall('.//p:sp',ns)]
 links=[]
 for sp in slide.findall('.//p:sp',ns):
  for h in sp.findall('.//a:hlinkClick',ns): links.append((''.join((t.text or '') for t in sp.findall('.//a:t',ns)),targets.get(h.attrib.get('{'+ns['r']+'}id'))))
 expected='https://www.linkedin.com/in/karteek-parab-293508371/'
 assert any(expected == url for _,url in links),links
 assert any('LINKEDIN PROFILE' in t for t in texts),texts
 print('Verified profile text and hyperlink:',[(text,url) for text,url in links if url==expected])
