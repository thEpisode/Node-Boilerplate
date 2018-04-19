function FrontEnd (dependencies) {
  const maintenance = require(`${dependencies.root}/src/routes/frontend/maintenance/maintenance.route`)(dependencies)
  const router = require(`${dependencies.root}/src/routes/definition/router`)

  /// Dependencies
  const _console = dependencies.console
  const _app = dependencies.httpServer
  const _express = dependencies.express
  const _path = dependencies.path

  const constructor = () => {
    buildFrontendViews()
  }

  const buildFrontendViews = () => {
    /// Setup engine for Express
    _app.set('views', `${dependencies.root}/src/views`)
    _app.set('view engine', 'jsx')
    _app.engine('jsx', require('express-react-views').createEngine())

    // build each frontend routes
    router.frontend.map((component) => {
      let componentView = require(`${dependencies.root}/src/routes/frontend${component.view}`)(dependencies)

      _app.get(component.route, componentView[component.action])
    })

    // publish all files under public folder
    _app.use(_express.static(_path.join(dependencies.root, '/public')))
    _app.use('/jquery', _express.static(_path.join(dependencies.root, '/node_modules/jquery/dist/')));
    _app.use('/bootstrap', _express.static(_path.join(dependencies.root, '/node_modules/bootstrap/dist/')));

    // Something else, 404 error
    _app.get('*', maintenance.index)

    _console.success('FrontEnd module initialized')
  }

  return {
    start: constructor
  }
}

module.exports = FrontEnd