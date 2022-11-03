import Fastify from 'fastify';

import { users } from './users';

const fastify = Fastify({
  logger: true,
});
fastify.register(import('@fastify/cors'));
fastify.register(import('@fastify/multipart'), {
  addToBody: true,
});
fastify.register(import('@fastify/cookie'));

const verify = function (endpoint, requestBody, reply) {
  let result;

  if (requestBody.toLowerCase().includes('fuck')) {
    return reply.status(403).send('unresolved');
  }

  if (endpoint === '/uppercase') {
    result = requestBody.toUpperCase();
  } else if (endpoint === '/lowercase') {
    result = requestBody.toLowerCase();
  }

  return reply.send(result);
};

fastify.post('/uppercase', (request, reply) => {
  return verify('/uppercase', request.body, reply);
});

fastify.post('/lowercase', (request, reply) => {
  return verify('/lowercase', request.body, reply);
});

fastify.get('/user/:id', (request, reply) => {
  const { id } = request.params;
  if (id in users) {
    return reply.send(users[id]);
  } else {
    return reply.status(400).send('User not exist');
  }
});

fastify.get('/users', (request, reply) => {
  const { filter, value } = request.query;

  if (!filter || !value) {
    return reply.send(Object.values(users));
  }

  const result = Object.values(users).filter(
    (user) => String(user[filter]) === value
  );
  return reply.send(result);

  // if (filter && value) {
  //   const result = Object.values(users).filter(
  //     (user) => user[filter] == value
  //   );
  //   return reply.send(result);
  // } else {
  //   return reply.send(Object.values(users));
  // }
});

export default fastify;

// fastify.post('/uppercase', (request, reply) => {
//   return verify('/uppercase', requestBody, reply);
//   // if (request.body.toLowerCase().includes('fuck')) {
//   //   return reply.status(403).send('unresolved');
//   // } else {
//   //   return reply.send(request.body.toUpperCase());
//   // }
// });

// fastify.post('/lowercase', (request, reply) => {
//   if (request.body.toLowerCase().includes('fuck')) {
//     return reply.status(403).send('unresolved');
//   } else {
//     return reply.send(request.body.toLowerCase());
//   }
// });
