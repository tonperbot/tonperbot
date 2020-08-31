async function ping(cli, data){
	const pingMsg = await data.channel.send('Actualisation...');
	await pingMsg.edit(`${pingMsg.createdTimestamp - data.createdTimestamp}ms`);
}

module.exports = ping;