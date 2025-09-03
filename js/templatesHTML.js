/**
 * Overlay-Rahmen Vorlage
 * Nimmt HTML-Inhalt als Parameter und setzt ihn in die .content div ein.
 * @param {string} contentHTML - Der HTML-String, der im Inhaltsbereich angezeigt werden soll.
 * @returns {string} - Das vollständige HTML für das Overlay.
 */
function getGameInfoFrameHTML(contentHTML) {
  return `
  <div class="game-info">
    <button class="close-button" onclick="hideGameInfo()">&times;</button>
    <img src="images/bg/button/emptyMap.png" alt="leere Schatzkarte als Infobox-Hintergrund">  
    <div class="content">
        ${contentHTML} 
    </div>
  </div>
  `;
}


/**
 * Gibt nur den Inhalt für die Spiel-Story zurück.
 */
function getStoryContentHTML()  {
  return `
    <h3>Ein Schatz in der Wüste</h3>
    <p>
      A long time ago, a pirate ship sank with its treasure and seemed lost forever. But the water has evaporated and now the treasure lies somewhere in thedesert with the remains of the ship.
    </p>
    <p>
      Find this treasure before it is lost forever! You must fight your way through the desert, defeat enemies, and find the treasure. 
    </p>
    <p><strong>But be careful!</strong></p>
    <p>You are not alone in the search for the gold.</p>
    <p>Because the pirates want their gold back!</p>  
    <p>Collect stones <img src="images/objects/stones/stone.PNG" alt="Stone"> for your defense!</p>
    <p>Just follow the trail of coins ... 
    <img src="images/objects/coins/coin.png" alt="Münze/coin"> They will lead you to the treasure.</p>
    <p>With 5 coins, you can buy extra lives. You will need them...</p>
    <p>Have fun!</p>
  `;
}

/**
 * Gibt den Inhalt für die Spiel-Steuerung zurück.
 */
function getControlsContentHTML() {
    return `
        <div class="controls-intro">
            <h3>Keyboard Controls</h3>
        </div>
        <div class="controls">
            <table>
                <tr><th>Keys</th><th>Action</th></tr>
                <tr><td>⬅️ / ➡️</td><td>Moving</td></tr>
                <tr><td>⬆️</td><td>Jumping</td></tr>
                <tr><td><img class="keyboard-D" src="images/help/dTaste.png" alt="D-Taste als Bild"></td><td>Throwing Stone</td></tr>
                <tr><td>'space'</td><td>Pause on/off</td></tr>
                <tr><td></td><td>Buy Life</td></tr>
                <tr><td>↩️</td><td>Stop/Start</td></tr>
            </table>
        </div>
  `;
}

function getImpressumContentHTML() {
    return `
        <h3>Impressum</h3>
        <p>Angaben gemäß § 5 TMG:</p>
        <p>LS Nordlicht<br>
           Bockholm 5<br>
           24960 Glücksburg
        </p>
        <p>Vertreten durch:<br>
           Liane Schmuhl
        </p>
        <p>Kontakt:<br>
           Telefon: 0172 8686750<br>
           E-Mail: <a href="mailto:info@ls-nordlicht.com">info@ls-nordlicht.com</a>
        </p>
        <p>Umsatzsteuer-ID:DE 261 093 655<br>
           Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: DE123456789
        </p>
        <p>Haftungsausschluss:<br>
           <small>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</small>
        </p>
    `;
}