const embed = {
	color: 3447003,
	author: { name: "Liste de commands pour tonper" },
	fields : [
		{ name: "Information sur une commande spécifique", value: "-help <nom>" },
		{ name: "Autre", value: "help, pausecolor, ping, coinflip, say, disquette, convivial connect4" },
	]
}

async function help(cli, data){
	const args = data.content.substr(1).split(' ');
	switch(args[1]){
		case 'ping':
			return data.channel.send("```Commande ping:\nbah c'est un ping enfoiré\n-ping```");
			break;
		case 'coinflip':
			return data.channel.send("```Commande coinflip:\nc'est un pile ou face quoi\n-coinflip```");
			break;
		case 'pausecolor':
			return data.channel.send("```Commande pausecolor:\narrêter le multicolore du role du serveur\n-pausecolor```");
			break;
		case 'connect4':
			return data.channel.send("```Commande connect4:\npuissance4\n-connect4 <@qqn>```");
			break;
		case 'disquette':
			return data.channel.send("```Commande disquette:\n bah c une disket\n-disquette <@qqn>```");
			break;
		case 'convivial':
			return data.channel.send("```Commande convivial:\non ramene de la famille d amis fin c tres convivial\n-convivial```");
			break;
		case 'say':
			return data.channel.send("```Commande say:\nBah un say fdp\n-say <msg>```");
			break;
		default:
			return data.channel.send({ embed });
			break;
	}
}

module.exports = help;