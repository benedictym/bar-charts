const vm = require("vm");
const fs = require("fs");
module.exports = function(path, context) {
    context = context || {};
    const data = fs.readFileSync(path);
    vm.runInNewContext(data, context, path);
    return context;
}


