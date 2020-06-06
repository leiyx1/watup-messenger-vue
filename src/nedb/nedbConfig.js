import path from 'path'
import {remote} from 'electron'

var Datastore = require('nedb'),
db = new Datastore({
    filename: path.join(remote.app.getAppPath(),'db/device.db')
});
db.localMessage = new Datastore({
    filename:path.join(remote.app.getAppPath(),'db/localMessage.db')
})
db.loadDatabase()
db.localMessage.loadDatabase()
export default db
