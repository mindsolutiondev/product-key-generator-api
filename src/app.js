import express from "express";
import bodyParser from "body-parser";
import gracefulShutdown from "http-graceful-shutdown";
import logMiddleWare from "./middlewares/logMiddleware";
import mongooseClient from "./util/database/mongoose";

import config from './config'
import { register } from "./util/registerRoute";
import path from "path";
import cors from 'cors';
// import logger from "./util/logger/logger";
const app = express();

app.use(logMiddleWare);
app.use(bodyParser.urlencoded({ limit: "80mb", extended: true }));
app.use(cors())
app.engine('ejs', require('ejs').__express);
app.use(express.static('./views'))
app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views/authorizationPage'));

/* use body parser */
app.use(
  bodyParser.json({
    type: "*/*",
    limit: "80mb",
  })
);

mongooseClient(config.all.mongo.uri, config.all.mongo.options).then(
  (dbClient) => {
    // logger.info(
    //   { event: "execute" },
    // console.log(`Connected to ${dbClient.host}:${dbClient.port}/${dbClient.name}`)
    // )
  }
);
/* Register Route */
register(app, path.resolve(__dirname, "controllers"), ".controller.js");
const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

gracefulShutdown(server);
