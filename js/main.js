```javascript
// =========================
// PIXEL KINGDOM
// =========================

let player = {
    x: 600,
    y: 400,
    speed: 6
};

let resources = {
    gold: 200,
    wood: 450,
    stone: 40,
    food: 300,
    gems: 5
};

let buildings = [];
let castleLevel = 1;


// =========================
// ÉLÉMENTS HTML
// =========================

const playerElement = document.getElementById("player");
const world = document.getElementById("world");


// =========================
// DÉMARRAGE
// =========================

if (playerElement && world) {
    loadGame();
    updatePlayer();
    updateResources();
    setupResources();
}


// =========================
// JOUEUR
// =========================

function updatePlayer() {

    playerElement.style.left = player.x + "px";
    playerElement.style.top = player.y + "px";

}


// =========================
// DÉPLACEMENT
// =========================

document.addEventListener("keydown", function(event) {

    if (!playerElement || !world) return;

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


    const maxX = world.clientWidth - 60;
    const maxY = world.clientHeight - 80;


    player.x = Math.max(
        10,
        Math.min(player.x, maxX)
    );

    player.y = Math.max(
        70,
        Math.min(player.y, maxY)
    );


    updatePlayer();

});


// =========================
// RESSOURCES
// =========================

function updateResources() {

    const gold = document.getElementById("gold");
    const wood = document.getElementById("wood");
    const stone = document.getElementById("stone");
    const food = document.getElementById("food");
    const gems = document.getElementById("gems");


    if (gold)
        gold.textContent = resources.gold;

    if (wood)
        wood.textContent = resources.wood;

    if (stone)
        stone.textContent = resources.stone;

    if (food)
        food.textContent = resources.food;

    if (gems)
        gems.textContent = resources.gems;

}


// =========================
// RÉCOLTE
// =========================

function setupResources() {

    document
        .querySelectorAll(".resource")
        .forEach(resource => {

            resource.addEventListener("click", function() {

                const type = resource.dataset.type;


                if (type === "wood") {

                    resources.wood += 25;

                    showMessage(
                        "🌲 +25 bois !"
                    );

                }


                if (type === "stone") {

                    resources.stone += 20;

                    showMessage(
                        "🪨 +20 pierre !"
                    );

                }


                resource.style.transform = "scale(0)";


                setTimeout(() => {

                    resource.remove();

                }, 250);


                updateResources();
                saveGame();

            });

        });

}


// =========================
// MENU CONSTRUCTION
// =========================

function openBuildMenu() {

    const menu =
        document.getElementById("buildMenu");

    if (menu) {
        menu.classList.add("open");
    }

}


function closeBuildMenu() {

    const menu =
        document.getElementById("buildMenu");

    if (menu) {
        menu.classList.remove("open");
    }

}


// =========================
// CONSTRUCTION
// =========================

function build(type) {

    let costGold = 0;
    let costWood = 0;
    let costStone = 0;
    let emoji = "";


    if (type === "house") {

        costGold = 100;
        costWood = 50;
        emoji = "🏠";

    }


    if (type === "farm") {

        costGold = 150;
        costWood = 80;
        emoji = "🌾";

    }


    if (type === "mine") {

        costGold = 200;
        costStone = 100;
        emoji = "⛏️";

    }


    if (resources.gold < costGold) {

        showMessage(
            "❌ Pas assez d'or !"
        );

        return;

    }


    if (resources.wood < costWood) {

        showMessage(
            "❌ Pas assez de bois !"
        );

        return;

    }


    if (resources.stone < costStone) {

        showMessage(
            "❌ Pas assez de pierre !"
        );

        return;

    }


    resources.gold -= costGold;
    resources.wood -= costWood;
    resources.stone -= costStone;


    const building =
        document.createElement("div");


    building.className =
        "built-building";


    building.textContent =
        emoji;


    const position =
        250 + buildings.length * 100;


    building.style.left =
        position + "px";


    building.style.top =
        "350px";


    world.appendChild(building);


    buildings.push({

        type: type,

        x: building.style.left,

        y: building.style.top

    });


    updateResources();

    closeBuildMenu();

    showMessage(
        "🏗️ Construction terminée !"
    );


    saveGame();

}


// =========================
// PRODUCTION
// =========================

function produceResources() {

    let goldProduced = 0;
    let foodProduced = 0;
    let stoneProduced = 0;


    buildings.forEach(building => {

        if (building.type === "house") {

            goldProduced += 10;

        }


        if (building.type === "farm") {

            foodProduced += 15;

        }


        if (building.type === "mine") {

            stoneProduced += 10;

        }

    });


    if (goldProduced > 0) {

        resources.gold += goldProduced;

    }


    if (foodProduced > 0) {

        resources.food += foodProduced;

    }


    if (stoneProduced > 0) {

        resources.stone += stoneProduced;

    }


    if (
        goldProduced > 0 ||
        foodProduced > 0 ||
        stoneProduced > 0
    ) {

        let message = "🏭 Production : ";

        if (goldProduced > 0)
            message += `+${goldProduced} 🪙 `;

        if (foodProduced > 0)
            message += `+${foodProduced} 🌾 `;

        if (stoneProduced > 0)
            message += `+${stoneProduced} 🪨 `;

        showMessage(message);

        updateResources();

        saveGame();

    }

}


// Production toutes les 5 secondes
setInterval(
    produceResources,
    5000
);


// =========================
// CHÂTEAU
// =========================

function upgradeCastle() {

    const costGold =
        castleLevel * 300;

    const costStone =
        castleLevel * 150;


    if (resources.gold < costGold) {

        showMessage(
            "❌ Pas assez d'or !"
        );

        return;

    }


    if (resources.stone < costStone) {

        showMessage(
            "❌ Pas assez de pierre !"
        );

        return;

    }


    resources.gold -= costGold;
    resources.stone -= costStone;

    castleLevel++;


    const level =
        document.getElementById(
            "castleLevel"
        );


    if (level) {

        level.textContent =
            castleLevel;

    }


    showMessage(
        "🏰 Château niveau "
        + castleLevel
        + " !"
    );


    updateResources();

    saveGame();

}


// =========================
// MESSAGE
// =========================

function showMessage(text) {

    const message =
        document.getElementById("message");


    if (!message) return;


    message.textContent = text;

    message.classList.add("show");


    setTimeout(() => {

        message.classList.remove("show");

    }, 2500);

}


// =========================
// SAUVEGARDE
// =========================

function saveGame() {

    const data = {

        player: player,

        resources: resources,

        buildings: buildings,

        castleLevel: castleLevel

    };


    localStorage.setItem(
        "pixelKingdomSave",
        JSON.stringify(data)
    );

}


// =========================
// CHARGEMENT
// =========================

function loadGame() {

    const save =
        localStorage.getItem(
            "pixelKingdomSave"
        );


    if (!save) return;


    try {

        const data =
            JSON.parse(save);


        player =
            data.player || player;


        resources =
            data.resources || resources;


        buildings =
            data.buildings || [];


        castleLevel =
            data.castleLevel || 1;


        buildings.forEach(data => {

            const building =
                document.createElement("div");


            building.className =
                "built-building";


            if (data.type === "house")
                building.textContent = "🏠";

            if (data.type === "farm")
                building.textContent = "🌾";

            if (data.type === "mine")
                building.textContent = "⛏️";


            building.style.left =
                data.x;

            building.style.top =
                data.y;


            world.appendChild(building);

        });


        const level =
            document.getElementById(
                "castleLevel"
            );


        if (level) {

            level.textContent =
                castleLevel;

        }


    } catch (error) {

        console.error(
            "Erreur de sauvegarde :",
            error
        );

    }

}


// =========================
// AUTO-SAVE
// =========================

setInterval(() => {

    saveGame();

}, 10000);
```
