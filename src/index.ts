/* eslint-disable no-console */
import { chromium } from 'playwright'
import sirv from 'sirv'
import polka from 'polka'

export interface Option {
  servePath: string
  port?: number
}

interface ErrorLog {
  type: 'error'
  error: Error
}

interface ConsoleLog {
  type: 'console'
  arugment: unknown[]
}

type LogType = ErrorLog | ConsoleLog

export async function deployCheck(options: Option) {
  const { port = 8099, servePath } = options
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

  page.on('console', (message) => {
    if (message.type() === 'error') {
      logList.push({
        type: 'console',
        arugment: message.args(),
      })
    }
  })
  page.on('pageerror', (message) => {
    logList.push({
      type: 'error',
      error: message,
    })
  })

  await page.goto(URL)

  Promise.all([
    page.close(),
    broswer.close(),
  ])

  return logList
}

