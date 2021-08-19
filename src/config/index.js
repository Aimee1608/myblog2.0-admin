import dev from './dev.js'
import prod from './prod.js'
// console.log('dev', dev)
const configs = {
  dev,
  prod
}
const env = process.env.NODE_ENV == 'development' ? 'dev' : 'prod'
console.log('process.env.NODE_ENV', process.env.NODE_ENV, env, configs[env], dev)
const config = {
  ...configs[env]
}
// console.log('config', config)
export default config
