const Express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const Mongoose = require('mongoose');
const {Schema, mongoose} = require('mongoose')
var cors = require('cors')
const {
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull,
    buildSchema
} = require('graphql');
// const { Mongoose } = require('mongoose');

var app = Express();
app.use(cors())

Mongoose.connect('mongodb+srv://admin:admin%40123@cluster0.ppbyok0.mongodb.net/sample_mflix?retryWrites=true&w=majority');

// const connection = mongoose.createConnection('mongodb+srv://admin:admin%40123@cluster0.ppbyok0.mongodb.net/sample_mflix?retryWrites=true&w=majority');

const userSchema = new Schema({
    "name": String,
    "email": String
});

const postSchema = new Schema({
    "id": Number,
    "title": String,
    "body": String,
    "userId": Number
});

const UserModel = Mongoose.model('users', userSchema);
const PostModel = Mongoose.model('posts', postSchema);

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        name: {type: GraphQLString},
        email: {type: GraphQLString}
    }
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: {
        title: {type: GraphQLString},
        body: {type: GraphQLString},
        userId: {type: GraphQLInt}
    }
});

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            Users: {
                type: GraphQLList(UserType),
                resolve: (root, args, context, info) => {
                    return UserModel.find({});
                }
            },
            posts: {
                type: GraphQLList(PostType),
                resolve: (root, args, context, info) => {
                    return PostModel.find({});
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            createUser: {
                type: UserType,
                args: {
                    name: {type: GraphQLString},
                    email: {type: GraphQLString}
                },
                resolve: (root, args, context, info) => {
                    console.log(root, args)
                    // UserModel.publish()
                }
            }
        }
    })
});

// schema.set('collection', 'sample_mflix');

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(3000, () => {
    console.log('Listening on 3000 Port');
})