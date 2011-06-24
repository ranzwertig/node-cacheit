var fs = require('fs'),
    Em = require('events').EventEmitter,
    util = require('util'),
    mime = require('./mime').mimes,
    CFile = require('./cachetypes/cfile').CFile;

var CacheIt = function(settings){
    if(typeof settings === 'undefined'){
        var settings = {};
    }
    this.maxSize = settings.maxCacheSize || 0;
    this.maxAge = settings.maxCacheAge || 0;
    this.cacheSize = 0;
    this.cache = {};
};

CacheIt.prototype.mime = function(p){
    var m = p.match(/([^\/^\.]+)(\.[^\.]+)$/);
    var mimeType = 'text/plain';
    var ext = '.txt';
    if(m){
        if(typeof mime[m[2]] !== 'undefined'){
            ext = m[2];
            mimeType = mime[m[2]];
        }
    }
    return {
        mime: mimeType,
        ext: ext
    };
};

CacheIt.prototype.readFile = function(p, cb){
    if(typeof this.cache[p] === 'undefined'){
        var co = new CFile(p);
        var m = this.mime(p);
        co.mime = m.mime;
        co.extension = m.ext;
        var t = this;
        fs.readFile(p, function(err, data){
            if(!err){
                co.data = data;
                co.size = data.length;
                co.lastRead = (new Date).getTime();
                if(t.cacheSize + data.length < t.maxSize || t.maxSize === 0){
                    co.cached = true;
                    t.cache[p] = co;
                    t.cacheSize += data.length;
                    cb(false, data);
                }
            }
            else{
                cb(err,false);
            }
        });
    }
    else{
        cb(false, this.cache[p].data);
    }
};

CacheIt.prototype.fileStream = function(p, cb){
    if(typeof this.cache[p] === 'undefined'){
        var co = new CFile(p);
        var m = this.mime(p);
        co.mime = m.mime;
        co.extension = m.ext;
        var rs = fs.createReadStream(p);
        rs.on('error',function(err){
            cb(err)
        });
        
        var s = 0;
        var t = this;
        rs.on('data',function(d){
            s += d.length;
            co.data.push(d);
        });
        
        rs.on('close',function(){
            co.size += s;
            co.lastRead = (new Date).getTime();
            if(t.cacheSize + s < t.maxSize || t.maxSize === 0){
                co.cached = true;
                t.cache[p] = co;
                t.cacheSize += s;
            }
            cb(false, co);
        });
    }
    else{
        cb(false, this.cache[p]);
    }
};

CacheIt.prototype.remove = function(key, cb){
    delete this.cache[key];
    if(typeof cb === 'function'){
        cb(false,{deleted:key});
    }
};

CacheIt.prototype.flush = function(){
    this.cacheSize = 0;
    this.cache = {};
};

exports.CacheIt = CacheIt;