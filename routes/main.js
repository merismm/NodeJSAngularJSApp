var fs = require('fs');
module.exports= function(app){
    app.post("/writeToFile",function(req,res,next){
        fs.writeFile("files/jsonOutput.txt",JSON.stringify(req.body), function(err) {
            if(err) {
                return console.log(err);
            }
        });

    });
};

