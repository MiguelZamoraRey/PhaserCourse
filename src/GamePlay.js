GamePlayManager = {
	init: function(){//inicializa valores
		console.log('init');
	},
	preload: function(){//carga de recursos para el proyecto
		console.log('preload');
	},
	create: function(){//crea el juego
		console.log('create');
	},
	update: function(){//lo llama por cada frame
		console.log('update');
	},

}

var game = new Phaser.Game(1136, 640, Phaser.AUTO)//Phaser.Canvas, Phaser.Auto, Phaser.WEBGL

game.state.add('gameplay', GamePlayManager);
game.state.start('gameplay');