/**
 * One-off bulk replace: vue-router -> vue-x-router in source (not unplugin-vue-router).
 * Run: node scripts/rename-pkg-imports.mjs <dir>
 */
import fs from 'node:fs'
import path from 'node:path'

const root = process.argv[2] || 'packages/router'
const exts = new Set([
  '.ts',
  '.mts',
  '.cts',
  '.vue',
  '.mjs',
  '.cjs',
  '.js',
  '.json',
  '.md',
  '.html',
])

const TOKEN = '__UNPLUGIN_VUE_ROUTER__'

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist') continue
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (exts.has(path.extname(name))) out.push(p)
  }
  return out
}

function transform(content) {
  let s = content
  s = s.split('unplugin-vue-router').join(TOKEN)
  // long specifiers first
  const pairs = [
    ['vue-router/experimental', 'vue-x-router/experimental'],
    ['vue-router/auto-routes', 'vue-x-router/auto-routes'],
    ['vue-router/auto-resolver', 'vue-x-router/auto-resolver'],
    ['vue-router/auto/route-block', 'vue-x-router/auto/route-block'],
    ['vue-router/vite', 'vue-x-router/vite'],
    ['vue-router/unplugin', 'vue-x-router/unplugin'],
    ['vue-router/volar', 'vue-x-router/volar'],
  ]
  for (const [a, b] of pairs) s = s.split(a).join(b)
  s = s.split('vue-router-mock').join('__VUE_ROUTER_MOCK__')
  s = s.split('vue-router').join('vue-x-router')
  s = s.split('__VUE_ROUTER_MOCK__').join('vue-router-mock')
  s = s.split(TOKEN).join('unplugin-vue-router')
  return s
}

const abs = path.resolve(root)
for (const file of walk(abs)) {
  const raw = fs.readFileSync(file, 'utf8')
  const next = transform(raw)
  if (next !== raw) {
    fs.writeFileSync(file, next, 'utf8')
    console.log('updated', path.relative(abs, file))
  }
}
