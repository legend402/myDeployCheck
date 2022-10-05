/* eslint-disable no-console */
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import c from 'picocolors'
import { printLogs, serveAndCheck } from '.'

const __dirname = resolve(fileURLToPath(import.meta.url), '../../')
const staticPath = resolve(__dirname, 'playground/dist')

const logList = await serveAndCheck({
  servePath: staticPath,
})

if (logList.length) {
  printLogs(logList)
  process.exit(1)
}
else {
  console.log(c.inverse(c.bold(c.red('  my deploy check plugin  '))) + c.green('   no error find!!!'))
  process.exit(0)
}
