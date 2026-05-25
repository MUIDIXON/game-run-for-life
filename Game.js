
/*
Program Name: Game.js

Description:
This file contains the important game running logic of the game.
It handles the game loop, player setup , player movement,
collision detection, difficulty scaling, rendering, and game update flow.

Inputs:
- Keyboard input (W, A, S, D)
- Frame updates from requestAnimationFrame()

Outputs / Results:
- Updates player position, bombs, and game state
- Renders all game elements ,eg : player, bombs, background, goal, ghost, UI
- Determines win or lose conditions

Called By:
- Loaded by index.html
- startGameScreen(),startSettingScreen() and resume() in Button.js

Calls:
- updateGameActivity()
- gameActivity.clear()
- keepPlayerInsideWall()
- bombSpawn()
- moveBombs()
- bombHitted()
- checkWinLost()
- updateMeter()
- drawMeters()
*/


var player;
var playerSize = 25;
var playerSpawnX = canvas.width/2 - 60;
var playerSpawnY = 120;
var Bombs = [];
var bombSize = 20;
var bombGap = 10;
var goalSectionReached = false;
//base pullspeed
var pulledSpeed = 0.5;
var  frameCount = 0;
var difficultyIncreaseRate = 0.05;
//ground Image
var backgroundImage = new Image();
backgroundImage.src = "resources/ground.png";
var backgroundX = 0;
//player Image
var playerImage = new Image();
playerImage.src = "resources/player.png";
var playerInvincibilityImage = new Image();
playerInvincibilityImage.src = "resources/playerInvincibility.png";
//bomb image
var bombImage = new Image();
bombImage.src = "resources/bomb.png";
//goal image
var goalImage = new Image();
goalImage.src = "resources/door.png";
var goalwidth =20;
var currentGoalx =canvas.width;
//ghost image
var ghostImage = new Image();
ghostImage.src = "resources/ghost.png";

/*
Function Name: gameLoop

Description:
This is the main game loop. It keeps the game running by clearing
the screen, updating the game state, and requesting the next frame.

Expected Inputs:
None.

Expected Outputs / Results:
- The game screen is updated every frame
- The game continues running until gameRunning becomes false

Called By:
- Button.js startGameScreen()
- Button.js resume()

Calls:
- gameActivity.clear()
- updateGameActivity()
- requestAnimationFrame()
*/
function gameLoop() {
    
    if (!gameRunning) return;
    gameActivity.clear();
    updateGameActivity();
    requestAnimationFrame(gameLoop);
}
/*
Function Name: playerSetup

Description:
PLayer setup. 

Expected Inputs:
None.

Expected Outputs / Results:
- A player object is created
- The player HP is initialized

Called By:
- Button.js startGameScreen()

Calls:
- component()
- player.setHP()
*/
function playerSetup(){
    player = new component(playerSize, playerSize, playerSpawnX, playerSpawnY);
    player.setHP();
    playercalled = true;
}
var gameActivity = {
/*
Function Name: start

Description:
Initializes a new game session. It resets bombs, frame count,
difficulty, goal progress, and meter values, also enables
keyboard input tracking and sets the game as running.

Expected Inputs:
None.

Expected Outputs / Results:
- Game variables are reset
- Meter values are reset
- Goal meter is generated
- Keyboard listeners are activate

Called By:
- startGameScreen()

Calls:
- Meter.js resetMeter()
- Meter.js setGoalMeter()
- addEventListener()
*/
    start : function() {
    //for reset the game 
    Bombs = [];
    frameCount = 0;
    difficultyIncreaseRate = 0.05;
    goal = null;
    goalSectionReached = false;
    currentGoalx = canvas.width;
    resetMeter();
    setGoalMeter();
      //button.js have game running boolean variable, set it to true when start the game
        gameRunning = true;
        this.context = ctx;

        window.addEventListener('keydown', function (e) {
        gameActivity.keys = (gameActivity.keys || []);
                gameActivity.keys[e.keyCode] = (e.type == "keydown");
        })
        //when keyup, set the keycode in the keys array to false
        window.addEventListener('keyup', function (e) {
        gameActivity.keys[e.keyCode] = (e.type == "keydown");
        })
    },
/*
Function Name: clear

Description:
Draws the scrolling background during gameplay. If the goal section
has been reached, the background stops scrolling , otherwise keep scrolling.

Expected Inputs:
None.

Expected Outputs / Results:
- Background image is drawn on the canvas
- Background scrolling effect is updated if player have not reach the goal

Called By:
- gameLoop()

Calls:
- Meter.js reachGoalMeter()
- drawImage()
*/
    clear : function(){
        //if goal arrived , stop moving the ground
        if(reachGoalMeter()){
        this.context.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
        this.context.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);
        }
        //else move
        else{
          if (backgroundImage.complete) {
        backgroundX -= (pulledSpeed + difficultyIncreaseRate);

        if (backgroundX <= -canvas.width) {
            backgroundX = 0;
        }
        this.context.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
        this.context.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);
        }
       
      }
    },
