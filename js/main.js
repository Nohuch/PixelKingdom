```javascript
// =========================
// PIXEL KINGDOM
// =========================


// =========================
// JOUEUR
// =========================

let player = {

    x: 600,

    y: 400,

    speed: 6

};


// =========================
// RESSOURCES
// =========================

let resources = {

    gold: 200,

    wood: 450,

    stone: 40,

    food: 300,

    gems: 5

};


// =========================
// JEU
// =========================

let buildings = [];

let castleLevel = 1;

let playerLevel = 1;

let playerXP = 0;


// =========================
// ÉLÉMENTS
// =========================

const playerElement =
    document.getElementById("player");

const world =
    document.getElementById("world");


// =========================
// DÉMARRAGE
// =========================

loadGame();

updatePlayer();

updateResources();

updateXP();

setupResources();


// =========================
// DÉPLACEMENT
// =========================

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();


        if (
            key === "z" ||
            key === "arrowup"
        ) {

            player.y -= player.speed;

        }


        if (
            key === "s" ||
            key === "arrowdown"
        ) {

            player.y += player.speed;

        }


        if (
            key === "q" ||
            key === "arrowleft"
        ) {

            player.x -= player.speed;

        }


        if (
            key === "d" ||
            key === "arrowright"
        ) {

            player.x += player.speed;

        }


        // Limites de la carte

        const maxX =
            world.clientWidth - 60;

        const maxY =
            world.clientHeight - 80;


        player.x =
            Math.max(
                10,
                Math.min(
                    player.x,
                    maxX
                )
            );


        player.y =
            Math.max(
                70,
                Math.min(
                    player.y,
                    maxY
                )
            );


        updatePlayer();

    }
);


// =========================
// POSITION JOUEUR
// =========================

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

    document.getElementById("gold")
        .textContent =
        resources.gold;


    document.getElementById("wood")
        .textContent =
        resources.wood;


    document.getElementById("stone")
        .textContent =
        resources.stone;


    document.getElementById("food")
        .textContent =
        resources.food;


    document.getElementById("gems")
        .textContent =
        resources.gems;

}


// =========================
// RÉCOLTE
// =========================

function setupResources() {

    const resourceElements =
        document.querySelectorAll(
            ".resource"
        );


    resourceElements.forEach(
        function(resource) {

            resource.addEventListener(
                "click",
                function() {

                    const type =
                        resource.dataset.type;


                    if (
                        type === "wood"
                    ) {

                        resources.wood += 25;

                        showMessage(
                            "🌲 +25 bois !"
                        );

                    }


                    if (
                        type === "stone"
                    ) {

                        resources.stone += 20;

                        showMessage(
                            "🪨 +20 pierre !"
                        );

                    }


                    resource.style.transform =
                        "scale(0)";


                    setTimeout(
                        function() {

                            resource.remove();

                        },
                        250
                    );


                    updateResources();

                    saveGame();

                }
            );

        }
    );

}


// =========================
// MENU CONSTRUCTION
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


// =========================
// CONSTRUIRE
// =========================

function build(type) {

    let goldCost = 0;

    let woodCost = 0;

    let stoneCost = 0;

    let emoji = "";


    if (
        type === "house"
    ) {

        goldCost = 100;

        woodCost = 50;

        emoji = "🏠";

    }


    if (
        type === "farm"
    ) {

        goldCost = 150;

        woodCost = 80;

        emoji = "🌾";

    }


    if (
        type === "mine"
    ) {

        goldCost = 200;

        stoneCost = 100;

        emoji = "⛏️";

    }


    // Vérification or

    if (
        resources.gold <
        goldCost
    ) {

        showMessage(
            "❌ Pas assez d'or !"
        );

        return;

    }


    // Vérification bois

    if (
        resources.wood <
        woodCost
    ) {

        showMessage(
            "❌ Pas assez de bois !"
        );

        return;

    }


    // Vérification pierre

    if (
        resources.stone <
        stoneCost
    ) {

        showMessage(
            "❌ Pas assez de pierre !"
        );

        return;

    }


    // Paiement

    resources.gold -=
        goldCost;

    resources.wood -=
        woodCost;

    resources.stone -=
        stoneCost;


    // Création bâtiment

    const building =
        document.createElement(
            "div"
        );


    building.className =
        "built-building";


    building.textContent =
        emoji;


    building.style.left =
        (
            250 +
            buildings.length *
            100
        ) + "px";


    building.style.top =
        "350px";


    world.appendChild(
        building
    );


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

setInterval(
    function() {

        let gold = 0;

        let food = 0;

        let stone = 0;


        buildings.forEach(
            function(building) {

                if (
                    building.type ===
                    "house"
                ) {

                    gold += 10;

                }


                if (
                    building.type ===
                    "farm"
                ) {

                    food += 15;

                }


                if (
                    building.type ===
                    "mine"
                ) {

                    stone += 10;

                }

            }
        );


        resources.gold +=
            gold;

        resources.food +=
            food;

        resources.stone +=
            stone;


        if (
            gold > 0 ||
            food > 0 ||
            stone > 0
        ) {

            showMessage(
                "🏭 Production : "
                + "+" + gold + " 🪙 "
                + "+" + food + " 🌾 "
                + "+" + stone + " 🪨"
            );

        }


        updateResources();

        saveGame();

    },
    5000
);


// =========================
// CHÂTEAU
// =========================

function upgradeCastle() {

    const goldCost =
        castleLevel * 300;

    const stoneCost =
        castleLevel * 150;


    if (
        resources.gold <
        goldCost
    ) {

        showMessage(
            "❌ Pas assez d'or !"
        );

        return;

    }


    if (
        resources.stone <
        stoneCost
    ) {

        showMessage(
            "❌ Pas assez de pierre !"
        );

        return;

    }


    resources.gold -=
        goldCost;

    resources.stone -=
        stoneCost;


    castleLevel++;


    document
        .getElementById(
            "castleLevel"
        )
        .textContent =
        castleLevel;


    showMessage(
        "🏰 Château niveau "
        + castleLevel
        + " !"
    );


    updateResources();

    saveGame();

}


// =========================
// COMBAT
// =========================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key.toLowerCase()
            === "e"
        ) {

            attack();

        }

    }
);


// =========================
// ATTAQUE
// =========================

function attack() {

    const enemies =
        document.querySelectorAll(
            ".enemy"
        );


    let attacked = false;


    enemies.forEach(
        function(enemy) {

            const playerX =
                player.x;

            const playerY =
                player.y;


            const enemyX =
                parseInt(
                    enemy.style.left
                );


            const enemyY =
                parseInt(
                    enemy.style.top
                );


            const distance =
                Math.sqrt(

                    Math.pow(
                        playerX -
                        enemyX,
                        2
                    )

                    +

                    Math.pow(
                        playerY -
                        enemyY,
                        2
                    )

                );


            // Distance d'attaque

            if (
                distance < 130
            ) {

                damageEnemy(
                    enemy
                );

                attacked = true;

            }

        }
    );


    if (!attacked) {

        showMessage(
            "⚔️ Aucun ennemi à proximité !"
        );

    }

}


// =========================
// DÉGÂTS
// =========================

function damageEnemy(enemy) {

    let hp =
        Number(
            enemy.dataset.hp
        );


    hp -= 25;


    enemy.dataset.hp =
        hp;


    const maxHP =
        Number(
            enemy.dataset.maxhp
        );


    const bar =
        enemy.querySelector(
            ".enemy-health-bar"
        );


    if (bar) {

        bar.style.width =
            (
                hp /
                maxHP *
                100
            ) + "%";

    }


    enemy.classList.add(
        "hit"
    );


    setTimeout(
        function() {

            enemy.classList.remove(
                "hit"
            );

        },
        200
    );


    if (hp <= 0) {

        killEnemy(
            enemy
        );

    }

}


// =========================
// TUER MONSTRE
// =========================

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


    setTimeout(
        function() {

            enemy.remove();

        },
        300
    );

}


// =========================
// XP
// =========================

function updateXP() {

    document
        .getElementById("xp")
        .textContent =
        playerXP;


    document
        .getElementById("level")
        .textContent =
        playerLevel;

}


// =========================
// NIVEAU
// =========================

function checkLevel() {

    const needed =
        playerLevel * 100;


    if (
        playerXP >= needed
    ) {

        playerXP -=
            needed;

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
        document.getElementById(
            "message"
        );


    message.textContent =
        text;


    message.classList.add(
        "show"
    );


    setTimeout(
        function() {

            message.classList.remove(
                "show"
            );

        },
        2500
    );

}


// =========================
// SAUVEGARDE
// =========================

function saveGame() {

    const data = {

        player: player,

        resources: resources,

        buildings: buildings,

        castleLevel:
            castleLevel,

        playerLevel:
            playerLevel,

        playerXP:
            playerXP

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

        return;

    }


    try {

        const data =
            JSON.parse(
                save
            );


        player =
            data.player ||
            player;


        resources =
            data.resources ||
            resources;


        buildings =
            data.buildings ||
            [];


        castleLevel =
            data.castleLevel ||
            1;


        playerLevel =
            data.playerLevel ||
            1;


        playerXP =
            data.playerXP ||
            0;


        // Recréer bâtiments

        buildings.forEach(
            function(data) {

                const building =
                    document.createElement(
                        "div"
                    );


                building.className =
                    "built-building";


                if (
                    data.type ===
                    "house"
                ) {

                    building.textContent =
                        "🏠";

                }


                if (
                    data.type ===
                    "farm"
                ) {

                    building.textContent =
                        "🌾";

                }


                if (
                    data.type ===
                    "mine"
                ) {

                    building.textContent =
                        "⛏️";

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
            .getElementById(
                "castleLevel"
            )
            .textContent =
            castleLevel;


    }
    catch (error) {

        console.log(
            "Erreur de sauvegarde",
            error
        );

    }

}


// =========================
// SAUVEGARDE AUTOMATIQUE
// =========================

setInterval(
    function() {

        saveGame();

    },
    10000
);
```
