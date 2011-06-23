var fs = require('fs'),
    Em = require('events').EventEmitter,
    util = require('util'),
    sys = require('sys');

var Co = function(type, key){
    this.type = type;
    this.key = key;
    this.created = (new Date).getTime();
    this.size = 0;
    this.lastRead = 0;
    this.data = [];
};
util.inherits(Co, Em);

Co.prototype.stream = function(ws){
    for(var i = 0; i < this.data.length; i += 1) {
        ws.write(this.data[i]);   
    }
    var l = this.data.length;
    var i = 0;
    var w = true;
    ws.on('drain',function(){
        w = true;
    });
    
    while(i < l){
        if(w){
            if(ws.write(this.data[i])){
                i += 1;
            }
            else{
                w = false;
            }
        }
    }
    ws.end();
}


var DataStore = function(){
  this.cache = {};
};

DataStore.prototype.file = function(p, cb){
    if(typeof this.cache[p] === 'undefined'){
        var co = new Co('file', p);
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
            t.cache[p] = co;
            cb(false, co);
        });
    }
    else{
        cb(false, this.cache[p]);
    }
}

DataStore.prototype.remove = function(key, cb){
    delete this.cache[key];
    if(typeof cb === 'function'){
        cb(false,{deleted:key});
    }
};
exports.DataStore = DataStore;