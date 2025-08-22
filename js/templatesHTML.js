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
      <p>Vor viel zu langer Zeit ist ein Piratenschiff mit seinem Schatz gesunken und er scheint verloren.
          <br>Doch das Wasser ist verdunstet und nun liegt der Schatz mit den Resten des Schiffes irgendwo in der Wüste.
      </p>
      <p>Finde diesen Schatz, bevor er für immer verloren ist!
          <br>Du musst dich durch die Wüste schlagen, Gegner besiegen und den Schatz finden.
      </p>
      <br>
      <p><strong>Aber Achtung!</strong></p>
      <p>Du bist nicht allein bei der Suche nach dem Gold.</p>
      <p>Denn die Piraten wollen ihr Gold wieder haben!</p>  
      <p>Sammel Steine <img src="images/objects/stones/stone.PNG" alt="Stone"> für deine Verteidigung!</p>
      <br>
      <p>Folge einfach der Spur der Münzen ... 
      <img src="images/objects/coins/coin.png" alt="Münze/coin"> Sie werden dich zum Schatz führen.</p>
      <p>Mit 5 Münzen kannst du dir ein Leben dazu kaufen. Du wirst es brauchen ...</p>
      <p>Viel Spaß!</p>
  `;
}

/**
 * Gibt den Inhalt für die Spiel-Steuerung zurück.
 */
function getControlsContentHTML() {
    return `
        <h3>Steuerung:</h3>
        <p>⬅️ / ➡️ = Laufen</p>
        <p>⬆️ = Springen</p>
        <p> 'space' = Pause on/off</p>
        <p>#️⃣ = Leben kaufen</p>
        <p>↩️ = Stop/Start</p>
        <p><img class="keyboard-D" src="images/help/dTaste.png" alt="D-Taste als Bild">
           = Stein werfen
        </p>
        <p>
           <img src="images/objects/coins/coin.png" alt="coin">
           <img src="images/objects/stones/stone.PNG" alt="stone">
           = Sammle Münzen und Steine!
        </p>
        <p style="font-style: italic;">(DesignProbe)</p>
        <table>
            <tr><th>Steuerung</th><th></th><th>Aktion</th></tr>
            <tr><td style="text-align: left;">⬅️ / ➡️</td><td></td><td style="text-align: left;">Laufen</td></tr>
            <tr><td style="text-align: left;">⬆️</td><td style="width:25px"></td><td style="text-align: left;">Springen</td></tr>
            <tr><td>'space'</td><td></td><td>Pause on/off</td></tr>
            <tr><td>#️⃣</td><td></td><td>Leben kaufen</td></tr>
            <tr><td>↩️</td><td></td><td>Stop/Start</td></tr>
        </table>
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