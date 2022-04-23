const { TextFile } = require('./TextFile.js');
class JSONFile {
    constructor(filename) {
        this.adapter = new TextFile(filename);
    }
    async read() {
        const data = await this.adapter.read();
        return data === null ? null : JSON.parse(data);
    }
    write(obj) {
        return this.adapter.write(JSON.stringify(obj, null, 2));
    }
}
module.exports = { JSONFile };
