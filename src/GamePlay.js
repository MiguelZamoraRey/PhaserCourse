var AMOUNT_DIAMONDS = 30;

GamePlayManager = {
	init: function(){//inicializa valores
		//ponemos flag para inicializar el movimiento del caballo
		this.flagFirstMouseDown = false;
	},
	preload: function(){//carga de recursos para el proyecto
		//2.en el preload cargamos la imagen del fondo (nameParaUtilizarlo, ruta)
		game.load.image('background', 'assets/images/background.png');
		//3.Vamos a hacer un preolad de un spritesheet en vez de un solo sprite. 
		//tiene tres parametros mas ([...],ancho,alto,numimagenes)
		game.load.spritesheet('horse','assets/images/horse.png', 84, 156, 2);
		//load de los diamantes
		game.load.spritesheet('diamonds','assets/images/diamonds.png', 81, 84, 4);
		//Cargando imagen efecto explosion
		game.load.image('explosion','assets/images/explosion.png');

		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    	game.scale.setMinMax(568, 320, 1136, 640);
	},
	create: function(){//crea el juego
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

			this.diamonds[i] = diamond;

			var rectCurrentDiamond = this.getBoundsDiamonds(diamond);
			var rectHorse = this.getBoundsDiamonds(this.horse);

			while(this.isOverlappingOtherDiamond(i,rectCurrentDiamond) ||
				this.isRectanglesOverlapping(rectHorse, rectCurrentDiamond)){
				diamond.x = game.rnd.integerInRange(50,1050);
				diamond.y = game.rnd.integerInRange(50,600);
				rectCurrentDiamond = this.getBoundsDiamonds(diamond);
			}
		}
		//añadimos el sprite de explosion
		this.explosion = game.add.sprite(100,100, 'explosion');

		//guardamos las instancias tween de la animacion dentro del objeto explosion
		this.explosion.tweenScale = game.add.tween(this.explosion.scale).to({
			x: [0.4, 0.8, 0.4],
			y: [0.4, 0.8, 0.4]
		}, 600, Phaser.Easing.Exponential.Out, false, 0, 0, false);

		this.explosion.tweenAlfa = game.add.tween(this.explosion).to({
				alpha: [1,0.6, 0]
		}, 600, Phaser.Easing.Exponential.Out,false, 0, 0, false);

		//ponemos el anchor en la mitad del sprite tanto en x como en y
		this.explosion.anchor.setTo(0.5);
		//invisible al principio
		this.explosion.visible = false;
	},
	//nueva funcion para setear el flag a true tras clickar 
	onTap: function(){
		this.flagFirstMouseDown = true;
	},
	getBoundsDiamonds: function(currentDiamod){
		return new Phaser.Rectangle(currentDiamod.left, currentDiamod.top, currentDiamod.width, currentDiamod.height);
	},
	getBoundsHorse: function(){
		var x0= this.horse.x - Math.abs(this.horse.width/2);
		var width = this.horse.width;
		var y0= this.horse.y - Math.abs(this.horse.height/2);
		var height = this.horse.height;

		return new Phaser.Rectangle(x0,y0,width,height);
	},
	isRectanglesOverlapping: function(rect1,rect2){
		if(rect1.x > rect2.x + rect2.width || rect2.x> rect1.x + rect1.width){
			return false;
		}
		if(rect1.y > rect2.y + rect2.height || rect2.y> rect1.y + rect1.height){
			return false;
		}
		return true;
	},
	isOverlappingOtherDiamond:function(index,rect2){
		for(var i =0; i<index;i++){
			var rect1 = this.getBoundsDiamonds(this.diamonds[i]);
			if(this.isRectanglesOverlapping(rect1,rect2)){
				return true;
			}
		}
		return false;
	},
	/*render: function(){
		game.debug.spriteBounds(this.horse); para ver el rectangulo
	},*/
	update: function(){//lo llama por cada frame
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

			//detector de colisiones
			for(var i = 0;i<AMOUNT_DIAMONDS;i++){
				var rectHorse = this.getBoundsHorse();
				var rectDiamond = this.getBoundsDiamonds(this.diamonds[i]);
				if(this.isRectanglesOverlapping(rectHorse,rectDiamond) && this.diamonds[i].visible){
					this.diamonds[i].visible = false;
					
					this.explosion.visible=true;
					this.explosion.x = this.diamonds[i].x;
					this.explosion.y = this.diamonds[i].y;
					this.explosion.tweenScale.start();
					this.explosion.tweenAlfa.start();
				}

			}
		}
	},
}

// (width, height, [Phaser.CANVAS/Phaser.AUTO/Phaser.WEBGL])
var game = new Phaser.Game(1136, 640, Phaser.CANVAS);

game.state.add('gameplay', GamePlayManager);
game.state.start('gameplay');