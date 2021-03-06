//game variables
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var jumpSound;

var score;

  var gameOverText;
  var resetButton;
  
  var backgroundMusic;
  
  var gameOverMusic;
function preload(){
  //loads all game assets
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverText = loadImage('gameOver.png');
  
  resetButton = loadImage('restart.png');
  
  jumpSound = loadSound ('ping.mp3');
  
  backgroundMusic = loadSound ('background_music.mp3');
  
  gameOverMusic = loadSound ('game_over.mp3');
}

function setup() {
  createCanvas(600, 200);
  
  //creating trex
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  //creating ground
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //creating ivisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  //starting score
  score = 0;
  
trex.setCollider('circle',0,0,50);
  //game over text
  endGameText=createSprite(300,50,30,30);
  endGameText.addImage('endGame',gameOverText);
  endGameText.scale=0.75
  //restart button
  restartButton=createSprite(300,100,30,30);
  restartButton.addImage('reset',resetButton);
  
  backgroundMusic.loop();
  
 // trex.debug=true;
 // trex.setCollider('circle',105,0,54)
}

function draw() {
  background('lightgreen');
  
  //displaying score
  text("Score: "+ score, 500,50);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(4+score/150);
    
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
    
    //ground is infinite
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 155) {
        trex.velocityY = -13;
      jumpSound.play();
    }
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      //trex.velocityY=-8;
        gameState = END;
      //change animation for trex when game ends
      trex.addAnimation('running',trex_collided)
      
    gameOverMusic.play();
    }
    //don't display game over text and reset button when game is playing
    endGameText.visible=false;
    restartButton.visible=false;
  }
  //objects won't dissapear when game is over
   else if (gameState === END) {
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     //stops ground and trex when game ends
     ground.velocityX = 0;
     trex.velocityY=0;
     
     //clouds and cacti stop when game is over
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
     //display game over text and reset button
      endGameText.visible=true;
      restartButton.visible=true;
   }
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restartButton)){
    reset();
  }
  
  drawSprites();
}
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -(6+score/150);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(3+score/150);
    
     //assign lifetime to the variable
    cloud.lifetime = 199;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset(){
  gameState=PLAY;
  restartButton.visible=false
  gameOverMusic.stop();
  endGameText.visible=false
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  score=0;
}