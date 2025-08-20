function getShowGameInfo() {
    return `
    <div class="game-info">
      <img src="images/bg/button/emptyMap.png" alt="leere Schatzkarte als Infobox-Hintergrund" width="100%">  
      <div class="content">
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
          <p>Sammel Steine <img src="images/objects/stones/stone.PNG" alt="Stone" width="16"> für deine Verteidigung!</p>
          <br>
          <p>Folge einfach der Spur der Münzen ... 
          <img src="images/objects/coins/coin.png" alt="Münze/coin" width="16"> Sie werden dich zum Schatz führen.</p>
          <p>Mit 5 Münzen kannst du dir ein Leben dazu kaufen. Du wirst es brauchen ...</p>
          <p>Viel Spaß!</p>
      </div>
    </div>
  `;
}

function hideGameInfo() {
    document.getElementById("game-info").style.display = "none";
}
/**
 * Show the game over overlay
 */
function showGameOver() {
    document.getElementById("gameOverOverlay").style.display = "block";
}
