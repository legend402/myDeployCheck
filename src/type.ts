type WaitUtils = 'domcontentloaded' | 'load' | 'networkidle' | 'commit'

export interface Option {
  servePath: string
  port?: number
  waitUntil?: WaitUtils
}
interface ErrorLog {
  type: 'error'
  error: Error
  timestamp: number
}
interface ConsoleLog {
  type: 'console'
  argument: unknown[]
  timestamp: number
}
export type LogType = ErrorLog | ConsoleLog
