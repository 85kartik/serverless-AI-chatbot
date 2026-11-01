from pathlib import Path
s=Path('client/src/index.css').read_text(encoding='utf-8')
for token in ['.app-shell{','.main-panel{','.chat-main{','.conversation{','.message-list{','.composer-wrap{','.composer{','.composer textarea{','.composer-actions{','.clear-button{','.error-toast{','.mobile-scrim{']:
 i=s.find(token)
 print('\n###',token)
 print(s[i:i+500].replace('}','}\n'))
