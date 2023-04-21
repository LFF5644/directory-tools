const fs=require("fs");

const sub=process.platform==="win32"?"\\":"/";

function getFiles(dir){
	let directories=[dir];
	let foundDirectories;
	const files=[];
	do{
		let scannedDirectories=[];
		foundDirectories=[];
		for(const directory of directories){
			scannedDirectories.push(directory);
			let itemsInDirectory;
			try{
				itemsInDirectory=fs.readdirSync(directory);
			}catch(e){
				console.log("cant list directory: "+directory,e.code);
				continue;
			}
			for(let item of itemsInDirectory){
				item=directory+item;
				let stat;
				try{
					stat=fs.lstatSync(item);
				}catch(e){
					console.log("cant get item infos: "+item,e.code);
					continue;
				}
				if(stat.isFile()) files.push(item);
				else if(stat.isDirectory()) foundDirectories.push(item+sub);
				else console.log("unknown item: "+item);
			}
		}
		directories=[
			...directories.filter(directory=>
				!scannedDirectories.includes(directory)
			),
			...foundDirectories,
		];
	}
	while(foundDirectories.length>0);
	return files;
}
function filterFiles(files,types){
	const emptyType=(
		types.includes("")||
		types.includes(false)||
		types.includes(null)||
		types.includes(undefined)
	);
	return files.filter(item=>
		types.includes(item.split(".").pop())||
		(
			emptyType&&
			!item.includes(".")
		)
	);
}

module.exports={
	getFiles,
	filterFiles,
};
