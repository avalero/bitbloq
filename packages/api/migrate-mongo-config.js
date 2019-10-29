// In this file you can configure migrate-mongo
require("dotenv").config();

const index = (process.env.MONGO_URL).lastIndexOf('/');
const urlMong = (process.env.MONGO_URL).slice(0, index);
const nameMong = (process.env.MONGO_URL).slice(index+1, process.env.MONGO_URL.length );

const config = {
  mongodb: {
    // TODO Change (or review) the url to your MongoDB:
    url: urlMong,
    // TODO Change this to your database name:
    databaseName: nameMong,


    // url: process.env.MONGO_URL_MIGRATIONS,
    // databaseName: process.env.MONGO_DB_NAME,


    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    }
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: "migrations",

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: "changelog"
};

//Return the config as a promise
module.exports = config;
