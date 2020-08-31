async function connect4Requests(cli, data){
	if (!data.mentions.users.first() || data.mentions.users.first().id == data.author.id) return data.channel.send(`mentionne qqn bg`);
	if (data.mentions.users.first().bot) return data.channel.send(`duel contre le bot pas encore dispo bg`);
	const askMsg = await data.channel.send(`${data.mentions.users.first()}, tu veux faire un puissance 4 contre ${data.author} ?`);
	await askMsg.react('✅');
	await askMsg.react('❌');

	askMsg.awaitReactions((reaction, user) => user.id == data.mentions.users.first().id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌'), { max: 1, time: 30000 }).then(async collected => {
		if (collected.first().emoji.name == '✅'){
			await askMsg.delete();
			const gameMsg = await data.channel.send(`Quel plateau utiliser ?`);
			await gameMsg.react('1⃣');
			//await gameMsg.react('2⃣');
			gameMsg.awaitReactions((reaction, user) => user.id == data.mentions.users.first().id && (reaction.emoji.name == '1⃣' || reaction.emoji.name == '2⃣'), { max: 1, time: 0 }).then(async collected => {
				if (collected.first().emoji.name == '1⃣'){
					plateau = 1;
					return connect4Game(cli, data, data.author.id, data.mentions.users.first().id, data.member.displayName, data.mentions.members.first().displayName, gameMsg, plateau);
				} else if (collected.first().emoji.name == '2⃣'){
					plateau = 2;
					return connect4Game(cli, data, data.author.id, data.mentions.users.first().id, data.member.displayName, data.mentions.members.first().displayName, gameMsg, plateau);
				}
			});
		} else {
			await askMsg.delete();
			return data.channel.send(`Invitation refusée par ${data.mentions.users.first()}`);
		}
	}).catch(async () => {
		await askMsg.delete();
		return data.channel.send(`Aucune réponse, invitation annulée.`);
	});
}

async function generateBoard(cli, data, player1, player2, player1Name, player2Name, gameMsg, gameBoard, currentPlayerName, plateau){
	let gameBoardVisual = ``;

	if (plateau == 1){
		gameBoard.forEach(row => {
			row.forEach(dot => {
				if (dot == 0) gameBoardVisual += `⚫`;
				if (dot == 1) gameBoardVisual += `🔴`;
				if (dot == 2) gameBoardVisual += `🟡`;
				if (dot == 3) gameBoardVisual += `⭐`;
			})
			gameBoardVisual += `\n`;
		})
	}


	let gameEmbed = {
		"title": `Connect4: ${player1Name} vs ${player2Name}`,
		"description": `${gameBoardVisual}`,
		"color": 12087816,
		"footer": {
			"text": `Au tour de ${currentPlayerName}`
		}
	}

	return gameEmbed;
}

var numberEmojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣'];
var currentPlayer, currentPlayerName, winner = undefined, winnerName = undefined;

async function connect4Game(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau){

	await gameMsg.reactions.removeAll().catch(error => console.error('Failed to remove reactions: ', error));

	var firstToPlay = Math.floor(Math.random() * Math.floor(2));
	firstToPlay == 1 ? currentPlayer = player1 : currentPlayer = player2; played = true;;
	firstToPlay == 1 ? currentPlayerName = player1Name : played = true; currentPlayerName = player2Name;

	let gameBoard = [
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0]];

	let gameEmbed = await generateBoard(cli, data, player1, player2, player1Name, player2Name, gameMsg, gameBoard, currentPlayerName, plateau);	
	await gameMsg.edit('', { embed: gameEmbed });
	await numberEmojis.forEach(number => { gameMsg.react(number); });

	// partie
	await connect4Round(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, undefined, undefined, gameEmbed, numberEmojis, currentPlayer, gameBoard);

}

async function placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, y, x, currentPlayer, player1, player2){
	let numberToPlace;
	if (currentPlayer == player1) { numberToPlace = 1 } else { numberToPlace = 2; };
	if (gameBoard[y][x] == 0){ gameBoard[y][x] = numberToPlace; };
	if (currentPlayer == player1){ currentPlayer = player2; } else { currentPlayer = player1; };
	if (currentPlayer == player1){ currentPlayerName = player1Name; } else { currentPlayerName = player2Name; };
		
	let gameEmbed = await generateBoard(cli, data, player1, player2, player1Name, player2Name, gameMsg, gameBoard, currentPlayerName, plateau);	
	await gameMsg.edit('', { embed: gameEmbed });
}

