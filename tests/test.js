var Cache = require('../src/cacheit').CacheIt;

var ds = new Cache();

var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    if(req.url == '/readfile'){
        console.time('readFile request');
        ds.readFile('./tests/testdata.json',function(err,data){
            res.write(data);
            res.end();
            console.timeEnd('readFile request');
        });
    }
    else{
        res.end();
    }
  
}).listen(process.env.C9_PORT, "0.0.0.0");