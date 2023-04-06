const getDirFiles=require("./index");

process.stdout.write("Datei Path Eingeben!\n$ ");

process.stdin.on("data",buffer=>{
	const path=(buffer
		.toString("utf-8")
		.trim()
	);
	const files=getDirFiles.getFiles(path);
	process.stdout.write(`${files.length} Dateien Gefunden!\n${files.map(item=>item+"\n").join("")}$ `);
});
