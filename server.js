const http = require("http");
const redis = require("redis")

const client = redis.createClient({
  url: "redis://redis-service:6379"
});

client.connect();

const message = process.env.MESSAGE || "Default Message"
const apikey = process.env.API_KEY || "No API Key"

const server = http.createServer(async (req, res) => {
  let count = await client.incr("counter");

  res.end(`${message} | Count: ${count} | API_KEY: ${apikey}\n`);
});

server.listen(3000);

