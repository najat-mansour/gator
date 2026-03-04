# Gator
### Overview
This is a project (basically a course) in [Boot.dev](https://www.boot.dev) platform called [Build a Blog Aggregator in Typescript](https://www.boot.dev/courses/build-blog-aggregator-typescript). It is a part of **Foothill Technology Solutions (FTS)** <u>Back-End Internship Roadmap</u>.  

It comes after three previous courses: 
* [Learn Git](https://www.boot.dev/courses/learn-git)
* [Learn TypeScript](https://www.boot.dev/courses/learn-typescript)
* [Learn HTTP Clients in TypeScript](https://www.boot.dev/courses/learn-http-clients-typescript)
* [Build a Pokedex in TypeScript](https://www.boot.dev/courses/build-pokedex-cli-typescript)
* [Learn SQL](https://www.boot.dev/courses/learn-sql)
___ 

### What is Gator? 
It is an RSS feed aggregator in TypeScript! It is a CLI tool that allows users to:
* Add RSS feeds from across the internet to be collected
* Store the collected posts in a PostgreSQL database
* Follow and unfollow RSS feeds that other users have added
* View summaries of the aggregated posts in the terminal, with a link to the full post
___

### Project Main Technology(ies)
##### Main Language 
* `TypeScript`
##### Node Modules 
* `postgres`: Dealing with `Postgres` Database in `Node.js`.
* `fast-xml-parser`: Parsing `XML` Documents.
* `drizzle-orm`, `drizzle-kit`: Lightweight, TypeScript Object-Relational Mapper (ORM) designed for SQL databases. 
___

### Project Architecture
* **`src`**: The project source code as the following: 
    * **`lib/db`**: The database code as the following:
        * **`schema.ts`**: Defining the database schema. 
        * **`index.ts`**: Defining the database's connection. 
        * **`queries`**: Adding the CURD operations functions for each table. 
    * **`config.ts`**: Dealing with the configuration file. 
    * **`commands.ts`**: Implementing the handlers of the commands. 
    * **`middleware.ts`**: Adding a middleware for getting the logged in user. 
    * **`index.ts`**: The project entry point. 
    * **`rss.ts`**: Fetching and parsing XML document. 
    * **`utils.ts`**: Adding some helper functions. 
* **`drizzle.config.ts`**: The database configuration file. 
___ 

### How to run it? 
* **Requirements:** 
    * `Node.js`.
    * `Postgres` Database.  
    * `.gatorconfig.json` configuration file at `~/.gatorconfig.json` as the following: 
```json
{
    "db_url": "postgres-db-url"
} 
```
* **Commands:** 
```shell 
git clone https://github.com/najat-mansour/gator.git
cd gator 
npm install
npm start
```
___

### Commands Table
| Command Name | Parameters (if any) | Example | Purpose |
|-------------|---------------------|----------|----------|
| login | username | `npm run start login najat` | Log in to a specific user account |
| register | username | `npm run start register najat` | Register a new user |
| reset | – | `npm run start reset` | Delete all users from the database |
| users | – | `npm run start users` | List all users in the database |
| agg | time between requests (e.g., 3m, 10s) | `npm run start agg 3m` | Fetch and parse recent feeds periodically and store them in the `posts` table |
| addFeed | feed-name, feed-url | `npm run start addFeed feed-name feed-url` | Add a new feed to the `feeds` table |
| feeds | – | `npm run start feeds` | List all feeds in the database |
| follow | feed-url | `npm run start follow feed-url` | Follow a feed |
| following | – | `npm run start following` | List all feeds followed by the current user |
| unfollow | feed-url | `npm run start unfollow feed-url` | Unfollow a feed |
| browse | limit | `npm run start browse 2` | List a limited number of posts for the current user |
___

### Author

&copy; Najat Mansour - March. 2026