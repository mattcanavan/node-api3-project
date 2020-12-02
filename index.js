// code away!

const server = require('./server');

const port = 3000;
server.listen(port, () => {
    console.log(`\n* Server Running on http://localhost:${port} *\n`);
})