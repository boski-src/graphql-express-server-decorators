import { IConfig } from '../src/common/interfaces';

import { checkArguments } from './graphql.middlewares';
import { AccountResolver, PostResolver } from './resolvers';

export const GraphQLConfig : IConfig = {
  endpoint: '/graphql',
  subsEndpoint: '/subscriptions',
  console: true,
  middlewares: [checkArguments],
  resolvers: [
    AccountResolver,
    PostResolver
  ]
};