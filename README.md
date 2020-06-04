# tellorDisputeCenter

### Development

1. Install dependencies

   `yarn install`

   \*\*Note we are using node 12.x in the production environment.

2. Create the .env file and fillout the variables

   `cp .env.sample .env`

3. Start the server

   `yarn start`

4. Open a browser: http://localhost:3000

### App structure

#### Routes

Home, disputes, mining pages for the app

- /src/Routes.js
- /src/Views/

#### State management

App wide state is stored and accessed using the react context api

- All contexts are initialized in /context/Store.js
- ContractContext: holds the service that interacts with the contract and data fetched from the contract
- CurrentUserContext and Web3ModalContext: holds info about the user signed in with Metamask and the web3 provider instance
- OpenDisputesContext: holds the current open disputes used in a few views and components

#### Graphql data fetching

Contract events are cached and mapped into usable entities on thegraph
https://thegraph.com/explorer/subgraph/tellor-io/tellor-dispute

These entites can be queried at
https://api.thegraph.com/subgraphs/name/tellor-io/tellor-dispute

This app uses react-apollo to handle the graph queries

- ApolloProvider initialized in src/index.js
- ApolloClient is then available throughout the app, see
- Each view has data fetching components that grab the graphData and make it available for the other components in the view
- Fetch component using the useQuery hook: src/components/shared/GraphFetch.js
- graph queries: src/utils/queries.js
- Resolver functions are called on each entity as it is fetched to hydrate/format the data to make component logic simpler: src/utils/resolvers.js

#### Web3 contract interaction

A service that wraps all contract calls and it's used for dispute and vote transactions.

- src/utils/tellorService.js
- example: src/components/disputes/DisputeForm.js

Metamask signin is handled with walletconnect and web3modal and implemented in

- src/components/shared/Web3SignIn.js
- src/utils/auth.js

#### Styling

- https://ant.design/
