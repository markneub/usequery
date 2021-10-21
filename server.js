
const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');

const simpleSchema = gql`
    type Query {
        movies(movieIds: [Int]): [Movie!]!
        requestDetails: RequestDetails!
    }

    type Movie {
        movieId: Int!
        internalTitle: String!
    }

    type RequestDetails {
        id: String!
    }
`;

const fakeMovies = {
    80117715: {
        movieId: 80117715,
        internalTitle: 'some movie 80117715',
    },
    80057281: {
        movieId: 80057281,
        internalTitle: 'some movie 80057281',
    },
};

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration));

const server = new ApolloServer({
    typeDefs: simpleSchema.loc.source.body,
    resolvers: {
        Query: {
            movies: async (root, args, context, info) => {
                await sleep(1000);
                const movieIds = args.movieIds;
                if (movieIds) {
                    return movieIds.map(movieId => fakeMovies[movieId]);
                }
                // if no movieIds are provided, return all movies
                return Object.values(fakeMovies);
            },
        },
    }
});
const app = express();
server.applyMiddleware({ app, path: '/graphql' });

app.listen(4000, 'localhost', () => console.log(`🚀 Server ready at http://localhost:4000`));
