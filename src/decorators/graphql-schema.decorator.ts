import 'reflect-metadata';
import { GraphQLObjectType, GraphQLScalarType } from 'graphql';
import { GraphQLList } from 'graphql/type/definition';

import { EGraphTypes } from '../common/enums';
import { ISchemaDecoratorField, ISchemaDecoratorResolver } from '../common/interfaces';

const __RESOLVER__ = 'graphql:resolver';
const __FIELD__ = 'graphql:field';
const __TYPE__ = 'graphql:type';
const __ARGUMENT__ = 'graphql:argument';

export function getResolver (resolverClass) : ISchemaDecoratorResolver {
  const instance = new resolverClass();
  return Reflect.getMetadata(__RESOLVER__, instance.constructor) || {};
}

export function resolver (middlewares : Function[] = []) : Function {
  return (target) : void => {
    let fields : ISchemaDecoratorField[] = Reflect.getMetadata(__FIELD__, target.prototype.constructor) || [];

    const resolver : ISchemaDecoratorResolver = {
      target: new target(),
      middlewares,
      fields
    };

    Reflect.defineMetadata(__RESOLVER__, resolver, target.prototype.constructor);
  };
}

export function field (method : EGraphTypes, selfMiddlewares : Function[] = []) : Function {
  return (target, key) : void => {
    let fields : ISchemaDecoratorField[] = Reflect.getMetadata(__FIELD__, target.constructor) || [];
    let type : GraphQLObjectType | GraphQLScalarType = Reflect.getMetadata(__TYPE__, target.constructor) || {};
    let args : object = Reflect.getMetadata(__ARGUMENT__, target.constructor) || {};

    fields.push(<ISchemaDecoratorField>{ method, type, args, selfMiddlewares, key });

    Reflect.defineMetadata(__FIELD__, fields, target.constructor);
  };
}

export function objectType (name : string, fields : any) : Function {
  return (target) : void => {
    let type : GraphQLObjectType = new GraphQLObjectType({ name, fields });
    Reflect.defineMetadata(__TYPE__, type, target.constructor);
  };
}

export function scalarType (type : GraphQLScalarType | GraphQLObjectType | GraphQLList<any>) : Function {
  return (target) : void => {
    Reflect.defineMetadata(__TYPE__, type, target.constructor);
  };
}

export function argument (fields : object = {}) : Function {
  return (target) : void => {
    Reflect.defineMetadata(__ARGUMENT__, fields, target.constructor);
  };
}

export function Resolver (middlewares : Function[] = []) : Function {
  return resolver(middlewares);
}

export function Query (middlewares : Function[] = []) : Function {
  return field(EGraphTypes.query, middlewares);
}

export function Mutation (middlewares : Function[] = []) : Function {
  return field(EGraphTypes.mutation, middlewares);
}

export function Subscription (middlewares : Function[] = []) : Function {
  return field(EGraphTypes.subscription, middlewares);
}

export function ObjectType (name : string, fields : any) : Function {
  return objectType(name, fields);
}

export function ScalarType (type : GraphQLScalarType | GraphQLObjectType | GraphQLList<any>) : Function {
  return scalarType(type);
}

export function Arguments (fields : any) : Function {
  return argument(fields);
}