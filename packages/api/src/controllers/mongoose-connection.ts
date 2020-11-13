import {
  connect as mongooseConnect,
  connection as mongooseConnection,
  set as mongooseSet
} from "mongoose";
import { up as migrateUp } from "migrate-mongo";
import log from "../log";

const connectWithRetry = (mongoUrl: string) => {
  return mongooseConnect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
    .then(() => log.info("Successfully connected to Mongo"))
    .catch(e => {
      log.error("error with mongo", e);
      setTimeout(connectWithRetry, 5000);
    });
};

export const startMongoConnection = async (mongoUrl: string) => {
  // mongooseSet("debug", true);
  mongooseSet("useFindAndModify", false);
  await connectWithRetry(mongoUrl);
  try {
    const db = await mongooseConnection;
    const migrated = await migrateUp(db);
    migrated.length > 0
      ? migrated.forEach(fileName => log.info("Migrated:", fileName))
      : log.info("Nothing to migrate");
  } catch (e) {
    log.error("Error executing migration");
    // if migration fails we must propagate error, because ready file is not created and pod will not work
    // if the server should work even if migration fails we should create ready file elsewhere
    throw e;
  }
};
