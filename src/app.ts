/// <reference path="../typings/index.d.ts" />
require('dotenv').config()

import * as restify from 'restify';
import * as Joi from 'joi';
import * as validator from 'restify-joi-middleware';
import * as corsMiddleware from 'restify-cors-middleware';
import * as Middleware from './middleware';
import AuthDB from './db/auth';
import StatsDB from './db/stats';

// Routes
import StatsController from './controllers/submit';

const app = restify.createServer()
const statsDB = new StatsDB()
const authDB = new AuthDB()
// const authentication = new Middleware.authenticate(authDB)
var jobQueueActive = false

const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['*']
})

app.pre(cors.preflight)
app.use(cors.actual)
app.use(restify.bodyParser())
app.use(validator())
app.use(Middleware.authenticate(authDB))

// Setup route controllers
new StatsController(app, statsDB)

// app.get({
//   path: '/:id',
//   validation: {
//     params: {
//       id: Joi.number().min(1).required()
//     }
//   }
// }, (req, res, next) => { res.send(200, { id: req.params.id }); })

// Start listening for inc traffic
app.listen(parseInt(process.env.APP_PORT), () => {
  console.log('%s listening at %s', app.name, app.url)
})

// Start Job Queue processor
setInterval(() => {
  // Only start queueProcessor if NOT active already
  if (jobQueueActive === false) {
    jobQueueActive = true
    statsDB.processQueueItems()
      .then(total => {
        if (total !== 0) { console.log(`JobQueue->Queue Processor Exited! Length: ${total}`) }
        jobQueueActive = false
      })
  }
  else {
    console.log('JobQueue->Processor Already Active..')
  }
}, parseInt(process.env.JOBQUEUE_INTERVAL))