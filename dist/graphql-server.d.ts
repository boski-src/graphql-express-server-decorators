/// <reference types="node" />
import * as http from 'http';
import * as https from 'https';
import { Application, NextFunction, Request, Response } from 'express';
import { GraphQLSchema } from 'graphql';
import { IConfig } from './common/interfaces';
export declare abstract class GraphQLServer {
    private app;
    private server;
    private config;
    schema: GraphQLSchema;
    private _schema;
    constructor(app: Application, server: http.Server | https.Server, config: IConfig);
    abstract onMiddleware(req: Request & {
        graphctx: any;
    }, res: Response, next: NextFunction): Promise<void | NextFunction>;
    abstract onConnect(a: any, b: any, c: any): Promise<object>;
    abstract onDisconnect(a: any, b: any, c: any): Promise<void>;
    run(): void;
    private init;
    private setupSchema;
    private setupMiddleware;
    private setupResolvers;
    private catchResolver;
}
