import { createClient } from "redis";
//
const client = createClient({
  port: 6379,
  host: "127.0.0.1",
  legacyMode: true,
});

//
client.connect();
//
client.on("connect", () => console.log("Redis Connected"));
//
client.on("error", (err) => console.log("Redis Client Error", err));
//

export default client;
