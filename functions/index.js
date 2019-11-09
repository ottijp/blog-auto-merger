const functions = require('firebase-functions')
const App = require('./app')
const ApiClient = require('./api-client')
const rcloadenv = require('@google-cloud/rcloadenv');

module.exports.postReesrvedArticle = functions.pubsub.schedule('every 10 minutes').onRun(async context => {
  // load environment variables from Runtime Config
  const githubEnv = await rcloadenv.getAndApply('github', {})

  const apiClient = new ApiClient(githubEnv.OWNER, githubEnv.REPO, githubEnv.TOKEN)
  const app = new App(apiClient)
  await app.mergeReservedPosts()
})