async function checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard){
// player1 wins
	// horizontal wins
	for (var y=0; y <= 5; y++){
		if (!winner){
		count = 0;
		winslots = [];

		for (var x=0; x <= 6; x++){
			if (gameBoard[y][x] == 1){ 
				winslots.push([y, x]);
				count++;
			}
			if (gameBoard[y][x] == 2){
				winslots.length = 0;
				count = 0;
			}
			if (count >= 4){
			winner = player2;
			winnerName = player2Name;
		}
		}

		if (count >= 4){
			winner = player2;
			winnerName = player2Name;
		}
	}
	}

	//vertical wins
	for (var x=0; x <= 6; x++){
		if (!winner){
		count = 0;
		winslots = [];
		
		for (var y=0; y <= 5; y++){
			if (gameBoard[y][x] == 1){ 
				winslots.push([y, x]);
				count++;
			}
			if (gameBoard[y][x] == 2){
				winslots.length = 0;
				count = 0;
			}
			if (count >= 4){
			winner = player2;
			winnerName = player2Name;
		}
		}

		if (count >= 4){
			winner = player2;
			winnerName = player2Name;
		}
	}
	}

	//diagonal wins



// player2 wins
	// horizontal wins
	for (var y=0; y <= 5; y++){
		if (!winner){
		count = 0;
		winslots = [];
		
		for (var x=0; x <= 6; x++){
			if (gameBoard[y][x] == 2){ 
				winslots.push([y, x]);
				count++;
			}
			if (gameBoard[y][x] == 1){
				winslots.length = 0;
				count = 0;
			}
			if (count >= 4){
			winner = player2;
			winnerName = player2Name;
		}
		}

		if (count >= 4){
			winner = player2;
			winnerName = player2Name;
		}
		}
	}

	//vertical wins
	for (var x=0; x <= 6; x++){
		if (!winner){
		count = 0;
		winslots = [];
		
		for (var y=0; y <= 5; y++){
			if (gameBoard[y][x] == 2){ 
				winslots.push([y, x]);
				count++;
			}
			if (gameBoard[y][x] == 1){
				winslots.length = 0;
				count = 0;
			}
			if (count >= 4){
				winner = player2;
				winnerName = player2Name;
			}
		}

		if (count >= 4){
			winner = player2;
			winnerName = player2Name;
		}
		}
	}

	//diagonal wins





	// set winslots
	if (winner != undefined){
		await winslots.forEach(coord => {
			console.log(coord);
			gameBoard[coord[0]][coord[1]] = 3;
		});
	};

	// victoire
	if (winner != undefined){
		await gameMsg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
		await gameMsg.react('🎉');
		await gameMsg.react('🎊');
		await gameMsg.react('👏');

		let gameEmbed = await generateBoard(cli, data, player1, player2, player1Name, player2Name, gameMsg, gameBoard, currentPlayerName, plateau);
		gameEmbed.footer.text = `Victoire de ${winnerName}`;
		console.dir(winslots);
		return gameMsg.edit('', { embed: gameEmbed });
	};
}

async function connect4Round(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard){
		const gameMsgCollector = gameMsg.createReactionCollector((reaction, user) => (user.id == player1 || user.id == player2) && (numberEmojis.includes(reaction.emoji.name)), { time: 0 });
		gameMsgCollector.on('collect', async (reaction, user) => {
			switch(reaction.emoji.name){
				case '1⃣':
					await gameMsg.reactions.cache.get('1⃣').users.remove(user).catch(error => console.error(err));
					if (user.id == currentPlayer){
						if (gameBoard[5][0] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 5, 0, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[4][0] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 4, 0, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[3][0] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 3, 0, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[2][0] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 2, 0, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[1][0] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 1, 0, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[0][0] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 0, 0, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard); }
					}
					break;
				case '2⃣':
					await gameMsg.reactions.cache.get('2⃣').users.remove(user).catch(error => console.error(err));
					if (user.id == currentPlayer){
						if (gameBoard[5][1] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 5, 1, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[4][1] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 4, 1, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[3][1] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 3, 1, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[2][1] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 2, 1, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[1][1] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 1, 1, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[0][1] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 0, 1, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard); }
					}
					break;
				case '3⃣':
					await gameMsg.reactions.cache.get('3⃣').users.remove(user).catch(error => console.error(err));
					if (user.id == currentPlayer){
						if (gameBoard[5][2] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 5, 2, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[4][2] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 4, 2, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[3][2] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 3, 2, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[2][2] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 2, 2, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[1][2] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 1, 2, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[0][2] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 0, 2, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard); }
					}
					break;
				case '4⃣':
					await gameMsg.reactions.cache.get('4⃣').users.remove(user).catch(error => console.error(err));
					if (user.id == currentPlayer){
						if (gameBoard[5][3] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 5, 3, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[4][3] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 4, 3, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[3][3] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 3, 3, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[2][3] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 2, 3, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[1][3] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 1, 3, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[0][3] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 0, 3, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard); }
					}
					break;
				case '5⃣':
					await gameMsg.reactions.cache.get('5⃣').users.remove(user).catch(error => console.error(err));
					if (user.id == currentPlayer){
						if (gameBoard[5][4] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 5, 4, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[4][4] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 4, 4, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[3][4] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 3, 4, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[2][4] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 2, 4, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[1][4] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 1, 4, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[0][4] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 0, 4, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard); }
					}
					break;
				case '6⃣':
					await gameMsg.reactions.cache.get('6⃣').users.remove(user).catch(error => console.error(err));
					if (user.id == currentPlayer){
						if (gameBoard[5][5] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 5, 5, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[4][5] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 4, 5, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[3][5] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 3, 5, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[2][5] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 2, 5, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[1][5] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 1, 5, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[0][5] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 0, 5, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard); }
					}
					break;
				case '7⃣':
					await gameMsg.reactions.cache.get('7⃣').users.remove(user).catch(error => console.error(err));
					if (user.id == currentPlayer){
						if (gameBoard[5][6] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 5, 6, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[4][6] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 4, 6, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[3][6] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 3, 6, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[2][6] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 2, 6, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[1][6] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 1, 6, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard);
						} else if (gameBoard[0][6] == 0){ await placePointBoard(cli, gameBoard, data, player1Name, player2Name, plateau, currentPlayerName, numberEmojis, gameMsg, 0, 6, currentPlayer, player1, player2); return; checkWin(cli, data, player1, player2, player1Name, player2Name, gameMsg, plateau, currentPlayerName, winner, winnerName, gameEmbed, numberEmojis, currentPlayer, gameBoard); }
					}
					break;
			}
		});
}

module.exports = connect4Requests;