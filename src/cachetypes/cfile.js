var CFile = function(key){
    this.type = 'file';
    this.key = key;
    this.created = (new Date).getTime();
    this.size = 0;
    this.lastRead = 0;
    this.data = [];
    this.cached = false;
    this.extension = false;
    this.mime = false;
};

CFile.prototype.pump = function(res, cb){
    var err = false;
    if(this.data.length > 0){
        for(var i = 0; i < this.data.length; i += 1){
            res.write(this.data[i]);
        }
    }
    else{
        err = {
            message: 'Empty data for key: '+this.key
        };
    }
    cb(err,res);
};

CFile.prototype.send = function(res, cb){
    res.writeHead(200,{
        'Content-Type': this.mime,
        'Cache-Control': 'max-age',
        'Last-Modified': (new Date(this.lastRead)).toUTCString()
    });
    var err = false;
    if(this.data.length > 0){
        for(var i = 0; i < this.data.length; i += 1){
            res.write(this.data[i]);
        }
    }
    else{
        err = {
            message: 'Empty data for key: '+this.key
        };
    }
    cb(err,res);
};

exports.CFile = CFile;