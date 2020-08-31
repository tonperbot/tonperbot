async function ping(cli, data){
	var coin = Math.floor(Math.random() * Math.floor(2));
	coin == 1 ? data.channel.send(`Face!`) : data.channel.send(`Pile!`);
}

module.exports = ping;