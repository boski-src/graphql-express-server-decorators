import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import { Query, Resolver, ObjectType } from '../../src/decorators';

import { isAuth } from '../graphql.guards';

@Resolver([isAuth])
export class AccountResolver {

  @Query()
  @ObjectType('AccountType', {
    id: { type: GraphQLID },
    email: { type: GraphQLString },
  })
  public account (root, args, ctx) : boolean {
    return ctx.account;
  }

}