const { TextFileSync } = require('./TextFileSync.js');
class JSONFileSync {
    constructor(filename) {
        this.adapter = new TextFileSync(filename);
    }
    read() {
        const data = this.adapter.read();
        return data === null ? null : JSON.parse(data);
    }
    write(obj) {
        this.adapter.write(JSON.stringify(obj, null, 2));
    }
}
module.exports = { JSONFileSync };
