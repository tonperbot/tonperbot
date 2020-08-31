async function disquette(cli, data){
	if (!data.mentions.users.first() || data.mentions.users.first().id == data.author.id) return data.channel.send(`mentionne qqn bg`);
	const disquettes = [
	`t la lumier de ma vi, vien on pass le 18 eme siecl ensembl`,
	`en amour pr toi les otr ont 3 canette g 4 ocean`,
	`dsl si jte sui dan la ru, mon papa m'a dit de poursuivr mé reve`,
	`mem en 0g, je serai tjrs attiré par toi`,
	`jsais bien nager dhabitud mais la jme noi dans tes yeu`,
	`vu que t'embrass pas les inconnus laiss moi me présenter`,
	`t bel comme la tour eiffel, je pass te voir pr le nouvel an`,
	`fais une évolution from madame to ma dame stp`,
	`t pas parfaite mais tes défauts sont charmants 👉👈`,
	`tu me dois de l'argent, tu vie dans mon coeur et tu paye pas de loyé`,
	`t celib moi ossi on sdate ?`,
	`t'as volé mon coeur, mtn vole mon nom de famille`];
	
	let disquetteValue = disquettes[Math.floor(Math.random() * Math.floor(disquettes.length))];
	let randomNumber = Math.floor(Math.random() * Math.floor(8));
	data.channel.send(`<@${data.mentions.users.first().id}> ${disquetteValue}`, {files: [`./disquettes/${randomNumber}.jpg`]});
}

module.exports = disquette;