/**
 * Reapply the publish-branch package rename after merging `main`.
 *
 * Usage: node scripts/rename-pkg-imports.mjs [directory]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(process.argv[2] || '.')
const scriptPath = fileURLToPath(import.meta.url)
const extensions = new Set([
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
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', 'coverage'])

function walk(directory, files = []) {
  for (const name of fs.readdirSync(directory)) {
    if (ignoredDirectories.has(name)) continue
    const file = path.join(directory, name)
    const stats = fs.statSync(file)
    if (stats.isDirectory()) walk(file, files)
    else if (extensions.has(path.extname(name)) && file !== scriptPath) {
      files.push(file)
    }
  }
  return files
}

function renamePackage(content) {
  return content
    .replaceAll('unplugin-vue-router', '__UNPLUGIN_VUE_ROUTER__')
    .replaceAll('vue-router-mock', '__VUE_ROUTER_MOCK__')
    .replaceAll('vue-router', 'vue-smart-router')
    .replaceAll('__VUE_ROUTER_MOCK__', 'vue-router-mock')
    .replaceAll('__UNPLUGIN_VUE_ROUTER__', 'unplugin-vue-router')
}

for (const file of walk(root)) {
  const content = fs.readFileSync(file, 'utf8')
  const renamed = renamePackage(content)
  if (renamed !== content) {
    fs.writeFileSync(file, renamed, 'utf8')
    console.log('updated', path.relative(root, file))
  }
}
