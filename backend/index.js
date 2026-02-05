// Entry point - replace with actual implementation
require('dotenv').config();

const fastify = require('fastify');
const server = fastify();

server.get('/', async (request, reply) => {
  return { message: 'Expense Tracker API' };
});

const PORT = process.env.PORT || 5000;

server.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});
