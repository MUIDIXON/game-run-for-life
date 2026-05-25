/*
Function Name: init

Description:
Initializes the game interface .attach functions to each buttons, 
allow player to click on it and start the game,
open setting, resume return to menu, open guide and leave guide. 

Expected Inputs:
None.

Expected Outputs / Results:
- Play button starts the game
- Back button returns to the menu
- Settings button opens the settings screen
- Resume button continues the game
- Replay button returns to the menu
- Guide button opens the guide screen
- Back-to-setting button closes the guide screen and back to setting screen

Called By:
- index.html 

Calls:
- document.getElementById()
- addEventListener()
*/
function init() {
    //back button is hidden at the start of the game
    //if start button is click , call the startGameScreen function form game.js
    const playButton = document.getElementById("playButton");
    playButton.addEventListener("click", startGameScreen);
    //if back button is click ,  call the backToMenuScreen function form game.js
     const backButton = document.getElementById("backButton");
    backButton.addEventListener("click", backToMenuScreen);
    //setting button , open setting
    const openSettingButton = document.getElementById("settingButton");
    openSettingButton.addEventListener("click", startSettingScreen);
    //resume button , back to game screen
    const closeSettingButton = document.getElementById("resumeButton");
    closeSettingButton.addEventListener("click", resume);
    //replay button , go back to main menu
    const replayButton = document.getElementById("replayButton");
    replayButton.addEventListener("click", backToMenuScreen);
    //guide button , open guide
    const guideButton = document.getElementById("guideButton");
    guideButton.addEventListener("click", startGuide);
    //in guide button , click to go back to setting menu
    const backToSettingButton = document.getElementById("backToSettingButton");
    backToSettingButton.addEventListener("click", endGuide);
}
