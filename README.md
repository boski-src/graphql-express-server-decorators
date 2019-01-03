graphql-express-server-decorators
===

> Project provide typescript decorators for setup server based on Express and GraphQL integration.

Project on NPM: https://www.npmjs.com/package/graphql-express-server-decorators

## Installation
```
npm install graphql-express-server-decorators --save
```
## Example
Look at the code example: [click here](https://github.com/boski-src/graphql-express-server-decorators/tree/master/example)

## Code samples
```typescript
// graphql.config.ts

import { IConfig } from 'graphql-express-server-decorators';

import { PostResolver } from './post.resolver';

export const GraphQLConfig : IConfig = {
  endpoint: '/graphql',
  subsEndpoint: '/subscriptions',
  console: true,
  middlewares: [],
  resolvers: [
    PostResolver
  ]
};
```
```typescript
// app.ts

import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';

export const app = express();

app.use(bodyParser.json())

export const server = http.createServer(app);

```

```typescript
// graphql.ts

import { app, server } from './app';
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

export const graphql = new GraphQL(app, server, GraphQLConfig);
```
```typescript
// post.resolver.ts

import fetch from 'node-fetch';
import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import { Arguments, Mutation, Query, Resolver, ScalarType } from 'graphql-express-server-decorators';

import { PostType } from './post-type'

@Resolver()
export class PostResolver {

  @Query()
  @ScalarType(GraphQLList(PostType))
  public async getPosts (root, args, ctx) : Promise<object> {
    let data = await fetch(`https://jsonplaceholder.typicode.com/posts`);
    return await data.json();
  }

  @Query()
  @ScalarType(PostType)
  @Arguments({
    postId: { type: GraphQLNonNull(GraphQLID) }
  })
  public async getPost (root, args, ctx) : Promise<object> {
    let data = await fetch(`https://jsonplaceholder.typicode.com/posts/${args.postId}`);
    return await data.json();
  }

  @Mutation([isAuth])
  @ScalarType(PostType)
  @Arguments({
    title: { type: GraphQLNonNull(GraphQLString) },
    body: { type: GraphQLNonNull(GraphQLString) },
    postId: { type: GraphQLNonNull(GraphQLID) },
  })
  public async createPost (root, args, ctx) : Promise<object> {
    let data = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({ title: args.title, body: args.body, postId: args.postId }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    return await data.json();
  }

}
```
```typescript
// post-type.ts

import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

export const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: {
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString }
  },
});
```

## Decorators API

##### `Resolver (middlewares: Function[])`

##### `Query (middlewares: Function[])`

##### `Mutation (middlewares: Function[])`

##### `Subscription (middlewares: Function[])`

##### `ObjectType (name : string, fields : any)`

##### `ScalarType (type : GraphQLScalarType | GraphQLObjectType)`

##### `Arguments (fields : any)`

#### Dependencies: [click here](https://github.com/boski-src/express-server-decorators/network/dependencies)
