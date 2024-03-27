import { redisClient } from './redisClient';

async function testRedis() {
  await redisClient.set('key', 'value');
  const value = await redisClient.get('key');

  await redisClient.hSet('user-session:123', {
      name: 'John',
      surname: 'Smith',
      company: 'Redis',
      age: 29
  });

  let userSession = await redisClient.hGetAll('user-session:123');

  console.log(JSON.stringify(userSession, null, 2));
  console.log(JSON.stringify(value));
}

testRedis();


