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


let buildings = [];

let castleLevel = 1;


const playerElement =
    document.getElementById("player");

const world =
    document.getElementById("world");


// =========================
// DÉPLACEMENT
// =========================

function updatePlayer() {

    playerElement.style.left =
        player.x + "px";

    playerElement.style.top =
        player.y + "px";
}


document.addEventListener("keydown", function(event) {

    const key =
        event.key.toLowerCase();


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


    const maxX =
        world.clientWidth - 60;

    const maxY =
        world.clientHeight - 90;


    player.x =
        Math.max(
            10,
            Math.min(player.x, maxX)
        );


    player.y =
        Math.max(
            70,
            Math.min(player.y, maxY)
        );


    updatePlayer();

});


// =========================
// RESSOURCES
// =========================

function updateResources() {

    document.getElementById("gold")
        .textContent = resources.gold;

    document.getElementById("wood")
        .textContent = resources.wood;

    document.getElementById("stone")
        .textContent = resources.stone;

    document.getElementById("food")
        .textContent = resources.food;

    document.getElementById("gems")
        .textContent = resources.gems;

}


// =========================
// RÉCOLTE
// =========================

document
    .querySelectorAll(".resource")
    .forEach(resource => {

        resource.addEventListener("click", function() {

            const type =
                resource.dataset.type;


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


            resource.style.transform =
                "scale(0)";


            setTimeout(() => {

                resource.remove();

            }, 250);


            updateResources();

            saveGame();

        });

    });


// =========================
// CONSTRUCTION
// =========================

function openBuildMenu() {

    document
        .getElementById("buildMenu")
        .classList.add("open");

}


function closeBuildMenu() {

    document
        .getElementById("buildMenu")
        .classList.remove("open");

}


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


    building.style.left =
        (300 + buildings.length * 90) +
        "px";


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


    document.getElementById(
        "castleLevel"
    ).textContent = castleLevel;


    showMessage(
        "🏰 Château amélioré au niveau "
        + castleLevel + " !"
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


    if (!save) {

        updatePlayer();

        updateResources();

        return;

    }


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


    updatePlayer();

    updateResources();


    document.getElementById(
        "castleLevel"
    ).textContent =
        castleLevel;


    // Reconstruire les bâtiments

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

}


// =========================
// AUTO-SAVE
// =========================

setInterval(() => {

    saveGame();

}, 10000);


loadGame();
