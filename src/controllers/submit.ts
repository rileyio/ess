import * as restify from 'restify';
import * as hasha from 'hasha';
import Controller from '../controller';
import StatsDB from '../db/stats';
import Stats from '../types/Stats';

export default class StatsController extends Controller {
  private DB: StatsDB

  constructor(server: restify.Server, database: StatsDB) {
    super(server)
    this.DB = database
    // this.server.post('/submit', this.postSubmit)
    this.server.post({ path: '/submit', validation: Stats.params }, (req, res, next) => this.postSubmit(req, res, next))
  }

  private async postSubmit(req: restify.Request, res: restify.Response, next: restify.Next) {
    // Check if in db
    console.log('StatsController->looking up:', req.body.uuid)
    let stat = await this.DB.getStat({ uuid: req.body.uuid })
    let sum = hasha(JSON.stringify(req.body), { algorithm: 'md5' })
    // If stat does not exist for given uuid submit
    if (stat.length === 0) {
      console.log('StatsController->Adding new stat for:', req.body.uuid)
      await this.DB.setStats({ appid: null, stats: req.body, checksum: sum })
    }
    /**
     *  When uuid already exists check diff & update if isDiff === true
     */
    else {
      if (stat[0].checksum !== sum) {
        console.info(`StatsController->Checksums don't match, queued for updating db data, id=${stat[0].id}`)
        await this.DB.addJob({
          statid: stat[0].id,
          raw: req.body
        })
        // Update stat sum to prevent duplicate job entries submissions
        await this.DB.updateStatHash(sum, stat[0].id)
      }

      // Update checkins counter
      console.log(`StatsController->Updating checkins for id=${stat[0].id}`)
      await this.DB.incrementCheckIns(stat[0].id)
    }

    // Response
    res.setHeader('content-type', 'application/text');
    res.send(200, 'ok');
    next()
  }
}