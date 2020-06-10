import path from 'path'
import {remote} from 'electron'

var Datastore = require('nedb'),
    db = new Datastore({
        filename: path.join(remote.app.getAppPath(),'db/device.db'),
        autoload: true
    });
db.localMessage = new Datastore({
    filename:path.join(remote.app.getAppPath(),'db/localMessage.db'),
    autoload: true
})
db.userInfo = new Datastore({
    filename:path.join(remote.app.getAppPath(),'db/localMessage.db'),
    autoload: true
})

db.loadDatabase()
db.userInfo.loadDatabase()
db.localMessage.loadDatabase()
export default db
