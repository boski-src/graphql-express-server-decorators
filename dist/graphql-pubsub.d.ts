import { PubSub } from 'graphql-subscriptions';
export * from 'graphql-subscriptions';
export declare const graphQLPubSub: PubSub;
export declare function publish(subscriptionName: string, data: any): Promise<void>;
