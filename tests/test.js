var Cache = require('../src/cacheit').CacheIt;

var ds = new Cache();

var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    if(req.url != '/favicon.ico'){
        console.time('file request');
        ds.file('./tests/testdata_small.json',function(err, cacheElement){
            if(err){
                console.log(err);
                res.end();
            }
            else{
                console.log(cacheElement.size);
                cacheElement.send(res, function(err){
                    res.end();
                    console.timeEnd('file request');
                });
                /*var utc = new Date(cacheElement.lastRead);
                res.write(utc.toUTCString());
                res.end();*/
            }
        });   
    }
    else{
        res.end();
    }
  
}).listen(process.env.C9_PORT, "0.0.0.0");