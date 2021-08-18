const http = require('http');
const { books, authors } = require('./src/constants');

const host = '0.0.0.0';
const port = 8000;

const requestListener = function (req, res) {
  res.setHeader("Content-Type", "application/json");
  switch (req.url) {
    case "/books":
      response.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.end(books);
      break
    case "/authors":
      response.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.end(authors);
      break
  }
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
