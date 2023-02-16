import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";
// Demo User Data
let users = [
  {
    id: "1",
    name: "Andrew",
    email: "andrew@example.com",
    age: 27,
  },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@example.com",
  },
  {
    id: "3",
    name: "Mike",
    email: "mike@example.com",
  },
];
// Demo Posts Data
let posts = [
  {
    id: "101",
    title: "React js",
    body: "This is test body for Testing 01...",
    published: true,
    author: "1",
  },
  {
    id: "102",
    title: "Graph QL",
    body: "This is test body for graph...",
    published: true,
    author: "2",
  },
  {
    id: "103",
    title: "Node JS",
    body: "This is test body for Node ...",
    published: false,
    author: "3",
  },
];
let comments = [
  {
    id: "102",
    text: "First Comment",
    author: "1",
    post: "101",
  },
  {
    id: "103",
    text: "Second Comment",
    author: "1",
    post: "101",
  },
  {
    id: "104",
    text: "Third Comment",
    author: "2",
    post: "102",
  },
  {
    id: "105",
    text: "Fourth Comment",
    author: "2",
    post: "102",
  },
  {
    id: "106",
    text: "Fifth Comment",
    author: "3",
    post: "102",
  },
];
// Schema
const typeDefs = `
    type Query {
      comments: [Comment!]!
      posts(query: String): [Post!]!
      me: User!
      users(query: String): [User!]!
      post:Post!
    }
    type Mutation {
      createUser(data: CreateUserInput!): User!
      deleteUser(id: ID!): User!
      createPost(data: CreatePostInput!): Post!
      deletePost(id: ID!): Post!
      createComment(data: CreateCommentInput!): Comment!
      deleteComment(id: ID!): Comment!
  }

  input CreateUserInput {
      name: String!
      email: String!
      age: Int
  }

  input CreatePostInput {
      title: String!
      body: String!
      published: Boolean!
      author: ID!
  }
    input CreateCommentInput {
      text: String!
      author: ID!
      post: ID!
  }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
      posts:[Post!]!
      comments: [Comment!]!
    }
    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
      author: User!
      comments: [Comment]!
    }
    type Comment {
      id: ID!
      text: String!
      author: User!
      post:Post!
    }
`;
// Resolvers
const resolvers = {
  Query: {
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch;
      });
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    comments(parent, args, ctx, info) {
      return comments;
    },
    me() {
      return {
        id: "12390",
        name: "Shoaib Farooq",
        email: "shoaib@example.com",
        age: null,
      };
    },
    post() {
      return {
        id: "092",
        title: "GraphQL 101",
        body: "",
        published: false,
      };
    },
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.data.email);

      if (emailTaken) {
        throw new Error("Email taken");
      }

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const deletedUsers = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id);
        }

        return !match;
      });
      comments = comments.filter((comment) => comment.author !== args.id);

      return deletedUsers[0];
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);

      if (!userExists) {
        throw new Error("User not found");
      }

      const post = {
        id: uuidv4(),
        ...args.data,
      };

      posts.push(post);

      return post;
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) {
        throw new Error("Post not found");
      }

      const deletedPosts = posts.splice(postIndex, 1);

      comments = comments.filter((comment) => comment.post !== args.id);

      return deletedPosts[0];
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);
      const postExists = posts.some(
        (post) => post.id === args.data.post && post.published
      );

      if (!userExists || !postExists) {
        throw new Error("Unable to find user and post");
      }

      const comment = {
        id: uuidv4(),
        ...args.data,
      };

      comments.push(comment);

      return comment;
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error("Comment not found");
      }

      const deletedComments = comments.splice(commentIndex, 1);

      return deletedComments[0];
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },
};

// Server starting
const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("The server is running!");
});
