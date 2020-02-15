/**
 * Simple Node JS App. 
 */
import express from "express";
import storage from "node-persist";
import cors from "cors";
import cron from "./modules/weather-cron";
import * as mCache from "./core/memory-cache";
import * as sql from "mssql";
import * as redis from "redis";

const client = redis.createClient(6379, 'redis_cache');
client.on('connect', function() {
  console.log('Redis client connected');
});


// SQL SERVER CONNECTION
const SQLServerConfig = {
  user: 'sa',
  password: 'SuperP4ssw0rd!',
  server: 'mssql',  // localhost, use container name if using docker.
  database: 'Northwind' 
};


const app = express();
const serverPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 4100;

app.use(cors({
    allowedHeaders: ["X-Requested-With", "Content-Type"],
    origin: "*"
  }));

// Default Route.
app.get('/', (req, res) => {
  
  // connect to your database
sql.connect(SQLServerConfig, (err) => {
  if (err) console.log(err);
  // create Request object
  var request = new sql.Request();
  // query to the database and get the records
  request.query('SELECT LastName,FirstName FROM Employees', function (err, recordset) {
      if (err) console.log(err)
      // send records as a response
      console.log(recordset);
      res.send(recordset);
  });
});

  

});

// Catch unmatched routes
app.all('*', (req, res) => {
  res.json({ status: 404, message: 'Page not found.' });
});

let storageInit = async () => {
  await storage.init({
    dir: 'public/db',
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
    logging: false,  // can also be custom logging function
    ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS or a valid Javascript Date object
    expiredInterval: 60 * 60 * 1000, // every 60 minutes the process will clean-up the expired cache
    // in some cases, you (or some other service) might add non-valid storage files to your
    // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
    forgiveParseErrors: false
  });
  await storage.setItem("didarul", 'There is no cache found !!', { ttl: 1000 * 60 /* 1 min */ });
};
storageInit();

//Start the cron
cron();


// Start the server.
app.listen(serverPort, () => {
  console.log(`server started on: ${serverPort}`);
});
