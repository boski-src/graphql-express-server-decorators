import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export * from 'graphql-subscriptions';

export const graphQLPubSub : PubSub = new PubSub();

export async function publish (
  subscriptionName : string,
  data : any,
  client : PubSub | RedisPubSub = graphQLPubSub
) : Promise<void> {
  await client.publish(subscriptionName, {
    [subscriptionName]: data
  });
}