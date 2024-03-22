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

## Why Redis?

Redis offers several advantages:

- **Performance**: Redis is an in-memory data store, providing lightning-fast data access.
- **Flexibility**: Supports various data structures and atomic operations.
- **Scalability**: Easily scales out using Redis Cluster for handling more load.
- **Persistence**: Offers options for data durability, including RDB and AOF persistence.
- **High Availability**: Redis Sentinel and Redis Cluster ensure high availability and fault tolerance.
- **Rich Ecosystem**: Extensive client libraries and tools like RedisInsight and modules extend its capabilities.
- **Real-time Capabilities**: Enables real-time communication and stream processing with Redis Streams.
- **Ease of Use**: Simple protocol and feature set make it easy to get started while being powerful enough for complex tasks.

## Redis Memory Footprint

- An empty instance uses ~3MB of memory.
- 1 million small key-value pairs use ~85MB of memory.
- 1 million keys representing objects with 5 fields use ~160MB of memory.

For more information, refer to the [Redis documentation](https://redis.io/documentation).
