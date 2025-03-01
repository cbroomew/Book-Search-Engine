import User from '../models/User.js';
import { generateToken } from '../services/auth.js';
import { GraphQLError } from 'graphql';

// Define TypeScript Interfaces for Resolvers
interface RegisterArgs {
    username: string;
    email: string;
    password: string;
}

interface AuthArgs {
    email: string;
    password: string;
}

interface BookInput {
    id: string;
    authors?: string[];
    summary?: string;
    title: string;
    coverImage?: string;
    url?: string;
}

interface AddBookArgs {
    input: BookInput;
}

interface RemoveBookArgs {
    id: string;
}

export const resolvers = {
    Query: {
        currentUser: async (_parent: any, _args: any, context: any) => {
            if (!context.user) throw new GraphQLError('Authentication required');
            return await User.findById(context.user.id);
        }
    },

    Mutation: {
        registerUser: async (_parent: any, { username, email, password }: RegisterArgs) => {
            const newUser = await User.create({ username, email, password });
            const token = generateToken(newUser.username, newUser.email, newUser.id);
            return { token, user: newUser };
        },

        authenticate: async (_parent: any, { email, password }: AuthArgs) => {
            const userRecord = await User.findOne({ email });
            if (!userRecord || !(await userRecord.isCorrectPassword(password))) {
                throw new GraphQLError('Invalid email or password');
            }
            const token = generateToken(userRecord.username, userRecord.email, userRecord.id);
            return { token, user: userRecord };
        },

        addBookToLibrary: async (_parent: any, { input }: AddBookArgs, context: any) => {
            if (!context.user) throw new GraphQLError('Authentication required');
            return await User.findByIdAndUpdate(
                context.user.id,
                { $addToSet: { library: input } },
                { new: true }
            );
        },

        removeBookFromLibrary: async (_parent: any, { id }: RemoveBookArgs, context: any) => {
            if (!context.user) throw new GraphQLError('Authentication required');
            return await User.findByIdAndUpdate(
                context.user.id,
                { $pull: { library: { id } } },
                { new: true }
            );
        }
    }
};
