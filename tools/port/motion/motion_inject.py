import re, glob, sys
S='/tmp/claude-0/-home-claude/a420e82f-4408-5c02-b6e3-4d52b59a6978/scratchpad/'
CSS=open(S+'motion/motion.css').read().strip()+'\n/* /motion */\n'
ENG=open(S+'motion/engine.js').read().strip()
MJS="  moVals() {\n    return { moRoot: (el) => {\n      if (!el || el === this._moEl || typeof window === 'undefined') return;\n      if (this._moStop) this._moStop();\n      this._moEl = el;\n      this._moStop = (function () {\n" + '\n'.join('        '+l for l in ENG.split('\n')) + "\n        return moStart;\n      })()(el);\n    } };\n  }\n"
def inject(t, name):
    t=re.sub(r'\n/\* motion \(shared.*?/\* /motion \*/\n','\n',t,flags=re.S)
    t=re.sub(r'  moVals\(\) \{\n.*?\n  \}\n(?=  )','',t,flags=re.S)
    t=t.replace(', this.moVals())',')')
    t=t.replace('</style>','\n'+CSS+'</style>',1)
    i=t.index('</helmet>')+9; m=re.compile(r'\s*<div').match(t,i); assert m, name
    j=m.end()
    if not t[j:j+40].startswith(' ref="{{ moRoot }}"'): t=t[:j]+' ref="{{ moRoot }}"'+t[j:]
    r=re.search(r'  renderVals\(\) \{ return Object\.assign\(this\._rv\(\)(.*?)\); \}\n',t); assert r, name
    t=t[:r.start()]+'  renderVals() { return Object.assign(this._rv()'+r.group(1)+', this.moVals()); }\n'+MJS+t[r.end():]
    return t
for f in sorted(glob.glob(S+'site/project/*.dc.html')):
    n=f.split('/')[-1]
    if n in ('System.dc.html','Menu.dc.html'): continue
    t=inject(open(f).read(), n); open(f,'w').write(t)
    k=t.index('class Component'); js=t[k:t.index('</script>',k)].replace('extends DCLogic','')
    open(S+'chk.js','w').write(js)
    import subprocess; r=subprocess.run(['node','--check',S+'chk.js'],capture_output=True,text=True)
    print(n, 'ok' if r.returncode==0 else r.stderr[:300])
