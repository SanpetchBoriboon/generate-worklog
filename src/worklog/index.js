const XLSX = require("xlsx");
const dateFns = require("date-fns");

class Worklog {
	constructor() {
	}

	generateWorklog(fileName) {
		try {
			const importFile = "src/worklog/import/" + fileName;
			const workbookExcel = XLSX.readFile(importFile);
			const sheetName = workbookExcel.SheetNames[0];
			const sheetData = XLSX.utils.sheet_to_json(workbookExcel.Sheets[sheetName]);

			const worklogSheet = sheetData.map((col) => {
				let timeSpent = col["Time Spent (seconds)"] / 3600;
				const worklogCol = {};
				worklogCol["Name"] = col["Author"];
				worklogCol["ISSUEKEY"] = col["Issue Key"];
				worklogCol["Subtask Name"] = col["Issue Summary"];
				worklogCol["Description"] = col["Comment"];
				worklogCol["Date"] = dateFns.format(new Date(col["Started at"]), "dd/MM/yyyy");
				worklogCol["Time Spent"] = parseFloat(timeSpent).toFixed(1) + "h";
				return worklogCol;
			});

			const workbook = XLSX.utils.book_new();
			const worksheet = XLSX.utils.json_to_sheet(worklogSheet);
			XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
			const yaerMonth = fileName.split("_")[1].split("-");
			const fileNameExport = `Report JiraWorkLog - ${yaerMonth[0]}_${yaerMonth[1]}`;
			const exportFile = "src/worklog/export/" + fileNameExport + ".xlsx";
			XLSX.writeFile(workbook, exportFile);

			console.log("Excel file has been successfully created:", exportFile);
		} catch (error) {
			console.error("Error tranform data :", error);
		}
	}
}

module.exports = Worklog;
