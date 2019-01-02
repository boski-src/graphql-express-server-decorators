export interface IConfig {
  endpoint : string,
  subsEndpoint : string,
  middlewares : Function[]
  resolvers : object[],
  console? : boolean
}