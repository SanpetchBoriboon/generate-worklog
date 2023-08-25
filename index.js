const Worklog = require("./src/worklog");
const fs = require("fs");

const importFolder = fs.readdirSync("./src/worklog/import");

function Main() {
	for (const fileName of importFolder) {
		new Worklog().generateWorklog(fileName);
	}
}

Main();
