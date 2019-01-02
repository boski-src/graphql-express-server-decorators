import * as http from 'http';
import * as https from 'https';
import { Application, NextFunction, Request, Response } from 'express';

import { execute, GraphQLObjectType, GraphQLSchema, subscribe } from 'graphql';
import graphqlPlayground from 'graphql-playground-middleware-express';
import { graphqlExpress, } from 'apollo-server-express/dist/expressApollo';
import { ServerOptions, SubscriptionServer } from 'subscriptions-transport-ws';

import { IConfig } from './common/interfaces';
import { getResolver } from './decorators';
import { objectIsEmpty } from './utils';

export abstract class GraphQLServer {

  public schema : GraphQLSchema;
  private _schema = { Query: {}, Mutation: {}, Subscription: {} };

  constructor (
    private app : Application,
    private server : http.Server | https.Server,
    private config : IConfig
  ) {
    this.init();
  }

  public abstract onMiddleware (
    req : Request & { graphctx : any },
    res : Response,
    next : NextFunction
  ) : Promise<void | NextFunction>

  public abstract onConnect (a, b, c) : Promise<object>

  public abstract onDisconnect (a, b, c) : Promise<void>

  public run () : void {
    this.setupMiddleware(
      {
        app: this.app,
        server: this.server,
        schema: this.schema,
        endpoint: this.config.endpoint,
        console: this.config.console
      },
      {
        endpoint: this.config.subsEndpoint,
        opts: {
          onConnect: this.onConnect,
          onDisconnect: this.onDisconnect
        }
      }
    );
  }

  private init () {
    this.setupResolvers(this.config.resolvers, this.config.middlewares);
    this.setupSchema();
  }

  private setupSchema () : void {
    let query : GraphQLObjectType = new GraphQLObjectType({
      name: 'Query',
      fields: this._schema.Query
    });

    let mutation : GraphQLObjectType = new GraphQLObjectType({
      name: 'Mutation',
      fields: this._schema.Mutation
    });

    let subscription : GraphQLObjectType = new GraphQLObjectType({
      name: 'Subscription',
      fields: this._schema.Subscription
    });

    this.schema = new GraphQLSchema({
      query: objectIsEmpty(this._schema.Query) ? null : query,
      mutation: objectIsEmpty(this._schema.Mutation) ? null : mutation,
      subscription: objectIsEmpty(this._schema.Subscription) ? null : subscription
    });
  }

  private setupMiddleware (
    config : {
      app : Application,
      server : http.Server | https.Server,
      schema : GraphQLSchema,
      endpoint : string
      console : boolean
    },
    subs : {
      endpoint : string,
      opts : ServerOptions
    }
  ) {
    if (config.console) {
      config.app.get('/console', graphqlPlayground({
        endpoint: config.endpoint,
        subscriptionEndpoint: subs.endpoint
      }));
    }
    config.app.use(
      config.endpoint,
      this.onMiddleware,
      graphqlExpress((req : any) => ({ schema: config.schema, context: req.graphctx }))
    );

    new SubscriptionServer({
      schema: config.schema,
      execute,
      subscribe,
      ...subs.opts
    }, {
      server: config.server,
      path: subs.endpoint
    });
  }

  private setupResolvers (resolvers, globalMiddlewares : Function[] = []) : void {
    for (const item of resolvers) {
      let { target, middlewares, fields } = getResolver(item);

      for (const { method, type, args, selfMiddlewares, key } of fields) {
        let action = method === 'Subscription' ? 'subscribe' : 'resolve';
        let middleware = [...globalMiddlewares, ...middlewares, ...selfMiddlewares];

        this._schema[method][key] = {
          type,
          args,
          [action]: this.catchResolver(target[key].bind(target), middleware)
        };
      }
    }
  }

  private catchResolver (fn, middlewares : Function[] = []) : never | Function {
    return async (root, args, ctx) : Promise<any> => {
      try {
        let error : string | Error;

        for (const middleware of middlewares) {
          try {
            await middleware(root, args, ctx);
          }
          catch (e) {
            error = e;
            break;
          }
        }

        if (error) throw error;

        return await fn(root, args, ctx);
      }
      catch (e) {
        throw e;
      }
    };
  }

}