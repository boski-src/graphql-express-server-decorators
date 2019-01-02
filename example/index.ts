import { app } from './app';

import { graphql } from './graphql';

async function bootstrap (port : number) : Promise<number> {
  graphql.run();
  app.listen(port);

  return port;
}

bootstrap(8000)
  .then((port : number) => console.log('Server started on port:', port))
  .catch((e : Error) => console.log('Server starting error:', e));

process.on('SIGINT', () => {
  app.server.close();
  process.exit();
});