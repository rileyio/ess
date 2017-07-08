import * as restify from 'restify';
import * as hasha from 'hasha';
import Controller from '../controller';
import ApplicationDB from '../db/application';
import StatsDB from '../db/stats';
import Stats from '../types/Stats';

export default class StatsController extends Controller {
  private DB: { Application: ApplicationDB, Stats: StatsDB }

  constructor(server: restify.Server, database: { Application: ApplicationDB, Stats: StatsDB }) {
    super(server)
    this.DB = database

    this.server.post({
      path: '/submit', validation: Stats.params
    }, (req, res, next) => this.postSubmit(req, res, next))
  }

  private async postSubmit(req: restify.Request, res: restify.Response, next: restify.Next) {
    let applicationId = req.header('ESS-App')
    let clientId = req.header('ESS-Client-ID')
    // Check if in db
    console.log('StatsController->looking up:', clientId, applicationId)
    let application = await this.DB.Application.get(applicationId)
    let stat = await this.DB.Stats.getStat({ uuid: clientId, appid: application[0].appid })
    let sum = hasha(JSON.stringify(req.body), { algorithm: 'md5' })
    // If stat does not exist for given uuid submit
    if (stat.length === 0) {
      console.log('StatsController->Adding new stat for:', clientId)
      await this.DB.Stats.setStats({
        uuid: clientId,
        appid: application[0].appid,
        stats: req.body,
        checksum: sum
      })
    }
    /**
     *  When uuid already exists check diff & update if isDiff === true
     */
    else {
      if (stat[0].checksum !== sum) {
        console.info(`StatsController->Checksums don't match, queued for updating db data, id=${stat[0].id}`)
        await this.DB.Stats.addJob({
          statid: stat[0].id,
          raw: req.body,
          params: { appid: application[0].appid }
        })
        // Update stat sum to prevent duplicate job entries submissions
        await this.DB.Stats.updateStatHash(sum, stat[0].id)
      }

      // Update checkins counter
      console.log(`StatsController->Updating checkins for id=${stat[0].id}`)
      await this.DB.Stats.incrementCheckIns(stat[0].id)
    }

    // Response
    res.setHeader('content-type', 'application/text');
    res.send(200, 'ok');
    next()
  }
}