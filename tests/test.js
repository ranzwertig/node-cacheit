var Cache = require('../src/cacheit').CacheIt;

var ds = new Cache();

var fs = require('fs'),
    util = require('util');

var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});

    if(req.url == '/httppump'){

        ds.httpPump('./tests/testdata.txt',res,function(err,d){
            res.end();
        });
        
    }
    else if(req.url == '/readfile'){

        ds.readFile('./tests/testdata.txt', function(err,data){
            res.write(data);
            res.end();
        });
        
    }
    else{
        res.end();
    }
  
}).listen(process.env.C9_PORT, "0.0.0.0");