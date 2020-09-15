// Heroku
const exp = require('express'), app = exp(), http = require('http');
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function (){ console.log('Node app is running on port', app.get('port'))});
// Discord
const fs = require('fs'), Discord = require('discord.js'), cli = new Discord.Client(), token = process.env.TOKEN;
cli.login(token);

cli.on('ready', () => {
	setInterval(() => {
		http.get('http://tonperbot.herokuapp.com');
	}, 300000);
});
cli.on('message', (data) => {
	if (!data.content.startsWith('!!') || data.channel.type == 'dm' || data.author.bot) return;
	const args = data.content.substr(2).split(' ');

	switch(args[0].toLowerCase()){
		case `j'ai pas rêvé, j'me réveille`:
			return data.channel.send(``, {files: ['./image/0.jpg']});
			break;
		case 'pas tout à fait comme la veille':
			return data.channel.send(``, {files: ['./image/1.jpg']});
			break;
		case `paranoïaque, comme d'habitude`:
			return data.channel.send(``, {files: ['./image/2.jpg']});
			break;
		case 'help':
			return require('./cmds/help.js')(cli, data);
			break;
		case 'ping':
			return require('./cmds/ping.js')(cli, data);
			break;
		case 'coinflip':
			return require('./cmds/coinflip.js')(cli, data);
			break;
		case 'convivial':
			return require('./cmds/convivial.js')(cli, data);
			break;
		case 'say':
			return require('./cmds/say.js')(cli, data);
			break;
		case 'connect4':
			return require('./cmds/connect4.js')(cli, data);
			break;
		case 'disquette':
			return require('./cmds/disquette')(cli, data);
			break;
		default:
			return data.channel.send(`ça existe pas enculé`);
			break;
	}
})