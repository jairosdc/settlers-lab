import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
function walk(dir){ for(const e of readdirSync(dir)){ const p=join(dir,e); if(statSync(p).isDirectory()) walk(p); else if(p.endsWith('.js')){ let s=readFileSync(p,'utf8'); s=s.replace(/from "(\.\.?\/[^".][^"]*)"/g,'from "$1.js"').replace(/from '(\.\.?\/[^'.][^']*)'/g,"from '$1.js'"); writeFileSync(p,s) } } }
walk('dist-test')
