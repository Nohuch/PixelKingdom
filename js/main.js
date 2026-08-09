```javascript
// =========================
// PIXEL KINGDOM
// =========================


// JOUEUR

let player = {
    x: 600,
    y: 400,
    speed: 6
};


// RESSOURCES

let resources = {
    gold: 200,
    wood: 450,
    stone: 40,
    food: 300,
    gems: 5
};


// JEU

let buildings = [];
let castleLevel = 1;

let playerLevel = 1;
let playerXP = 0;


// ÉLÉMENTS

const playerElement =
    document.getElementById("player");

const world =
    document.getElementById("world");


// =========================
// DÉPLACEMENT
// =========================

document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    // Empêche le navigateur de faire n'importe quoi
    if (
        key === "arrowup" ||
        key === "arrowdown" ||
        key === "arrowleft" ||
        key === "arrowright"
    ) {
        event.preventDefault();
    }


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


    // ATTAQUE

    if (key === "e") {
        attack();
    }


    // Limites

    const maxX =
        world.clientWidth - 60;

    const maxY =
        world.clientHeight - 80;


    player.x = Math.max(
        10,
        Math.min(player.x, maxX)
    );


    player.y = Math.max(
        10,
        Math.min(player.y, maxY)
    );


    updatePlayer();

});


function updatePlayer() {

    playerElement.style.left =
        player.x + "px";

    playerElement.style.top =
        player.y + "px";

}


// =========================
// RESSOURCES
// =========================

function updateResources() {

    document.getElementById("gold").textContent =
        resources.gold;

    document.getElementById("wood").textContent =
        resources.wood;

    document.getElementById("stone").textContent =
        resources.stone;

    document.getElementById("food").textContent =
        resources.food;

    document.getElementById("gems").textContent =
        resources.gems;

}


// =========================
// RÉCOLTE
// =========================

function setupResources() {

    document.querySelectorAll(".resource")
        .forEach(function(resource) {

            resource.addEventListener(
                "click",
                function() {

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


                    setTimeout(function() {

                        resource.remove();

                    }, 250);


                    updateResources();
                    saveGame();

                }
            );

        });

}


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

    let goldCost = 0;
    let woodCost = 0;
    let stoneCost = 0;

    let emoji = "";


    if (type === "house") {

        goldCost = 100;
        woodCost = 50;

        emoji = "🏠";
    }


    if (type === "farm") {

        goldCost = 150;
        woodCost = 80;

        emoji = "🌾";
    }


    if (type === "mine") {

        goldCost = 200;
        stoneCost = 100;

        emoji = "⛏️";
    }


    if (resources.gold < goldCost) {

        showMessage(
            "❌ Pas assez d'or !"
        );

        return;
    }


    if (resources.wood < woodCost) {

        showMessage(
            "❌ Pas assez de bois !"
        );

        return;
    }


    if (resources.stone < stoneCost) {

        showMessage(
            "❌ Pas assez de pierre !"
        );

        return;
    }


    resources.gold -= goldCost;
    resources.wood -= woodCost;
    resources.stone -= stoneCost;


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
// BOUTONS
// =========================

document
    .getElementById("buildButton")
    .addEventListener(
        "click",
        openBuildMenu
    );


document
    .getElementById("closeBuildButton")
    .addEventListener(
        "click",
        closeBuildMenu
    );


document
    .querySelectorAll(
        "[data-building]"
    )
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                build(
                    button.dataset.building
                );

            }
        );

    });


document
    .getElementById("saveButton")
    .addEventListener(
        "click",
        function() {

            saveGame();

            showMessage(
                "💾 Partie sauvegardée !"
            );

        }
    );


document
    .getElementById("upgradeButton")
    .addEventListener(
        "click",
        upgradeCastle
    );


// =========================
// CHÂTEAU
// =========================

function upgradeCastle() {

    const goldCost =
        castleLevel * 300;

    const stoneCost =
        castleLevel * 150;


    if (resources.gold < goldCost) {

        showMessage(
            "❌ Pas assez d'or !"
        );

        return;
    }


    if (resources.stone < stoneCost) {

        showMessage(
            "❌ Pas assez de pierre !"
        );

        return;
    }


    resources.gold -= goldCost;
    resources.stone -= stoneCost;

    castleLevel++;


    document
        .getElementById("castleLevel")
        .textContent =
        castleLevel;


    updateResources();

    saveGame();


    showMessage(
        "🏰 Château niveau "
        + castleLevel
        + " !"
    );

}


// =========================
// PRODUCTION
// =========================

setInterval(function() {

    let gold = 0;
    let food = 0;
    let stone = 0;


    buildings.forEach(function(building) {

        if (building.type === "house") {
            gold += 10;
        }

        if (building.type === "farm") {
            food += 15;
        }

        if (building.type === "mine") {
            stone += 10;
        }

    });


    resources.gold += gold;
    resources.food += food;
    resources.stone += stone;


    if (
        gold > 0 ||
        food > 0 ||
        stone > 0
    ) {

        showMessage(
            "🏭 +"
            + gold + " 🪙  +"
            + food + " 🌾  +"
            + stone + " 🪨"
        );

    }


    updateResources();

    saveGame();

}, 5000);


// =========================
// COMBAT
// =========================

function attack() {

    const enemies =
        document.querySelectorAll(".enemy");


    let enemyFound = false;


    enemies.forEach(function(enemy) {

        const enemyX =
            parseInt(enemy.style.left);

        const enemyY =
            parseInt(enemy.style.top);


        const distance =
            Math.sqrt(

                Math.pow(
                    player.x - enemyX,
                    2
                )

                +

                Math.pow(
                    player.y - enemyY,
                    2
                )

            );


        if (distance < 130) {

            enemyFound = true;

            damageEnemy(enemy);

        }

    });


    if (!enemyFound) {

        showMessage(
            "⚔️ Aucun ennemi assez proche !"
        );

    }

}


function damageEnemy(enemy) {

    let hp =
        Number(enemy.dataset.hp);


    hp -= 25;


    enemy.dataset.hp =
        hp;


    const maxHP =
        Number(enemy.dataset.maxhp);


    const bar =
        enemy.querySelector(
            ".enemy-health-bar"
        );


    if (bar) {

        bar.style.width =
            Math.max(
                0,
                (hp / maxHP) * 100
            ) + "%";

    }


    enemy.classList.add("hit");


    setTimeout(function() {

        enemy.classList.remove("hit");

    }, 200);


    if (hp <= 0) {

        killEnemy(enemy);

    }

}


function killEnemy(enemy) {

    resources.gold += 50;

    playerXP += 25;


    showMessage(
        "⚔️ Monstre vaincu ! +50 🪙 +25 ⭐"
    );


    checkLevel();

    updateResources();
    updateXP();

    saveGame();


    enemy.style.transform =
        "scale(0)";


    setTimeout(function() {

        enemy.remove();

    }, 300);

}


// =========================
// XP
// =========================

function updateXP() {

    document.getElementById("xp").textContent =
        playerXP;

    document.getElementById("level").textContent =
        playerLevel;

}


function checkLevel() {

    const requiredXP =
        playerLevel * 100;


    if (playerXP >= requiredXP) {

        playerXP -= requiredXP;

        playerLevel++;


        showMessage(
            "🎉 Niveau "
            + playerLevel
            + " !"
        );

    }

}


// =========================
// MESSAGE
// =========================

function showMessage(text) {

    const message =
        document.getElementById("message");


    message.textContent =
        text;


    message.classList.add("show");


    setTimeout(function() {

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

        castleLevel: castleLevel,

        playerLevel: playerLevel,

        playerXP: playerXP

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
        updateXP();

        setupResources();

        return;

    }


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


        playerLevel =
            data.playerLevel || 1;


        playerXP =
            data.playerXP || 0;


        buildings.forEach(
            function(data) {

                const building =
                    document.createElement("div");


                building.className =
                    "built-building";


                if (data.type === "house") {
                    building.textContent = "🏠";
                }

                if (data.type === "farm") {
                    building.textContent = "🌾";
                }

                if (data.type === "mine") {
                    building.textContent = "⛏️";
                }


                building.style.left =
                    data.x;

                building.style.top =
                    data.y;


                world.appendChild(
                    building
                );

            }
        );


        document
            .getElementById("castleLevel")
            .textContent =
            castleLevel;


        updatePlayer();
        updateResources();
        updateXP();

        setupResources();

    }
    catch (error) {

        console.log(
            "Erreur de sauvegarde",
            error
        );

        updatePlayer();
        updateResources();
        updateXP();
        setupResources();

    }

}


// =========================
// AUTO-SAVE
// =========================

setInterval(function() {

    saveGame();

}, 10000);


// =========================
// DÉMARRAGE
// =========================

loadGame();
```
