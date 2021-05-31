var fs = require('fs');

var data = {}
data.table = []
for (i=0; i <26 ; i++){
   var obj = {
       id: i,
       square: i * i
   }
   data.table.push(obj)
}
fs.readFile ("dat1.txt", function(err, data) {
    if (err) throw err;
    console.log('complete');
    console.log(JSON.parse(data))
    }
)