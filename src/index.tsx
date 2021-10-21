import React from "react";
import ReactDOM from "react-dom";
import gql from "graphql-tag";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider, useQuery} from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "/graphql"
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    }
  }
});

// Removing "requestDetails" from here will make the React warnings go away.
const GET_MOVIES = gql(`
query GetMovies($movieIds: [Int]) {
  movies(movieIds: $movieIds) {
    movieId
    internalTitle
  }
}
`);

function HomePage() {
  const { data, loading, error } = useQuery(GET_MOVIES, {
    // variables: { movieIds: [80117715, 80057281] }
  });

  if (error) {
    console.error('Error', error);
  }

  return (
    <div>
      <h1>Movie List</h1>
      {(() => {
        if (loading) {
          return <div>Loading...</div>
        }
        return data.movies.map((movie: any) => {
          return (
            <div key={movie.movieId}>
              <div>🎬 {movie.internalTitle}</div>
            </div>
          );
        })
      })()}
    </div>
  );
}

function App() {
  return <ApolloProvider client={client}>
    <BrowserRouter>
      <Switch>
        <Route exact path={'/'} component={HomePage} />
      </Switch>
    </BrowserRouter>
  </ApolloProvider>
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
