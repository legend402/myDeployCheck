/* eslint-disable no-console */
import { chromium } from 'playwright'
import sirv from 'sirv'
import polka from 'polka'
import c from 'picocolors'

type WaitUntils = 'domcontentloaded' | 'load' | 'networkidle' | 'commit'

export interface Option {
  servePath: string
  port?: number
  waitUntil?: WaitUntils
}

interface ErrorLog {
  type: 'error'
  error: Error
  timestamp: number
}

interface ConsoleLog {
  type: 'console'
  arugment: unknown[]
  timestamp: number
}

type LogType = ErrorLog | ConsoleLog

export async function deployCheck(options: Option) {
  const { port = 8099, servePath, waitUntil = 'networkidle' } = options
  const URL = `http://localhost:${port}`

  polka()
    .use(sirv(servePath))
    .listen(port, (err: any) => {
      if (err)
        throw err
    })

  const broswer = await chromium.launch()
  const page = await broswer.newPage()

  const logList: LogType[] = []

  page.on('console', async (message) => {
    if (message.type() === 'error') {
      logList.push({
        type: 'console',
        timestamp: Date.now(),
        arugment: await Promise.all(message.args().map(i => i.jsonValue())),
      })
    }
  })
  page.on('pageerror', (message) => {
    logList.push({
      type: 'error',
      timestamp: Date.now(),
      error: message,
    })
  })

  await page.goto(URL, { waitUntil })

  Promise.all([
    page.close(),
    broswer.close(),
  ])

  return logList
}

export const printLogs = (logList: LogType[]) => {
  console.error()
  console.log(c.inverse(c.bold(c.red('  my deploy check plugin  '))) + c.red(`   ${logList.length} errors find`))
  console.error()

  logList.forEach((log, idx) => {
    console.log(c.red(`--------- ${new Date(log.timestamp).toLocaleTimeString()} Error ${idx + 1}----------`))
    if (log.type === 'error')
      console.error(log.error)
    else
      console.error(...log.arugment)
  })
}
