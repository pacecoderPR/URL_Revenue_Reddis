// const redis = require('redis');

// // Create a Redis client with environment variables
// const client = redis.createClient({
//   socket: {
//     host: process.env.REDIS_HOST ,
//     port: process.env.REDIS_PORT 
//   },
// });

// console.log("Initializing Redis client...");

// client.on('error', (err) => {
//   console.error('Redis Client Error:',"Please read the comments of redisClient.js file in Utils folder");
// });

// (async () => {
//   try {
//     await client.connect(); // Explicitly connect the client
//     console.log("Redis client connected successfully");
//   } catch (err) {
//     console.error("Error connecting Redis client:", err);
//   }
// })();

// module.exports = client;





/*
Use below code for the local environment while the above code is for docker environment

*/
const redis = require('redis');

const client = redis.createClient({

  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});
console.log("redis is running");
client.on('error', (err) => console.error('Redis Client Error', "Please read the comments of redisClient.js file in Utils folder"));

module.exports = client;