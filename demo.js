const directoryTools=require("./index");

process.stdout.write("Befehl Eingeben!\n$ ");

process.stdin.on("data",buffer=>{
	const command=(buffer
		.toString("utf-8")
		.trim()
	);
	if(
		command==="q"||
		command==="exit"||
		command==="quit"||
		command==="close"||
		command==="stop"||
		command==="end"
	){
		console.log("\nProgram Geschlossen!");
		process.exit(0);
	}

	else if(command.startsWith("list ")){
		const path=command.substring("list ".length);
		const files=directoryTools.getFiles(path);
		if(!files){
			process.stdout.write(`Nicht Gefunden!\n$ `);
			return;
		}
		console.log(`${files.join("\n")}\n\n${files.length} Dateien Gefunden!`);
	}
	else if(command.startsWith("mkdirs ")){
		const path=command.substring("mkdirs ".length);
		directoryTools.makeDirectoriesInPath(path);
	}
	else console.log("Befehl nicht gefunden!");

	process.stdout.write("$ ");
});
