// castiel

//######################################################## User-variables

var GRAVITY = 0.3;
var FLAP = -7;
var debug = false;
var respawntime = 200;

//######################################################## System-variables

var GROUND_Y;
var bird, ground;
var pipes;
var gameOver;
var birdImg, pipeImg, groundImg, bgImg;
var respawn = respawntime;
var score = 0;
var bestscore = score;
var menumusic,gamemusic;

//######################################################## Setup

function preloadmusic() {
  // Load the sound file.
  soundFormats('mp3');
  menumusic = loadSound('menu.mp3');
	gamemusic = loadSound('gamemusic.mp3');
}

function setup() {
 	createCanvas(windowWidth, windowHeight);

	GROUND_Y = height;

  birdImg = loadImage('castiel.png');
  bgImg = loadImage('background.png');

	rectMode(CENTER);
	imageMode(CENTER);
	textAlign(CENTER);

  bird = createSprite();
  bird.rotateToDirection = true;
  bird.velocity.x = 4;
	bird.position.y = -100;
  bird.setCollider('circle', 0, 0, 400);
	bird.scale = 0.1;
  bird.addImage(birdImg);
	bird.debug = debug;

  //ground = createSprite(800/2, GROUND_Y+100); //image 800x200
  //ground.addImage(groundImg);

  pipes = new Group();
	waves = new Group();
  gameOver = true;
  camera.position.y = height/2;
	preloadmusic()
}
//########################################################

function draw() {

	camera.off();
  image(bgImg, width/2, height/2,width,height);
  camera.on();

  if(gameOver && keyIsDown('32'))
    newGame();

	bird.velocity.y += GRAVITY;

//#################################### PLAY

  if(!gameOver) {

  drawSprite(bird);

    if(keyIsDown('32'))
      bird.velocity.y = FLAP;

    if(bird.position.y<0)
      die();

    if(bird.position.y+bird.height/2 > GROUND_Y)
      die();

    if(bird.overlap(pipes))
      die();

    //spawn pipes
    if(frameCount%100 == 0) {
			pipeImg = loadImage(str(int(random(1,8)))+".png");
      var pipeH = random(0, height/2);
      var pipe = createSprite(bird.position.x + width, pipeH);
      pipe.addImage(pipeImg);
			pipe.scale = random(0.1,0.4);
			pipe.setCollider('circle', 0, 0, 200);
			pipe.debug = debug;
      pipes.add(pipe);

    }
	 if(frameCount%200 == 0) {
			waveImg = loadImage("wave.png");
      var waveH = height-50;
      var wave = createSprite(bird.position.x + width, waveH);
      wave.addImage(waveImg);
			wave.scale = random(0.2,0.4);
		 	wave.setCollider('circle', 0, 0, 400);
		  wave.debug = debug;
      waves.add(wave);
    }

    //get rid of passed pipes
    for(var i = 0; i<pipes.length; i++)
      if(pipes[i].position.x < bird.position.x-width/2)
        pipes[i].remove();

		for(var j = 0; j<waves.length; j++)
      if(waves[j].position.x < bird.position.x-width/2)
        waves[j].remove();

		if(frameCount%50 == 0){
			score+=1;
		}

		fill(255,200);
		textSize(width/40);
		text('Score: ' + str(score) + " m", camera.position.x, (width/16));
  }

//#################################### GAME OVER

	if(gameOver){
		textSize(width/8);
		//print(camera.position.x);
		fill(255,200);
		text('castiel', camera.position.x, height/2);
		if (respawn > respawntime){
		textSize(width/40);
		text('click or press spacebar to play', camera.position.x, (height/2)+(width/16));
		}
		else{
			textSize(width/40);
			text('Best Score: ' + str(bestscore) + " m", camera.position.x, (height/2)+(width/16));
		}
		drawSprite(bird);
	}
	drawSprites(pipes);
	drawSprites(waves);
	camera.position.x = bird.position.x + width/4;
	respawn+=1;
}

//########################################################

function die() {
  updateSprites(false);
  gameOver = true;
	if(score > bestscore){
		bestscore = score;
	}
	score = 0;
	respawn = 0;
	gamemusic.stop();
	menumusic.play();
}

function newGame() {
  pipes.removeSprites();
  gameOver = false;
  updateSprites(true);
  bird.position.y = height/2;
  bird.velocity.y = 0;
  //ground.position.x = 800/2;
  //ground.position.y = GROUND_Y+100;
	menumusic.stop();
	gamemusic.play()
}

function mousePressed() {
  if(gameOver && respawn >= respawntime){
    newGame();
	}
	if(!gameOver){
		bird.velocity.y = FLAP;
	}
}

// MUSIC

// https://www.youtube.com/watch?v=Fz9p7Wcoj6o
