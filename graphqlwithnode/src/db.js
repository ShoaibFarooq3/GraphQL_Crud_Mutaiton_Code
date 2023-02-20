//     "mongodb+srv://shoaibfarooq3:O9xgsh1wYCMUR6wq@cluster0.8vohzm7.mongodb.net/?retryWrites=true&w=majority",

const users = [
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
const posts = [
  {
    id: "10",
    title: "React js",
    body: "This is test body for Testing 01...",
    published: true,
    author: "1",
  },
  {
    id: "11",
    title: "Graph QL",
    body: "This is test body for graph...",
    published: true,
    author: "2",
  },
  {
    id: "12",
    title: "Node JS",
    body: "This is test body for Node ...",
    published: false,
    author: "3",
  },
];
const comments = [
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

const db = {
  users,
  posts,
  comments,
};

export { db as default };
