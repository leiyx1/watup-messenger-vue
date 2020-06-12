import path from "path";
import { remote } from "electron";
import store from "../store/index"

let db;
let Datastore = require("nedb");

export default function getNedb() {
  if(db){
    return db;
  }else {
    let id = store.state.user.id
    db = new Datastore({
      filename: path.join(remote.app.getAppPath(), id, "db/device.db"),
      autoload: true,
    });
    db.localMessage = new Datastore({
      filename: path.join(remote.app.getAppPath(), id, "db/localMessage.db"),
      autoload: true,
    });
    db.userInfo = new Datastore({
      filename: path.join(remote.app.getAppPath(), id, "db/localMessage.db"),
      autoload: true,
    });
    db.systemInfo = new Datastore({
      filename: path.join(remote.app.getAppPath(), id, "db/localMessage.db"),
      autoload: true,
    });

    db.loadDatabase();
    db.systemInfo.loadDatabase();
    db.userInfo.loadDatabase();
    db.localMessage.loadDatabase();
    return db
  }
}

