import { resolve } from 'path'
import type { Plugin, ResolvedConfig } from 'vite'
import type { Option } from '.'
import { printLogs, serveAndCheck } from '.'

export default function ViteDeployCheck(option?: Partial<Option>): Plugin {
  let config: ResolvedConfig
  return {
    name: 'vite-plugin-deploy-check',
    apply: 'build',
    // 在最后执行
    enforce: 'post',
    configResolved(_config) {
      config = _config
    },
    buildEnd: {
      // 在最后执行
      order: 'post',
      // buildEnd是并行执行，但是加上sequential之后会在最后一个执行
      sequential: true,
      handler() {
        async function deployCheck() {
          const logs = await serveAndCheck({
            servePath: resolve(config.root, config.build.outDir),
            ...option,
          })

          printLogs(logs)

          if (logs.length)
            process.exit(1)
          else
            process.exit(0)
        }

        setTimeout(() => {
          deployCheck().catch((e) => {
            console.error(e)
            process.exit(1)
          })
        }, 300)
      },
    },
  }
}
