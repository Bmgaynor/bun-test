import { Database } from "bun:sqlite";

const db = new Database("newDB.sqlite");

function seedData() {
  console.log("Seeding data");
  db.run(
    "CREATE TABLE IF NOT EXISTS foo (id INTEGER PRIMARY KEY AUTOINCREMENT, greeting TEXT)"
  );
  db.run("INSERT INTO foo (greeting) VALUES (?)", "Welcome to bun!");
  db.run("INSERT INTO foo (greeting) VALUES (?)", "Hello World!");
}

type Greeting = {
  id: string;
  greeting: string;
};

function getGreeting(id: string): Greeting {
  return db.query("SELECT * FROM foo WHERE id = ?").all(id)[0];
}

seedData();
Bun.serve({
  fetch(req) {
    const greetingId = req.headers.get("greeting");
    if (greetingId) {
      return Response.json(getGreeting(greetingId));
    } else {
      const greeting = db.query("SELECT * FROM foo").all();
      return Response.json(greeting);
    }
  },
  error(error) {
    console.log(error);
    return new Response("Internal Service Error");
  },
});

console.log("listening on localhost:3000");

// TESTING
// 1. curl -i -H "greeting: 1" localhost:3000

// 2.
// setTimeout(() => {
//   fetch("localhost:3000", {
//     headers: {
//       greeting: "1",
//     },
//   })
//     .then((res) => {
//       return res.json();
//     })
//     .then((data) => {
//       console.log("Response", data);
//     });
// }, 500);
