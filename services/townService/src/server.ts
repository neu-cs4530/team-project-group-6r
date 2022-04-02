import Express from 'express';
import * as http from 'http';
import CORS from 'cors';
import mongoose from 'mongoose';
import { AddressInfo } from 'net';
import addTownRoutes from './router/towns';
import CoveyTownsStore from './lib/CoveyTownsStore';
import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';
import Grid from 'gridfs-stream';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import path from 'path';
import crypto from 'crypto';


const app = Express();
app.use(CORS());
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
const server = http.createServer(app);

const uri = 'mongodb+srv://Vevey:User1@coveytown.kt2xq.mongodb.net/CoveyTown?retryWrites=true&w=majority';

const conn = mongoose.createConnection(uri);
//mongoose.connect(uri).then(() => { console.log('MongoDB Connected') }).catch(err => console.log(err));

let gfs;




addTownRoutes(server, app)

server.listen(process.env.PORT || 8081, () => {
  const address = server.address() as AddressInfo;
  // eslint-disable-next-line no-console
  console.log(`Listening on ${address.port}`);
  if (process.env.DEMO_TOWN_ID) {
    CoveyTownsStore.getInstance()
      .createTown(process.env.DEMO_TOWN_ID, false);
  }
});