/*
Function Name: stop

Description:
Stops the gameplay by setting the gameRunning variable to false.

Expected Inputs:
None.

Expected Outputs / Results:
- Game loop stops running

Called By:
- Button.js startSettingScreen()
- GameHelper.js checkWinLost()

Calls:
None
*/
    stop : function() {
      //button.js have game running boolean variable, set it to true when start the game
        gameRunning = false;
    },
/*
Function Name: reStart

Description:
Restarts the gameplay by setting the gameRunning variable to true.

Expected Inputs:
None.

Expected Outputs / Results:
- change gameRunning to true.
- let to continuing of the Game loop. 

Called By:
- Button.js resume()

Calls:
None
*/
    reStart : function(){
      gameRunning = true;
    }
}

/*
Function Name: component

Description:
Creates game object the player and bomb. It stores
size, position, speed, drawing, movement,
and collision detection for both type of object. 
For player object it will stores extra variable call HP.

Expected Inputs:
- width: width of the object
- height: height of the object
- x: starting x position
- y: starting y position

Expected Outputs / Results:
- can either creaate a player or bomb object 

Called By:
- playerSetup()
- GameHelper.js bombSpawn()

Calls:
- drawImage()
- fillRect()
*/

function component(width, height, x, y) {
    this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.hp ;
  this.setHP = function(){
    this.hp=3;
  }
  /*
Function Name: playerHPUpdate

Description:
Draws the player's current health points on the screen as green blocks.
The number of blocks drawn depends on the player's current HP value.

Expected Inputs:
None.

Expected Outputs / Results:
- Player HP is displayed visually on the canvas

Called By:
- updateGameActivity()

Calls:
- ctx.fillRect()
*/
  this.playerHPUpdate = function(){
    ctx.fillStyle = "green";
    var startX = 10;
    var startY = canvas.height - bombSize - bombGap;
    var HPSize =25;
    var HPGap = 10;
    if(this.hp != null && this.hp != 0){
      for(i = 0; i < this.hp; i += 1){
         ctx.fillRect(startX+HPSize*i+HPGap*i, startY, HPSize, HPSize);
    }
   
    }
    
  }
/*
Function Name: playerUpdate

Description:
Draws the player on the canvas with image. If the player is in the invincibility
state, the function makes the player flip between invincibility and normal image.

Expected Inputs:
None.

Expected Outputs / Results:
- Player image is drawn on the canvas
- invincibility effect is shown when invincibility is active

Called By:
- updateGameActivity()

Calls:
- ctx.drawImage()
*/
  this.playerUpdate = function() {
    //isInvincibility from game helper function 
    if(isInvincibility){
      if(frameCount%4 === 0){
       ctx.drawImage(playerInvincibilityImage,this.x, this.y, this.width, this.height);
      }
      else{
        ctx.drawImage(playerImage,this.x, this.y, this.width, this.height);
      }
    }
    else{
      ctx.drawImage(playerImage,this.x, this.y, this.width, this.height);
    }
    
  }
/*
Function Name: update

Description:
For drawing the bomb object on the canvas at its current position.

Expected Inputs:
None.

Expected Outputs / Results:
- Bomb image is displayed on the canvas

Called By:
- moveBombs()

Calls:
- ctx.drawImage()
*/
  this.update = function() {
     ctx.drawImage(bombImage,this.x, this.y, this.width, this.height);
  }
/*
Function Name: playerNewPos

Description:
Updates the player's position based on its speed values. If the goal section
has not been reached, a backward pull force is also applied to the player.

Expected Inputs:
None.

Expected Outputs / Results:
- Player x and y positions are updated

Called By:
- updateGameActivity()

Calls:
None
*/

  this.playerNewPos = function() {
    if(goalSectionReached){
      this.x += this.speedX;
    this.y += this.speedY;
    }
    else{
      this.x += this.speedX-pulledSpeed- difficultyIncreaseRate;
    this.y += this.speedY;
    }
    
  }
  /*
Function Name: newPos

Description:
Updates the bombs position by applying its speed values and the backward
pull force.

Expected Inputs:
None.

Expected Outputs / Results:
- bomb x and y positions are updated

Called By:
- GameHelper.js moveBombs()

Calls:
None
*/
  this.newPos = function() {
      this.x += this.speedX-pulledSpeed- difficultyIncreaseRate;
    this.y += this.speedY;
  }
  /*
Function Name: crashWithBomb

Description:
Checks whether the bomb has collided with players by comparing
their hitboxes.

Expected Inputs:
- otherobj: bomb

Expected Outputs / Results:
- Returns true if player and bomb overlap
- Otherwise returns false 

Called By:
- GameHelper.js bombHitted()

Calls:
None
*/
  this.crashWithBomb = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) ||(mytop > otherbottom) ||(myright < otherleft) ||(myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
}
/*
Function Name: updateGameActivity

Description:
Updates the main game logic for each frame. It handles player movement,
keyboard result handling, difficulty increase, goal checking, bomb spawning, bomb movement,
collision checking, HP drawing, and meter drawing.

Expected Inputs:
None.

Expected Outputs / Results:
- Player position is updated
- Player are drawed
- Bombs are drawed , spawned and moved
- Goal is drawn when reached
- Ghost is drawn
- Current meter , goal meter and HP are displayed
- Frame count increases

Called By:
- gameLoop()

Calls:
- keepPlayerInsideWall()
- player.playerNewPos()
- player.playerUpdate()
- Meter.js reachGoalMeter()
- GameHelper.js bombSpawn()
- Meter.js updateMeter()
- GameHelper.js moveBombs()
- GameHelper.js bombHitted()
- GameHelper.js checkWinLost()
- player.playerHPUpdate()
- drawMeters()
*/
function updateGameActivity(){
player.speedX = 0;
  player.speedY = 0;
  //every 250 frame , the difficulty of the game will increasse
  //the difficulty will afftect the sawpn rate of the bomb and speed fot he game
  if(frameCount == 1 || frameCount % 250 === 0) { 
    difficultyIncreaseRate +=0.05;
  }
  //keyboard key listeners
  if (gameActivity.keys && gameActivity.keys[65]) {player.speedX = -1-difficultyIncreaseRate; }
    if (gameActivity.keys && gameActivity.keys[68]) {player.speedX = 1+difficultyIncreaseRate; }
    if (gameActivity.keys && gameActivity.keys[87]) {player.speedY = -1-difficultyIncreaseRate; }
    if (gameActivity.keys && gameActivity.keys[83]) {player.speedY = 1+difficultyIncreaseRate; }
     player.playerNewPos();
     keepPlayerInsideWall();
  player.playerUpdate();
  //set the flag to true
  if(reachGoalMeter() ){
    goalSectionReached = true;
  }
  if(!reachGoalMeter()){
    bombSpawn();
    //base speed is alway 1
    // base speed + extra difficulty
    updateMeter(1+difficultyIncreaseRate);
  }
  //if the goal flag is true
  if (goalSectionReached ) {
            ctx.drawImage(goalImage, currentGoalx, 0, goalwidth, canvas.height);
            //if iwll spawn slowy
            if(currentGoalx > canvas.width - goalwidth){
              currentGoalx -= 1 + difficultyIncreaseRate;
            }

    } 
    //draw ghost image
    ctx.drawImage(ghostImage, 0, 0, 40, canvas.height);

  moveBombs();
  bombHitted(frameCount);
  checkWinLost();
  player.playerHPUpdate();
  
  
  drawMeters();
  frameCount+=1;
}
/*
Function Name: drawMeters

Description:
Draws the current meter travelled and the goal meter on the canava.

Expected Inputs:
None.

Expected Outputs / Results:
- Current meter text is displayed
- Goal meter text is displayed

Called By:
- updateGameActivity()

Calls:
- Meter.js returnCurrentMeter()
- Meter.js returnGoalMeter()
- fillText()
*/
function drawMeters() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("CurrentMeter: " + Math.floor(returnCurrentMeter()) + " m", 20, 30);
    ctx.fillText("GoalMeter: " + Math.floor(returnGoalMeter()) + " m", 280, 30);
}
