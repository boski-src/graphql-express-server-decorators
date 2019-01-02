import { PubSub } from 'graphql-subscriptions';

export * from 'graphql-subscriptions';

export const graphQLPubSub : PubSub = new PubSub();

export async function publish (subscriptionName : string, data : any) : Promise<void> {
  await graphQLPubSub.publish(subscriptionName, {
    [subscriptionName]: data
  });
}