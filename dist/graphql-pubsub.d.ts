import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
export * from 'graphql-subscriptions';
export declare const graphQLPubSub: PubSub;
export declare function publish(subscriptionName: string, data: any, client?: PubSub | RedisPubSub): Promise<void>;
