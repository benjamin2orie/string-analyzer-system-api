
# Description:
 A RESTful API that analyzes strings and stores their computed properties. Built with Node.js, TypeScript, Express, MongoDB, and Mongoose using decorators via @typegoose/typegoose.


## features:
  Analyze strings for length, word count, palindrome status, unique characters, and character frequency

    Generate SHA-256 hash for identification

    Store and retrieve analyzed strings

    Filter strings using query parameters

    Natural language filtering (e.g. "all single word palindromic strings")

    Delete strings by value

# Dependencies:
 express
 mongose,
 @typegoose/typegoose,
 typescript,
 nodemon,
 ts-node,
 dotenv,
 cors
 crpto

## Getting started:
 1. Clone the respository  by running the following commands:
 git clone https://github.com/your-username/string-analyzer-service.git
 cd string-analyzer-service
 npm install
 npm run dev // to start the dev server 


## .env 
PORT = 4000
DB_URI = <your mongo db connection string>

# servers:
dev_server:http://localhost:4000
prod_server: https://string-analyzer-system-api-production.up.railway.app

## Swagger doc url:
 api-doc: [https://string-analyzer-system-api-production.up.railway.app/api-docs]


