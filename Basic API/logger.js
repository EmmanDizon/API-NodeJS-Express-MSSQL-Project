var url = 'http://mylogger.io/log';

function log(message){
    //send an HTTP request
    console.log('Hi ' + message);

}

module.exports = {log: log, endPoint: url}