/*
Program Name: GameHelper.js

Description:
This file contain the logic used in the game , used in Game.js.
It handles win and lose checking, random number generation,
player boundary control, bomb collision handling, invincibility timing,
bomb spawning, and bomb movement.

Expected Inputs:
- Game state values
- Frame count
- Player and bomb object data

Expected Outputs / Results:
- Updates game conditions
- Detects collisions
- Spawns and moves bombs
- Controls invincibility state
- Checks win or lose conditions

Called By:
- Loaded by index.html
- Used by Game.js

Calls:
- Game.js gameActivity.stop()
- Button.js startEndingScreen()
-  ()
- random()
- game.js component()
- Bombs[i].newPos()
- Bombs[i].update()
- Math.round()
*/
var isInvincibility = false;
var invincibilityStartTime =0;
/*
Function Name: checkWinLost

Description:
Checks whether the player has won or lost the game. The player loses
if HP becomes 0 or below, or if the player is pushed to the left edge
of the screen. The player wins if the goal section is reached and the
player touches the goal.

Expected Inputs:
None.

Expected Outputs / Results:
- Stops the game when a win or lose condition is met
- Displays the proper ending screen message
- Resets invincibility state when the player loses

Called By:
- Game.js updateGameActivity()

Calls:
- Game.js gameActivity.stop()
- Button.js startEndingScreen()
*/
function  checkWinLost() {
  //if player hits a bomb
  
    if (player.hp != null && player.hp<=0) {
      //lost
      gameActivity.stop();
      // ending screen 
      startEndingScreen("You lose all HP! You lost");
      //reset invincibility
      isInvincibility  =false;
    }

  //if player didnt run fast enough and get pulled to the left edge of the canvas, player also lose
  if(player.x ===0){
      gameActivity.stop();
      startEndingScreen("You lost! The ghost caught you!");
      //reset invincibility
      isInvincibility  =false;
  }
  if(goalSectionReached){
    if (player.x + player.width >= canvas.width-goalwidth) {
          //goal!!
          gameActivity.stop();
      startEndingScreen("You reach the door! You win!");
      }
  }
}
/*
Function Name: random

Description:
Generates a random integer value between the given minimum and maximum values.

Expected Inputs:
- min: the minimum value
- max: the maximum value

Expected Outputs / Results:
- Returns a random integer between min and max, inclusive

Called By:
- bombSpawn()

Calls:
- Math.random()
- Math.floor()
*/
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1 )) + min;
}
/*
Function Name: keepPlayerInsideWall

Description:
Keeps the player inside the allowed screen area. 
It prevent player move outside the game screen and right boundary.
Right boundary is restricted to half of the canvas if player have not reach the goal section yet.
After goal section is reached , the restriction will be remove and player can move acrosss the full width.

Expected Inputs:
None.

Expected Outputs / Results:
- Player position is adjusted if it goes outside the allowed area

Called By:
- Game.js updateGameActivity()

Calls:
None
*/
function keepPlayerInsideWall() {
    //left wall
    if (player.x < 0) {
        player.x = 0;
    }
    //top wall
    if (player.y < 0) {
        player.y = 0;
    }
    //goal secction not reach
    if(goalSectionReached === false){
      //if goal section not reach  , limit player in the  left area of the canvas
        if (player.x + player.width > canvas.width/2) {
          player.x = canvas.width/2 - player.width;
      }
    }
    // goal ssection reach
    else{
      //if goal section reach, limit player in the whole canvas
        if (player.x + player.width > canvas.width) {
          //goal!!
          player.x = canvas.width - player.width;
      }
    }
    
    //bottom wall
    if (player.y + player.height > canvas.height-bombSize- bombGap) {
        player.y = canvas.height  -bombSize - bombGap - player.height;
    }
}
/*
Function Name: bombHitted

Description:
Checks whether the player has collided with any bomb. If a collision
happens, the player loses 1 HP and invincibility is activated, the hit
time is recorded, and the bomb is removed. If invincibility is already
active, the function updates the invincibility timer instead.

Expected Inputs:
- frameCount: the current game frame count

Expected Outputs / Results:
- Player HP decrease if bomb hitted and Invincibility is not activated.
- Invincibility activated if bomb hitted and update later
- Bomb will be removed after collision with player

Called By:
- Game.js updateGameActivity()

Calls:
- countInvincibilityWindow()
- player.crashWithBomb()
- Bombs.splice()
*/
function bombHitted(frameCount){
  if(this.isInvincibility ===true){
    countInvincibilityWindow(frameCount);
    return;
  }

  if(Bombs.length>=0 && this.isInvincibility ===false){
      for (i = 0; i < Bombs.length; i += 1) {
        if(player.crashWithBomb(Bombs[i])){
          player.hp -=1;
          this.isInvincibility =true;
          invincibilityStartTime = frameCount;
          //remove the bomb 
           Bombs.splice(i, 1);
          return;
      }
    }
  }
}
/*
Function Name: countInvincibilityWindow

Description:
Tracks how long the player has been invincible after getting hit.
Once the invincibility duration passes 100 frames, the invincibility
state will be removed.

Expected Inputs:
- frameCount: the current game frame count

Expected Outputs / Results:
- Invincibility state is turned off after 100 frames
- Invincibility timer is reset

Called By:
- bombHitted()

Calls:
None
*/
function countInvincibilityWindow(frameCount){
    // Invincibility for 100 frame only
    if(frameCount - invincibilityStartTime >100){
      invincibilityStartTime =0;
      this.isInvincibility =false;
    }
    
}
/*
Function Name: bombSpawn

Description:
Creates bombs at random vertical positions on the right size based on the current
difficulty level. The function controls spawn timing, makes sure
bombs from the same wave do not use the same slot, and leaves
empty spaces so the player still has room to avoid bombs.

Expected Inputs:
None.

Expected Outputs / Results:
- New bomb objects may be added into the Bombs array
- the higher the difficulty rate, the faster each wave of bombs will spawn.

Called By:
- Game.js updateGameActivity()

Calls:
- random()
- component()
- Bombs.push()
- Math.floor()
- Math.round()
*/
function bombSpawn() {
  //every 250/(1+difficultyIncreaseRate) frame , bombs will spawn 
  var spawnBombByFrame = 250/(1+difficultyIncreaseRate);
  if(frameCount == 1 || frameCount % Math.round(spawnBombByFrame)  === 0) { 
    //max place to spawn
    var maxSpawnSpot  = Math.floor((canvas.height-(bombSize+ bombGap)) / (bombSize +bombGap));
    //alway left 2 spots empty to make sure the player has a chance to move and avoid the bombs
    var  maxBombsNumber = random(2, maxSpawnSpot)-2;
     var chosenSlot = [];
    for(var i = 0; i < maxBombsNumber; i++) {
      //random boom start location 
      var  randomStartLocation = random(0, maxSpawnSpot);
      //check if the slot has bomb already
      while(chosenSlot[randomStartLocation] === true) {
      //if the slot has bomb already, random another location
        randomStartLocation = random(0, maxSpawnSpot);
    }
      var bomb = new component(bombSize , bombSize , canvas.width, randomStartLocation*(bombSize+ bombGap) );
      Bombs.push(bomb);
      chosenSlot[randomStartLocation] = true;
    }
   
  }
}
/*
Function Name: moveBombs

Description:
Updates the position of all bombs, draws them on the screen, and
removes bombs that move off the left side of the canvas.

Expected Inputs:
None.

Expected Outputs / Results:
- Bomb positions are updated
- Bombs are drawn on the canvas
- Off-screen bombs are removed from the Bombs array

Called By:
- Game.js updateGameActivity()

Calls:
- Bombs[i].newPos()
- Bombs[i].update()
- Bombs.splice()
*/
function moveBombs() {
  for (i = 0; i < Bombs.length; i += 1) {
        Bombs[i].newPos();
        Bombs[i].update();
        //remove the bomb from the array if it goes off the left edge of the canvas
        if (Bombs[i].x < 0) {
            Bombs.splice(i, 1);
            i--;
    }
    }
  }