Hello, everyone. Here you will find a description of the application, instructions on how to install Redis and connect to a server, and major features of this incredible tool.
## Use Case

**redis-poc** is a full-stack application built with Node.js, Express, TypeScript, Vue.js, and Redis as a cache database. It utilizes [NewsAPI](https://newsapi.org/) to create a real-time news search app that fetches live articles from various websites. The primary goal is to demonstrate the advantages of using Redis in your application to store frequently accessed data, thereby increasing speed for faster responses. When a client makes a request, the backend searches for articles matching the user's criteria. If the article is stored in Redis, it's retrieved from the cache, enhancing performance. If no articles match the search criteria, the information is fetched from the News API.

## Workflow

1. The client requests live articles using various criteria such as keyword or phrase, date published, source domain, and language.
2. Upon clicking the 'Search' button, the frontend sends a request to the backend with the specified parameters.
3. The backend checks the Redis cache for articles matching the client's parameters and the required API key.
4. If the data is stored in Redis, it's processed and delivered.
5. If not, the backend requests data from the News API. After fetching the data, it's stored in Redis with a one-hour expiration.
6. Response time metrics are collected for each request.
7. The backend returns a JSON object containing the source (api or cache) and the articles.
8. The frontend displays the list of articles along with the response time and source. Users can navigate to the 'ArticleDetail' UI to read more about a specific article.

## Configuration

To set up Redis:

- Install Redis on your local computer. Note: It's not officially supported on Windows, but you can install it for development purposes.
- Enable WSL2 (Windows Subsystem for Linux) to run Linux binaries natively on Windows. [Follow these instructions](https://learn.microsoft.com/en-us/windows/wsl/install).
- Open a WSL terminal and run the following commands to install Redis:

```bash
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg 
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list 
sudo apt-get update 
sudo apt-get install redis 
```

- Start the Redis server and test your connection:

```bash
sudo service redis-server start 
redis-cli  
```

- If the output is `PONG`, the connection is successful.

To connect to Redis from your code:

- Install the Redis client library:

```bash
npm install redis 
```

- Connect to localhost on PORT 6379:

```javascript
import { createClient } from 'redis'; 
const client = createClient(); 
client.on('error', err => console.log('Redis Client Error', err)); 
await client.connect(); 
```

## Environment Variables

All sensitive information, such as the API key or backend URL, should be stored in environment variables.

## Redis features

Redis is more than just a cache; it's a powerful in-memory data store with a rich feature set that makes it an excellent choice for various use cases:

## Performance:
- **In-Memory Data Store:** Redis stores data in memory, enabling lightning-fast read and write operations compared to disk-based databases.
- **Sub-Millisecond Latency:** It offers sub-millisecond latency for read and write operations, ensuring quick responses even under high load conditions.

## Flexibility:
- **Support for Multiple Data Structures:** Redis supports various data structures such as strings, lists, sets, hashes, sorted sets with range queries, bitmaps, hyper loglogs, geospatial indexes, and streams. This versatility makes it suitable for a wide range of use cases.
- **Atomic Operations:** Redis allows atomic operations on these data types, enabling operations like push/pop elements, add/remove elements, perform server-side Lua scripting, and more.

## Scalability:
- **Redis Cluster:** Redis Cluster enables horizontal scaling by automatically sharding data across multiple Redis nodes, allowing it to handle large datasets and high traffic loads effectively.
- **Master-Slave Replication:** Redis supports master-slave replication, distributing read operations across multiple instances to increase read throughput and scalability.

## Persistence:
- **Durability Options:** Despite being an in-memory store, Redis offers options for data durability through persistence mechanisms.
  - *RDB (Redis Database):* Performs point-in-time snapshots of the dataset at specified intervals.
  - *AOF (Append Only File):* Logs every write operation received by the server, enabling the reconstruction of the dataset at server startup.
  - *No Persistence:* Persistence can be disabled entirely, useful for caching scenarios.
  - *RDB + AOF:* Both AOF and RDB can be combined in the same instance for enhanced durability.

## High Availability:
- **Redis Sentinel:** Provides high availability through monitoring, notifications, and automatic failover capabilities, ensuring system availability even in the event of node failures.
- **Redis Cluster:** Ensures that the system can continue operations seamlessly even when a few nodes fail, contributing to overall fault tolerance and reliability.

## Rich Ecosystem:
- **Extensive Client Libraries:** Redis has a vast ecosystem of client libraries available for various programming languages, making it easy to integrate with any application stack.
- **Management Tools:** Tools like RedisInsight offer a visual interface for database management, making it easier to monitor and manage Redis instances effectively.
- **Modules:** Redis modules extend its capabilities, allowing developers to add functionalities like full-text search (RedisSearch), graph database (RedisGraph), and more to their applications.

## Real-time Capabilities:
- **Pub/Sub Messaging:** Redis's pub/sub messaging system enables real-time communication between clients and servers, making it suitable for building real-time applications and messaging systems.
- **Redis Streams:** Redis Streams allows developers to build complex stream processing applications with features like consumer groups, making it ideal for event-driven architectures and real-time analytics.

## Redis Memory Footprint

- An empty instance uses ~3MB of memory.
- 1 million small key-value pairs use ~85MB of memory.
- 1 million keys representing objects with 5 fields use ~160MB of memory.

For more information, refer to the [Redis documentation](https://redis.io/documentation).
