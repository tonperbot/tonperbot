async function say(cli, data){
	let msg = data.content.substr(5);
	await data.delete();
	await data.channel.send(msg);
}

module.exports = say;