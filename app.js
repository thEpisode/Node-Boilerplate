/**
 * Main start
 *
 * To read documentation go to https://github.com/thepisode/beat/wiki
 */

const server = require('./src/core/server')({ root: __dirname })

const main = async () => {
  const dependencies = await server.start()

  // Launching server
  dependencies.console.info(`http://localhost:${dependencies.config.SERVER_PORT}`, 'Server')
  dependencies.console.info(`${dependencies.config.SERVER_NAME} v${dependencies.config.SERVER_VERSION}`, 'Server')
  dependencies.console.log(' ------------------------------------')
}

main()
