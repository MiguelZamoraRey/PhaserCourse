var AMOUNT_DIAMONDS = 30;

GamePlayManager = {
	init: function(){//inicializa valores
		console.log('init');

		//ponemos flag para inicializar el movimiento del caballo
		this.flagFirstMouseDown = false;
	},
	preload: function(){//carga de recursos para el proyecto
		console.log('preload');
		//2.en el preload cargamos la imagen del fondo (nameParaUtilizarlo, ruta)
		game.load.image('background', 'assets/images/background.png');
		//3.Vamos a hacer un preolad de un spritesheet en vez de un solo sprite. 
		//tiene tres parametros mas ([...],ancho,alto,numimagenes)
		game.load.spritesheet('horse','assets/images/horse.png', 84, 156, 2);
		//load de los diamantes
		game.load.spritesheet('diamonds','assets/images/diamonds.png', 81, 84, 4);
	},
	create: function(){//crea el juego
		console.log('create');
		//(cordenada X, cordenada Y, nombreParaUtilizarlo)
		game.add.sprite(0, 0, 'background');
		//para los spritesheets cogemos el sprite y lo almacenamos en una instancia
		this.horse = game.add.sprite(0,0,'horse');
		// con la instancia podemos modificar muchas variables
		this.horse.frame = 1;
		this.horse.x = game.width/2;
		this.horse.y = game.height/2;
		//para cambiar el anchor (origen de pintado del sprite)
		this.horse.anchor.setTo(0.5,0.5); 
		//para rotar --> this.horse.angle = 15;
		//para escalar --> this.horse.scale.setTo(1,2); 
		//this.horse.alpha = 0.5;

		//para inicializar el movimiento del caballo hacer click
		game.input.onDown.add(this.onTap, this);

		this.diamonds = [];
		for (var i = 0; i< AMOUNT_DIAMONDS; i++){
			var diamond = game.add.sprite(100, 100, 'diamonds');
			diamond.frame = game.rnd.integerInRange(0,3);//genera valores random entre 0 y 3
			diamond.scale.setTo(0.30 + game.rnd.frac());//otra forma de generar random entre 1 y 0
			diamond.x = game.rnd.integerInRange(50,1050);
			diamond.y = game.rnd.integerInRange(50,600);
		}
	},
	//nueva funcion para setear el flag a true tras clickar 
	onTap: function(){
		this.flagFirstMouseDown = true;
	},
	update: function(){//lo llama por cada frame
		console.log('update');
		//para rotar animado --> this.horse.angle +=1;
		if(this.flagFirstMouseDown){//control de primer movimiento
			//guardar cordenadas del mouse
			var pointerX = game.input.x;
			var pointerY = game.input.y;

			var distX = pointerX - this.horse.x;
			var distY = pointerY - this.horse.y;

			if (distX > 0) {
				this.horse.scale.setTo(1,1);
			}else{
				this.horse.scale.setTo(-1,1);
			}

			this.horse.x += distX * 0.02;
			this.horse.y += distY * 0.02;
		}
	},
}

// (width, height, [Phaser.CANVAS/Phaser.AUTO/Phaser.WEBGL])
var game = new Phaser.Game(1136, 640, Phaser.CANVAS)

game.state.add('gameplay', GamePlayManager);
game.state.start('gameplay');