import { GraphQLServer } from '../src/graphql-server';

import { app } from './app';
import { GraphQLConfig } from './graphql.config';

export class GraphQL extends GraphQLServer {

  public async onMiddleware (req, res, next) : Promise<void> {
    let query = req.query.query || req.body.query;
    if (query && query.length > 2000) throw new Error('Query too large.');

    req.graphctx = {
      account: {
        id: 1,
        email: 'test@example.com'
      }
    };

    next();
  }

  public async onConnect (connection) : Promise<object> {
    console.log('Connected:', connection);

    return { connection };
  }

  public async onDisconnect (_, socket) : Promise<void> {
    let ctx = await socket.initPromise;

    console.log('Disconnected:', ctx);
  }

}

export const graphql = new GraphQL(app.express, app.server, GraphQLConfig);