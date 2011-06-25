var Cache = require('../src/cacheit').CacheIt;

var ds = new Cache();

var fs = require('fs'),
    util = require('util');

var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    if(req.url == '/httppump'){

        console.time('httpPump request');
        ds.httpPump('./tests/testdata.txt', res, function(err,data){
            res.end();
            console.timeEnd('httpPump request');
        });
        
    }
    if(req.url == '/readfile'){
        console.time('readFile request');
        ds.readFile('./tests/testdata.txt', function(err,data){
            res.write(data);
            res.end();
            console.timeEnd('readFile request');
        });
    }
    if(req.url == '/httpsend'){
        console.time('httpSend request');
        ds.readFile('./tests/testdata.txt', function(err,data){
            res.write(data);
            res.end();
            console.timeEnd('httpSend request');
        });
    }
    else{
        res.end();
    }
  
}).listen(process.env.C9_PORT, "0.0.0.0");