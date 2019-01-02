export class GraphqlMiddlewares {

  public checkArguments (root, args) : void {
    console.log(args);
  }

}

export const graphqlMiddlewares = new GraphqlMiddlewares();
export const { checkArguments } = graphqlMiddlewares;