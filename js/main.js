let player = {
    x: 600,
    y: 400,
    speed: 6
};

let resources = {
    gold: 500,
    wood: 250,
    stone: 150,
    food: 300,
    gems: 5
};

const playerElement = document.getElementById("player");
const world = document.getElementById("world");

function updatePlayer() {
    playerElement.style.left = player.x + "px";
    playerElement.style.top = player.y + "px";
}

document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    if (key === "z" || key === "arrowup") {
        player.y -= player.speed;
    }

    if (key === "s" || key === "arrowdown") {
        player.y += player.speed;
    }

    if (key === "q" || key === "arrowleft") {
        player.x -= player.speed;
    }

    if (key === "d" || key === "arrowright") {
        player.x += player.speed;
    }

    // Empêcher le joueur de sortir de la carte
    const maxX = world.clientWidth - 60;
    const maxY = world.clientHeight - 90;

    player.x = Math.max(10, Math.min(player.x, maxX));
    player.y = Math.max(70, Math.min(player.y, maxY));

    updatePlayer();
});


function showMessage(text) {

    const message = document.getElementById("message");

    message.textContent = text;
    message.classList.add("show");

    setTimeout(() => {
        message.classList.remove("show");
    }, 2500);
}


function saveGame() {

    const gameData = {
        player: player,
        resources: resources
    };

    localStorage.setItem(
        "pixelKingdomSave",
        JSON.stringify(gameData)
    );

    showMessage("💾 Partie sauvegardée !");
}


function loadGame() {

    const save = localStorage.getItem("pixelKingdomSave");

    if (!save) {
        updatePlayer();
        return;
    }

    const data = JSON.parse(save);

    player = data.player;
    resources = data.resources;

    updatePlayer();
    updateResources();
}


function updateResources() {

    document.getElementById("gold").textContent = resources.gold;
    document.getElementById("wood").textContent = resources.wood;
    document.getElementById("stone").textContent = resources.stone;
    document.getElementById("food").textContent = resources.food;
    document.getElementById("gems").textContent = resources.gems;
}


// Sauvegarde automatique
setInterval(() => {
    const gameData = {
        player: player,
        resources: resources
    };

    localStorage.setItem(
        "pixelKingdomSave",
        JSON.stringify(gameData)
    );
}, 10000);


loadGame();
