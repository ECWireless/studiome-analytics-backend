const graphql = require('graphql');
const _ = require('lodash');

const Book = require('../models/book');
const Author = require('../models/author');
const Product = require('../models/product');
const Impression = require('../models/impression');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
} = graphql;

// GraphQL Objects
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                // return _.find(authors, { id: parent.authorId });
               return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return _.filter(books, { authorId: parent.id })
                return Book.find({ authorId: parent.id})
            }
        }
    })
})

const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        impressions: {
            type: new GraphQLList(ImpressionType),
            resolve(parent, args) {
                // return _.filter(impressions, { productIds: parent.id })
                return Impression.find({ productId: parent.id})
            }
        }
    })
})

const ImpressionType = new GraphQLObjectType({
    name: 'Impression',
    fields: () => ({
        id: { type: GraphQLID },
        date: { type: GraphQLString },
        product: {
            type: ProductType,
            resolve(parent, args) {
                return Product.findById(parent.productId);
            }
        }
    })
})


// Main Object
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        book: {
            type: BookType,
            args: { id: { type: GraphQLID} },
            resolve(parent, args) {
               // return _.find(books, {id: args.id});
               return Book.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: { id: {type: GraphQLID} },
            resolve(parent, args) {
                // return _.find(authors, {id: args.id});
                return Author.findById(args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books;
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors;
                return Author.find({});
            }
        },
        product: {
            type: ProductType,
            args: { id: {type: GraphQLID } },
            resolve(parent, args) {
                // return _.find(products, {id: args.id});
                return Product.findById(args.id)
            }
        },
        impression: {
            type: ImpressionType,
            args: { id: {type: GraphQLID } },
            resolve(parent, args) {
                // return _.find(impressions, {id: args.id});
                return Impression.findById(args.id)
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args) {
                // return products;
                return Product.find({});
            }
        },
        impressions: {
            type: new GraphQLList(ImpressionType),
            resolve(parent, args) {
                // return impressions;
                return Impression.find({});
            }
        }
    })
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
                age: { type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
                genre: { type: new GraphQLNonNull(GraphQLString)},
                authorId: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        },
        addProduct: {
            type: ProductType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                let product = new Product({
                    name: args.name
                });
                return product.save();
            }
        },
        addImpression: {
            type: ImpressionType,
            args: {
                date: { type: new GraphQLNonNull(GraphQLString)},
                productId: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                let impression = new Impression({
                    date: args.date,
                    productId: args.productId
                })
                return impression.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})