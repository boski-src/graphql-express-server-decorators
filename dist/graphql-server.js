"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var graphql_playground_middleware_express_1 = require("graphql-playground-middleware-express");
var expressApollo_1 = require("apollo-server-express/dist/expressApollo");
var subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
var decorators_1 = require("./decorators");
var utils_1 = require("./utils");
var GraphQLServer = /** @class */ (function () {
    function GraphQLServer(app, server, config) {
        this.app = app;
        this.server = server;
        this.config = config;
        this._schema = { Query: {}, Mutation: {}, Subscription: {} };
        this.init();
    }
    GraphQLServer.prototype.run = function () {
        this.setupMiddleware({
            app: this.app,
            server: this.server,
            schema: this.schema,
            endpoint: this.config.endpoint,
            console: this.config.console
        }, {
            endpoint: this.config.subsEndpoint,
            opts: {
                onConnect: this.onConnect,
                onDisconnect: this.onDisconnect
            }
        });
    };
    GraphQLServer.prototype.init = function () {
        this.setupResolvers(this.config.resolvers, this.config.middlewares);
        this.setupSchema();
    };
    GraphQLServer.prototype.setupSchema = function () {
        var query = new graphql_1.GraphQLObjectType({
            name: 'Query',
            fields: this._schema.Query
        });
        var mutation = new graphql_1.GraphQLObjectType({
            name: 'Mutation',
            fields: this._schema.Mutation
        });
        var subscription = new graphql_1.GraphQLObjectType({
            name: 'Subscription',
            fields: this._schema.Subscription
        });
        this.schema = new graphql_1.GraphQLSchema({
            query: utils_1.objectIsEmpty(this._schema.Query) ? null : query,
            mutation: utils_1.objectIsEmpty(this._schema.Mutation) ? null : mutation,
            subscription: utils_1.objectIsEmpty(this._schema.Subscription) ? null : subscription
        });
    };
    GraphQLServer.prototype.setupMiddleware = function (config, subs) {
        if (config.console) {
            config.app.get('/console', graphql_playground_middleware_express_1.default({
                endpoint: config.endpoint,
                subscriptionEndpoint: subs.endpoint
            }));
        }
        config.app.use(config.endpoint, this.onMiddleware, expressApollo_1.graphqlExpress(function (req) { return ({ schema: config.schema, context: req.graphctx }); }));
        new subscriptions_transport_ws_1.SubscriptionServer(__assign({ schema: config.schema, execute: graphql_1.execute,
            subscribe: graphql_1.subscribe }, subs.opts), {
            server: config.server,
            path: subs.endpoint
        });
    };
    GraphQLServer.prototype.setupResolvers = function (resolvers, globalMiddlewares) {
        if (globalMiddlewares === void 0) { globalMiddlewares = []; }
        var _a;
        for (var _i = 0, resolvers_1 = resolvers; _i < resolvers_1.length; _i++) {
            var item = resolvers_1[_i];
            var _b = decorators_1.getResolver(item), target = _b.target, middlewares = _b.middlewares, fields = _b.fields;
            for (var _c = 0, fields_1 = fields; _c < fields_1.length; _c++) {
                var _d = fields_1[_c], method = _d.method, type = _d.type, args = _d.args, selfMiddlewares = _d.selfMiddlewares, key = _d.key;
                var action = method === 'Subscription' ? 'subscribe' : 'resolve';
                var middleware = globalMiddlewares.concat(middlewares, selfMiddlewares);
                this._schema[method][key] = (_a = {
                        type: type,
                        args: args
                    },
                    _a[action] = this.catchResolver(target[key].bind(target), middleware),
                    _a);
            }
        }
    };
    GraphQLServer.prototype.catchResolver = function (fn, middlewares) {
        var _this = this;
        if (middlewares === void 0) { middlewares = []; }
        return function (root, args, ctx) { return __awaiter(_this, void 0, void 0, function () {
            var error, _i, middlewares_1, middleware, e_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        error = void 0;
                        _i = 0, middlewares_1 = middlewares;
                        _a.label = 1;
                    case 1:
                        if (!(_i < middlewares_1.length)) return [3 /*break*/, 6];
                        middleware = middlewares_1[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, middleware(root, args, ctx)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        error = e_1;
                        return [3 /*break*/, 6];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        if (error)
                            throw error;
                        return [4 /*yield*/, fn(root, args, ctx)];
                    case 7: return [2 /*return*/, _a.sent()];
                    case 8:
                        e_2 = _a.sent();
                        throw e_2;
                    case 9: return [2 /*return*/];
                }
            });
        }); };
    };
    return GraphQLServer;
}());
exports.GraphQLServer = GraphQLServer;
