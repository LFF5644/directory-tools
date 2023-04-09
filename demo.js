const getDirFiles=require("./index");

process.stdout.write("Datei Path Eingeben!\n$ ");

process.stdin.on("data",buffer=>{
	const path=(buffer
		.toString("utf-8")
		.trim()
	);
	if(path==="q"){process.exit(0)}
	const files=getDirFiles.getFiles(path);
	if(!files){
		process.stdout.write(`Nicht Gefunden!\n$ `);
		return;
	}
	process.stdout.write(`${files.length} Dateien Gefunden!\n${files.map(item=>item+"\n").join("")}$ `);
});
