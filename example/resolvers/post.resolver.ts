import fetch from 'node-fetch';
import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import { Arguments, Mutation, Query, Resolver, ScalarType } from '../../src/decorators';

import { isAuth } from '../graphql.guards';
import { PostType } from '../types';

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