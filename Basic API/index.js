// require('./subFolder/Logger') if the folder that needs to call is on a subfolder
// require('../Logger') if the folder that needs to call is a parent folder
// the reason why const over var is to avoid overwriting the variable, if ever may lalabas na error w/c assignment to constant variable or attempting to override logger w/c a constant variable. jshint index.js


/*
const logger = require('./logger');
const os = require('./os');

var  totalMemory = os.totalmem();
var freeMemory = os.freemem();


console.log(logger.endPoint);
*/


const http = require('http');
const server = http.createServer(function(req, res){
    if(req.url === '/'){
        res.write('hello world');
        res.end();
    }

    if(req.url === '/api/courses'){
        res.write(JSON.stringify([1, 2, 3]));
        res.end();
    }
});


server.on('connection', function(socket){
console.log('new connection...');

});

server.listen(3000);

console.log('listening on port 3000....');


