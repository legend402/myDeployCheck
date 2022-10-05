/* eslint-disable no-console */
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import c from 'picocolors'
import { deployCheck } from '.'

const __dirname = resolve(fileURLToPath(import.meta.url), '../../')
const staticPath = resolve(__dirname, 'playground/dist')

const logList = await deployCheck({
  servePath: staticPath,
})

if (logList.length) {
  console.log(c.inverse(c.bold(c.red('  my deploy check plugin  '))) + c.red(`   ${logList.length} errors find`))
  logList.forEach((log) => {
    if (log.type === 'error')
      console.error(log.error)
    else
      console.error(...log.arugment)
  })
  process.exit(1)
}
else {
  console.log(c.inverse(c.bold(c.red('  my deploy check plugin  '))) + c.green('   no error find!!!'))
  process.exit(0)
}
