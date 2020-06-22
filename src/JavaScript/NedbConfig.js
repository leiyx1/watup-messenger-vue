import path from "path";
import { remote } from "electron";
import store from "../store/index";

let db;
let lastid;
let Datastore = require("nedb");

export default function(){
  if (db && store.state.id === lastid) {
    return db;
  } else {
    return getNedb();
  }
}

function getNedb() {
  let id = store.state.user.id;
  lastid = id;
  db = new Datastore({
    filename: path.join(remote.app.getAppPath(), id, "db/device.db"),
    autoload: true,
  });
  db.localMessage = new Datastore({
    filename: path.join(remote.app.getAppPath(), id, "db/localMessage.db"),
    autoload: true,
  });
  db.userInfo = new Datastore({
    filename: path.join(remote.app.getAppPath(), id, "db/userInfo.db"),
    autoload: true,
  });
  db.systemInfo = new Datastore({
    filename: path.join(remote.app.getAppPath(), "db/systemInfo.db"),
    autoload: true,
  });

  db.loadDatabase();
  db.systemInfo.loadDatabase();
  db.userInfo.loadDatabase();
  db.localMessage.loadDatabase();
  return db;

}
