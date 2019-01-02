"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var graphql_1 = require("graphql");
var enums_1 = require("../common/enums");
var __RESOLVER__ = 'graphql:resolver';
var __FIELD__ = 'graphql:field';
var __TYPE__ = 'graphql:type';
var __ARGUMENT__ = 'graphql:argument';
function getResolver(resolverClass) {
    var instance = new resolverClass();
    return Reflect.getMetadata(__RESOLVER__, instance.constructor) || {};
}
exports.getResolver = getResolver;
function resolver(middlewares) {
    if (middlewares === void 0) { middlewares = []; }
    return function (target) {
        var fields = Reflect.getMetadata(__FIELD__, target.prototype.constructor) || [];
        var resolver = {
            target: new target(),
            middlewares: middlewares,
            fields: fields
        };
        Reflect.defineMetadata(__RESOLVER__, resolver, target.prototype.constructor);
    };
}
exports.resolver = resolver;
function field(method, selfMiddlewares) {
    if (selfMiddlewares === void 0) { selfMiddlewares = []; }
    return function (target, key) {
        var fields = Reflect.getMetadata(__FIELD__, target.constructor) || [];
        var type = Reflect.getMetadata(__TYPE__, target.constructor) || {};
        var args = Reflect.getMetadata(__ARGUMENT__, target.constructor) || {};
        fields.push({ method: method, type: type, args: args, selfMiddlewares: selfMiddlewares, key: key });
        Reflect.defineMetadata(__FIELD__, fields, target.constructor);
    };
}
exports.field = field;
function objectType(name, fields) {
    return function (target) {
        var type = new graphql_1.GraphQLObjectType({ name: name, fields: fields });
        Reflect.defineMetadata(__TYPE__, type, target.constructor);
    };
}
exports.objectType = objectType;
function scalarType(type) {
    return function (target) {
        Reflect.defineMetadata(__TYPE__, type, target.constructor);
    };
}
exports.scalarType = scalarType;
function argument(fields) {
    if (fields === void 0) { fields = {}; }
    return function (target) {
        Reflect.defineMetadata(__ARGUMENT__, fields, target.constructor);
    };
}
exports.argument = argument;
function Resolver(middlewares) {
    if (middlewares === void 0) { middlewares = []; }
    return resolver(middlewares);
}
exports.Resolver = Resolver;
function Query(middlewares) {
    if (middlewares === void 0) { middlewares = []; }
    return field(enums_1.EGraphTypes.query, middlewares);
}
exports.Query = Query;
function Mutation(middlewares) {
    if (middlewares === void 0) { middlewares = []; }
    return field(enums_1.EGraphTypes.mutation, middlewares);
}
exports.Mutation = Mutation;
function Subscription(middlewares) {
    if (middlewares === void 0) { middlewares = []; }
    return field(enums_1.EGraphTypes.subscription, middlewares);
}
exports.Subscription = Subscription;
function ObjectType(name, fields) {
    return objectType(name, fields);
}
exports.ObjectType = ObjectType;
function ScalarType(type) {
    return scalarType(type);
}
exports.ScalarType = ScalarType;
function Arguments(fields) {
    return argument(fields);
}
exports.Arguments = Arguments;
