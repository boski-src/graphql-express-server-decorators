import { EGraphTypes } from '../enums';
import { GraphQLObjectType } from 'graphql';
export interface ISchemaDecoratorField {
    method: EGraphTypes;
    type: GraphQLObjectType;
    args: object;
    selfMiddlewares: Function[];
    key: string;
}
