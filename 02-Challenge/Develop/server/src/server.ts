import express from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import db from './config/connection.js';
import dotenv from 'dotenv';

// Import GraphQL schemas
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateRequest } from './services/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Start Server
async function startServer() {
    await server.start();

    // ✅ Move `context` here inside `expressMiddleware()`
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => authenticateRequest({ req }),
    }));

    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/build')));
    }

    db.once('open', () => {
        app.listen(PORT, () => console.log(`🌍 API available at http://localhost:${PORT}/graphql`));
    });
}

startServer().catch((err) => console.error('Server startup error:', err));
