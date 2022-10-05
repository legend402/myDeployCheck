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
export type LogType = ErrorLog | ConsoleLog
