const graphql = require('graphql')
const _ = require('lodash')
const Book = require('../models/book')
const Author = require('../models/Author')

const { GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
  //this field is required
} = graphql


// "Terry Pratchett" 5ff64e8895fa752e2aace937

// "Brandon Sanderson" 5ff6519a95fa752e2aace939

// "Patrick Rothfuss" 5ff651d995fa752e2aace93a

//dummy data:
// const books = [
//   { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
//   { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
//   { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
//   { name: 'The hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
//   { name: 'The Color of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
//   { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' }
// ]
// const authors = [
//   { name: 'Patrick Rothfuss', age: 44, id: '1' },
//   { name: 'Brandon Sanderson', age: 42, id: '2' },
//   { name: 'Terry Pretchett', age: 66, id: '3' }
// ]

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // console.log('this is parent(book)', parent)
        // console.log('this is lodash', _.prototype)
        // return _.find(authors, { id: parent.authorId })
        return Author.findById(parent.authorId)
      }
    }
  })
})

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
        //we want to find all books based on that criteria
        return Book.find({ authorId: parent.id })
      }
    }
  })
})
/*
 1. Defines types
2. defines relationships
3. defines root- Querries
*/
// Allow to use on the Front -end
//ROOT QUERY
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get data from DB or other source
        console.log(typeof args.id)
        // return _.find(books, { id: args.id })
        return Book.findById(args.id)
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get data from DB or other source
        console.log('this is author querry :', typeof args.id)
        // return _.find(authors, { id: args.id })
        return Author.findById(args.id)
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books
        // "return all books by passing empty object(no criteria applied-return all)""
        return Book.find({})
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authors
        return Author.find({})
      }
    }
  }
})


//Mutations are changing database -request by front-end

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        //save to db
        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        //is required
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        //save to db
        return book.save();
      },
    },
  },
});







// const Mutation = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: {
//     addAuthor: {
//       //which schema to use and where
//       type: AuthorType,
//       args: {
//         name: { type: GraphQLString },
//         age: { type: GraphQLInt }
//       },
//       resolve(parent, args) {
//         //create local author
//         let author = new Author({
//           name: args.name,
//           age: args.age
//         });
//         //save to db
//         return author.save()
//       }
//     }
//   }
// })



module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
