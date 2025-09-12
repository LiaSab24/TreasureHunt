/**
 * Overlay frame template
 * Takes HTML content as a parameter and sets it in the .content div.
 * @param {string} contentHTML - The HTML string to be displayed in the content area.
 * @returns {string} - The complete HTML for the overlay.
 */
function getGameInfoFrameHTML(contentHTML) {
  return `
  <div class="game-info">
    <button class="close-button" onclick="hideGameInfo()">&times;</button>
    <img src="images/bg/button/emptyMap.png" alt="empty treasure map as infobox background">  
    <div class="content">
        ${contentHTML} 
    </div>
  </div>
  `;
}

/**
 * Returns only the content for the game story.
 * @returns {string} - HTML string for the story section.
 */
function getStoryContentHTML()  {
  return `
    <h3>A Treasure in the Desert</h3>
    <p>
      A long time ago, a pirate ship sank with its treasure and seemed lost forever. But the water has evaporated and now the treasure lies somewhere in the desert with the remains of the ship.
    </p>
    <p>
      Find this treasure before it is lost forever! You must fight your way through the desert, defeat enemies, and find the treasure. 
    </p>
    <p><strong>But be careful!</strong></p>
    <p>You are not alone in the search for the gold.</p>
    <p>Because the pirates want their gold back!</p>  
    <p>Collect stones <img src="images/objects/stones/stone.PNG" alt="Stone"> for your defense!</p>
    <p>Just follow the trail of coins ... 
    <img src="images/objects/coins/coin.png" alt="coin"> They will lead you to the treasure.</p>
    <p>With 5 coins, you can buy extra lives. You will need them...</p>
    <p>Have fun!</p>
  `;
}

/**
 * Returns the content for the game controls.
 * @returns {string} - HTML string for the controls section.
 */
function getControlsContentHTML() {
    return `
        <div class="controls-intro">
            <h3>Keyboard Controls</h3>
        </div>
        <div class="controls">
            <table>
                <tr><th>Keys</th><th>Mouse/Touch</th><th>Action</th></tr>
                <tr><td>⬅️ / ➡️</td><td><img scr="images/button/arrow.PNG" width=10 height=10></td><td>Moving</td></tr>
                <tr><td>⬆️</td><td>Jumping</td></tr>
                <tr><td>'D', 'd'</td><td>Throwing Stone</td></tr>
                <tr><td>'b'/'B'</td><td>Buy Life</td></tr>
                <tr></tr><td>'M'/'m'</td><td>Mute on/off</td></tr>
                <tr><td>↩️</td><td>mit 'Enter' Spiel Start</td></tr>
                <tr><td>'space'</td><td>Pause on/off</td></tr>
                <tr><td>'Esc'</td><td>Stop Game</td></tr>
            </table>
        </div>
  `;
}

/**
 * Returns the content for the legal notice (Impressum).
 * @returns {string} - HTML string for the legal notice section.
 */
function getImpressumContentHTML() {
  return `
    <h3>Legal Notice</h3>
    <p>Information according to § 5 TMG:</p>
    <p>LS Nordlicht<br>
       Bockholm 5<br>
       24960 Glücksburg
    </p>
    <p>Represented by:<br>
       Liane Schmuhl
    </p>
    <p>Contact:<br>
       Phone: 0172 8686750<br>
       E-Mail: <a href="mailto:info@ls-nordlicht.com">info@ls-nordlicht.com</a>
    </p>
    <p>Disclaimer:<br>
       <small>The contents of our pages were created with the greatest care. However, we cannot guarantee the accuracy, completeness and timeliness of the contents.</small>
    </p>
  `;
}