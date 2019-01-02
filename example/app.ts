import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';

export class App {

  public express : express.Application;
  public server : http.Server;

  constructor () {
    this.express = express();
    this.init();
    this.server = http.createServer(this.express);
  }

  public init () {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(morgan('dev'));
  }

  public listen (port : number) : void {
    this.server.listen(port);
    this.server.timeout = 1000 * 60 * 3;
  }

}

export const app = new App();