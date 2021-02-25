### Development

1. Install dependencies

   `npm install`

   \*\*Note we are using node 12.x in the production environment.

2. Create the .env file and fillout the variables

   `cp .env.sample .env`

3. Start the server

   `npm start`

4. Open a browser: http://localhost:3000

### App structure

#### Graphql data fetching

Contract events are cached and mapped into usable entities on thegraph
https://thegraph.com/explorer/subgraph/tellor-io/lens
https://thegraph.com/explorer/subgraph/tellor-io/lens-rinkeby

These entites can be queried at
https://api.thegraph.com/subgraphs/name/tellor-io/lens
https://api.thegraph.com/subgraphs/name/tellor-io/lens-rinkeby

This app uses react-apollo to handle the graph queries

- ApolloProvider initialized in src/index.js
- ApolloClient is then available throughout the app, see
- Each view has data fetching components that grab the graphData and make it available for the other components in the view
- Fetch component using the useQuery hook: src/components/shared/GraphFetch.js
- graph queries: src/utils/queries.js
- Resolver functions are called on each entity as it is fetched to hydrate/format the data to make component logic simpler: src/utils/resolvers.js

#### Styling

- https://ant.design/
