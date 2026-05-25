/*
Program Name: Button.js
Description:
This file controls the logic when player click the button.

Inputs:
User button clicks from the interface or during win losst condition check.

Outputs / Results:
Changes between different screen.

Called By:
Loaded by index.html and the funcitons are all used in the main.js.

Calls:
playerSetup()
gameActivity.start()
gameActivity.stop()
gameActivity.reStart()
gameLoop()
document.getElementById()
*/

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
var gameRunning = false;
/*
Function Name: startGameScreen

Description:
Starts the gameplay screen.

Expected Inputs:
None.

Expected Outputs / Results:
- Player initialized.
- Menu screen hidden.
- Ending screen hidden.
- Game screen shown.
- All required data for the game will be setted.
- gameloop start.

Called By:
when the player presses the Play button.

Calls:
- gameActivity.start()
- gameLoop()
- document.getElementById()
*/
function startGameScreen() {
    
    playerSetup();
    document.getElementById("menuScreen").style.display = "none";
    document.getElementById("endingScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "flex";
    gameActivity.start();
    gameRunning = true;
    if(gameRunning === true){
            gameLoop();

    }
}
/*
Function Name: backToMenuScreen

Description:
Returns the user to the main menu screen. 

Expected Inputs:
None.

Expected Outputs / Results:
- Game screen is hidden.
- Setting screen is hidden.
- Ending screen is hidden.
- Menu screen is shown.

Called By:
Called when the player presses the Back to Menu button in setting screen
or Replay button in the ending screen.

Calls:
- document.getElementById()
*/
function backToMenuScreen() {
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("settingScreen").style.display = "none";
    document.getElementById("endingScreen").style.display = "none";
    document.getElementById("menuScreen").style.display = "flex";
}
/*
Function Name: startSettingScreen

Description:
Opens the settings screen. 

Expected Inputs:
None.

Expected Outputs / Results:
- Game activity is stopped.
- Game screen is hidden.
- Setting screen is shown.

Called By:
Called when the player presses the Settings button.

Calls:
- gameActivity.stop()
- document.getElementById()
*/
function startSettingScreen() {
    gameActivity.stop();
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("settingScreen").style.display = "flex";
}
/*
Function Name: resume

Description:
Resumes the game after the player press the resumes button in the settings screen. 

Expected Inputs:
None.

Expected Outputs / Results:
- Game activity is restarted.
- Setting screen is hidden.
- Game screen is shown.
- Game loop resumes.

Called By:
Called when the player presses the Resume button.

Calls:
- gameActivity.reStart()
- gameLoop()
*/
function resume() {
    gameActivity.reStart();
    document.getElementById("settingScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "flex";
    gameLoop();
}
/*
Function Name: startEndingScreen
Description:
Displays the ending screen when the game ends. 

Expected Inputs:
- wording: a string that contains the ending message (win and lose messsage) to be shown to the player.

Expected Outputs / Results:
- Game screen is hidden.
- Ending screen is shown.
- Ending message text is updated.

Called By:
Called when the game reaches a win or lose condition(in gameHelper.js checkWinLost())

Calls:
- document.getElementById()
*/
function startEndingScreen(wording) {
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("endingScreen").style.display = "flex";
    const endingText = document.getElementById("endingText");
    endingText.textContent = wording;
}
/*
Function Name: startGuide

Description:
Opens the player guide screen from the settings menu. 

Expected Inputs:
None.

Expected Outputs / Results:
- Setting screen is hidden.
- Guide screen is shown.

Called By:
Called when the player presses the Player Guide button.

Calls:
- document.getElementById()
*/
function startGuide(){
    document.getElementById("settingScreen").style.display = "none";
    document.getElementById("guideScreen").style.display = "flex";
}
/*
Function Name: endGuide

Description:
Closes the player guide screen and returns to the settings screen.

Expected Inputs:
None.

Expected Outputs / Results:
- Setting screen is shown.
- Guide screen is hidden.

Called By:
Called when the player presses the Go Back button in the guide screen.

Calls:
- document.getElementById()
*/
function endGuide(){
    document.getElementById("settingScreen").style.display = "flex";
    document.getElementById("guideScreen").style.display = "none";
}