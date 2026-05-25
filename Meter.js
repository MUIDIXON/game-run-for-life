/*
Program Name: Meter.js

Description:
This file manages the distance meter system for the game.
It stores the player's current travelled meter, generates the goal
meter, updates the travelled meter during gameplay, and checks
whether the player has reached the goal.

Expected Inputs:
- Speed values from gameplay updates
- Min and max values for random goal generation

Expected Outputs / Results:
- Stores and updates current meter value
- Stores goal meter value
- Returns meter values when needed
- Indicates whether the goal has been reached

Called By:
- Loaded by index.html
- Used by Game.js and GameHelper.js

Calls:
- randomMeter()
- Math.random()
*/


//1 game unit = 0.1 meter
//and each frame , player will move 1 game unit * diffcultyrate
var metersPerUnit = 0.1;
var meter =0;
var goalMeter;
/*
Function Name: setGoalMeter

Description:
Generates a random goal meter value and stores it in the goalMeter variable.

Expected Inputs:
None.

Expected Outputs / Results:
- goal Meter will generate between 100-1000

Called By:
- Game.js gameActivity.start()

Calls:
- randomMeter()
*/
function setGoalMeter() {
    //from 100 meter to 1000
    var goalM  = randomMeter(100, 1000);
    goalMeter = goalM;
}
/*
Function Name: resetMeter

Description:
Resets the player's current travelled distance back to 0 at the start of a new game.

Expected Inputs:
None.

Expected Outputs / Results:
- meter is reset to 0

Called By:
- Game.js gameActivity.start()

Calls:
None
*/
function resetMeter(){
    meter = 0; 
}
/*
Function Name: updateMeter

Description:
Updates the current travelled meter based on the given speed value.
The increase amount is calculated using metersPerUnit multiplied by speed.

Expected Inputs:
- speed: the current movement speed 

Expected Outputs / Results:
- current meter value is increased

Called By:
- Game.js updateGameActivity()

Calls:
None
*/
function updateMeter(speed){
//1 game unit = 0.1 meter
//and each frame , player will move 1 game unit * diffcultyrate
//meter updated each frame
    meter  +=  metersPerUnit * speed;
}
/*
Function Name: randomMeter

Description:
Generates a random meter value between the given min and max values.

Expected Inputs:
- min: minimum possible meter value
- max: maximum possible meter value

Expected Outputs / Results:
- Returns a random number between min and max

Called By:
- setGoalMeter()

Calls:
- Math.random()
*/
function randomMeter(min, max) {
    return Math.random() * (max - min + 1 ) + min;
}
/*
Function Name: returnCurrentMeter

Description:
Returns the player's current travelled meter value.

Expected Inputs:
None.

Expected Outputs / Results:
- Returns the current meter

Called By:
- Game.js drawMeters()

Calls:
None
*/
function returnCurrentMeter(){
    return meter;
}
/*
Function Name: returnGoalMeter

Description:
Returns the current goal meter value.

Expected Inputs:
None.

Expected Outputs / Results:
- Returns the goal Meter value

Called By:
- drawMeters()

Calls:
None
*/
function returnGoalMeter(){
    return goalMeter;
}
/*
Function Name: reachGoalMeter

Description:
Checks whether the player's current travelled meter is greater than
or equal to the goal meter.If yes return true , else return false.

Expected Inputs:
None.

Expected Outputs / Results:
- Returns true if the player has reached or passed the goal meter
- Returns false otherwise

Called By:
- Game.js gameActivity.clear()
- Game.js updateGameActivity()

Calls:
None
*/
function reachGoalMeter(){
    if(meter >= goalMeter){
        return true;
    }
    else{
        return false;
    }
}