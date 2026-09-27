export default {
  async fetch(request: Request) {
    return Response.json({ message: 'hello' });
  },
};