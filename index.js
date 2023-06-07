const fs=require("fs");

const sub=process.platform==="win32"?"\\":"/";

function getFiles(dir){
	if(!dir.endsWith(sub)) dir+=sub;
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
function filterFiles(files,types=[]){
	const emptyType=types&&(
		types.includes("")||
		types.includes(false)||
		types.includes(null)||
		types.includes(undefined)
	);
	return files.filter(item=>
		(types&&types.includes(item.split(".").pop()))||
		(
			emptyType&&
			!item.includes(".")
		)
	);
}
function makeDirectory(path){
	//console.log("creating directory",path);
	try{
		fs.mkdirSync(path);
	}catch(e){
		return false;
	}
	return true;
}
function makeDirectoriesInPath(path){
	for(const index in path.split(sub)){
		const createDir=(path
			.split(sub)
			.filter((item,i)=>i<=index)
			.join(sub)
		);
		//console.log(index,createDir);
		makeDirectory(createDir);
	}
}
function getFolderItems(folder){
	if(!folder.endsWith("/")) folder+="/";
	let items;
	try{
		items=fs.readdirSync(folder);
	}catch(e){
		console.log("cant read folder/directory");
		return null;
	}
	const newItems=[];
	for(const item of items){
		const itemPath=folder+item;
		let stat;
		try{
			stat=fs.lstatSync(itemPath);
		}catch(e){
			console.log("cant get informations about "+item+" add to unknown");
			newItems.push([item,"unknown"]);
			continue;
		}
		if(stat.isBlockDevice()) newItems.push([item,"blockDevice"]);
		else if(stat.isCharacterDevice()) newItems.push([item,"characterDevice"]);
		else if(stat.isDirectory()) newItems.push([item,"directory"]);
		else if(stat.isFile()) newItems.push([item,"file"]);
		else if(stat.isSocket()) newItems.push([item,"socket"]);
		else if(stat.isSymbolicLink()) newItems.push([item,"symbolicLink"]);
		else newItems.push([item,"other"]);
	}
	return newItems;
}

module.exports={
	filterFiles,
	getFiles,
	getFolderItems,
	makeDirectoriesInPath,
	makeDirectory,
};
