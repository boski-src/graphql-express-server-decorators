export class GraphqlGuards {

  public isAuth (root, args, ctx) : void {
    if (!ctx.account) throw new Error('Unauthenticated.');
  }

}

export const graphqlGuards = new GraphqlGuards();
export const { isAuth } = graphqlGuards;