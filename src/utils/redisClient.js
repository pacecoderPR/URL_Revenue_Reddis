const redis = require('redis');


const isDocker = process.env.USE_DOCKER === 'true'; // Set this environment variable to "true" when using Docker

const client = redis.createClient({
  socket: isDocker
    ? { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT } 
    : undefined, 
  host: isDocker ? undefined : process.env.REDIS_HOST,
  port: isDocker ? undefined : process.env.REDIS_PORT,
});

console.log("Initializing Redis client...");

client.on('error', (err) => console.error('Redis Client Error', err));


(async () => {
  try {
    await client.connect();
    console.log("Redis client connected successfully");
  } catch (err) {
    console.error("Error connecting Redis client:", err);
  }
})();

module.exports = client;
