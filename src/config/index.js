import dev from './dev.js'
import prod from './prod.js'

const env = process.env.NODE_ENV || 'development'
const configs = {
  development: dev,
  production: prod
}
const config = configs[env]
const GITHUB_OAUTH = config.GITHUB_OAUTH
const WEIBO_OAUTH = config.WEIBO_OAUTH
export { GITHUB_OAUTH, WEIBO_OAUTH }
