require("dotenv").config();

const index = process.env.MONGO_URL.lastIndexOf("/");
const urlMong = process.env.MONGO_URL.slice(0, index);
const nameMong = process.env.MONGO_URL.slice(
  index + 1,
  process.env.MONGO_URL.length
);

const config = {
  mongodb: {
    url: urlMong,
    databaseName: nameMong,
    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true // removes a deprecating warning when connecting
    }
  },
  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: "migrations",
  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: "changelog"
};

module.exports = config;
