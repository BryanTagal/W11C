
"use strict";

const pokemonList = [
    {
        id: "pikachu",
        name: "Pikachu",
        type: "Electric",
        health: 100,
        image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        attacks: [
            {
                id: "quick-attack",
                name: "Quick Attack",
                minDamage: 12,
                maxDamage: 20,
                pp: 10,
                description: "Fast physical attack"
            },
            {
                id: "thunderbolt",
                name: "Thunderbolt",
                minDamage: 20,
                maxDamage: 32,
                pp: 6,
                description: "Powerful electric attack"
            },
            {
                id: "nuzzle",
                name: "Nuzzle",
                minDamage: 5,
                maxDamage: 12,
                pp: 8,
                effect: "stun",
                description: "May paralyze the opponent"
            },
            {
                id: "charge",
                name: "Charge",
                minDamage: 0,
                maxDamage: 0,
                pp: 5,
                effect: "boost",
                description: "Strengthens your next attacks"
            }
        ]
    },
    {
        id: "charmander",
        name: "Charmander",
        type: "Fire",
        health: 100,
        image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
        attacks: [
            {
                id: "scratch",
                name: "Scratch",
                minDamage: 12,
                maxDamage: 20,
                pp: 10,
                description: "A basic physical attack"
            },
            {
                id: "flame-burst",
                name: "Flame Burst",
                minDamage: 22,
                maxDamage: 34,
                pp: 6,
                description: "A strong fire attack"
            },
            {
                id: "growl",
                name: "Growl",
                minDamage: 0,
                maxDamage: 0,
                pp: 7,
                effect: "weaken",
                description: "Weakens the opponent's attacks"
            },
            {
                id: "ember",
                name: "Ember",
                minDamage: 15,
                maxDamage: 25,
                pp: 8,
                description: "A small burst of fire"
            }
        ]
    },
    {
        id: "bulbasaur",
        name: "Bulbasaur",
        type: "Grass",
        health: 100,
        image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        attacks: [
            {
                id: "tackle",
                name: "Tackle",
                minDamage: 12,
                maxDamage: 20,
                pp: 10,
                description: "A straightforward attack"
            },
            {
                id: "vine-whip",
                name: "Vine Whip",
                minDamage: 18,
                maxDamage: 30,
                pp: 7,
                description: "Strikes with vines"
            },
            {
                id: "sleep-powder",
                name: "Sleep Powder",
                minDamage: 0,
                maxDamage: 0,
                pp: 4,
                effect: "stun",
                description: "Makes the opponent miss a turn"
            },
            {
                id: "growth",
                name: "Growth",
                minDamage: 0,
                maxDamage: 0,
                pp: 5,
                effect: "boost",
                description: "Strengthens your next attacks"
            }
        ]
    }
];

function getCookie(name) {
    const prefix = name + "=";
    const parts = document.cookie.split(";");

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();

        if (part.startsWith(prefix)) {
            return decodeURIComponent(part.substring(prefix.length));
        }
    }

    return null;
}

function setCookie(name, value) {
    document.cookie =
        name + "=" + encodeURIComponent(value) +
        "; max-age=604800; path=/; SameSite=Lax";
}

function deleteCookie(name) {
    document.cookie =
        name + "=; max-age=0; path=/; SameSite=Lax";
}

function saveBattle(battle) {
    setCookie("battleState", JSON.stringify(battle));

    setCookie(
        "userCurrentHealth",
        String(battle.userCurrentHealth)
    );

    setCookie(
        "computerCurrentHealth",
        String(battle.computerCurrentHealth)
    );

    setCookie(
        "userPokemonSelection",
        JSON.stringify(battle.userPokemonSelection)
    );

    setCookie(
        "computerPokemonSelection",
        JSON.stringify(battle.computerPokemonSelection)
    );
}

function loadBattle() {
    const saved = getCookie("battleState");

    if (!saved) {
        return null;
    }

    try {
        const battle = JSON.parse(saved);

        if (
            !battle.userPokemonSelection ||
            !battle.computerPokemonSelection ||
            !Array.isArray(battle.battleLog) ||
            !battle.userMovePP ||
            !battle.computerMovePP
        ) {
            return null;
        }

        return battle;
    } catch (error) {
        return null;
    }
}

function deleteBattleCookies() {
    [
        "battleState",
        "userCurrentHealth",
        "computerCurrentHealth",
        "userPokemonSelection",
        "computerPokemonSelection"
    ].forEach(deleteCookie);
}

function createMovePP(pokemon) {
    const pp = {};

    pokemon.attacks.forEach(function (attack) {
        pp[attack.id] = attack.pp;
    });

    return pp;
}

function choosePokemon(pokemonId) {
    const chosen = pokemonList.find(function (pokemon) {
        return pokemon.id === pokemonId;
    });

    if (!chosen) {
        return;
    }

    const possibleEnemies = pokemonList.filter(function (pokemon) {
        return pokemon.id !== chosen.id;
    });

    const enemy = possibleEnemies[
        Math.floor(Math.random() * possibleEnemies.length)
    ];

    const battle = {
        userPokemonSelection: chosen,
        computerPokemonSelection: enemy,
        userCurrentHealth: chosen.health,
        computerCurrentHealth: enemy.health,
        userMovePP: createMovePP(chosen),
        computerMovePP: createMovePP(enemy),
        potions: 2,
        pokeballs: 3,
        userBoostTurns: 0,
        enemyWeakTurns: 0,
        enemyStunTurns: 0,
        userStunTurns: 0,
        winner: null,
        caught: false,
        battleLog: [
            chosen.name + " entered the battle against " + enemy.name + "!"
        ]
    };

    saveBattle(battle);
    window.location.href = "battle.html";
}

function renderPokemonSelection() {
    const container = document.getElementById("pokemon-list");

    if (!container) {
        return;
    }

    container.replaceChildren();

    pokemonList.forEach(function (pokemon) {
        const card = document.createElement("article");
        card.className = "pokemon-card";

        const image = document.createElement("img");
        image.src = pokemon.image_url;
        image.alt = pokemon.name;

        const title = document.createElement("h2");
        title.textContent = pokemon.name;

        const type = document.createElement("span");
        type.className = "type";
        type.textContent = pokemon.type;

        const description = document.createElement("p");
        description.textContent =
            pokemon.health + " HP · " + pokemon.attacks.length + " unique moves";

        const button = document.createElement("button");
        button.textContent = "Choose " + pokemon.name;

        button.addEventListener("click", function () {
            choosePokemon(pokemon.id);
        });

        card.append(image, title, type, description, button);
        container.appendChild(card);
    });

    const resumeArea = document.getElementById("resume-area");
    const message = document.getElementById("message");
    const savedBattle = loadBattle();

    resumeArea.replaceChildren();

    if (savedBattle && !savedBattle.winner) {
        const resumeLink = document.createElement("a");
        resumeLink.href = "battle.html";
        resumeLink.className = "resume-link";
        resumeLink.textContent = "Resume Existing Battle";
        resumeArea.appendChild(resumeLink);
    } else if (savedBattle && savedBattle.winner) {
        message.textContent =
            "Your last battle is finished. Choose a Pokémon to play again.";
    }
}

function updateHealthBar(bar, currentHealth, maximumHealth) {
    const percentage = Math.max(
        0,
        Math.min(100, currentHealth / maximumHealth * 100)
    );

    bar.style.width = percentage + "%";

    if (percentage > 50) {
        bar.style.backgroundColor = "#22c55e";
    } else if (percentage > 20) {
        bar.style.backgroundColor = "#f59e0b";
    } else {
        bar.style.backgroundColor = "#ef4444";
    }
}

function randomDamage(attack, boosted, weakened) {
    const baseDamage = Math.floor(
        attack.minDamage +
        Math.random() * (attack.maxDamage - attack.minDamage + 1)
    );

    let damage = baseDamage;

    if (boosted) {
        damage = Math.floor(damage * 1.5);
    }

    if (weakened) {
        damage = Math.floor(damage * 0.5);
    }

    return damage;
}

function addLog(battle, message) {
    battle.battleLog.push(message);

    if (battle.battleLog.length > 40) {
        battle.battleLog = battle.battleLog.slice(-40);
    }
}

function updateStatus(battle) {
    const status = document.getElementById("battle-status");

    if (battle.winner === "caught") {
        status.textContent =
            "Pokémon caught! You caught " +
            battle.computerPokemonSelection.name + "!";
    } else if (battle.winner === "player") {
        status.textContent = "Victory! You won the battle!";
    } else if (battle.winner === "computer") {
        status.textContent = "Defeat! Your Pokémon fainted.";
    } else {
        status.textContent = "Your turn! Choose a move or use an item.";
    }
}

function renderBattle() {
    const attacksContainer = document.getElementById("attacks");

    if (!attacksContainer) {
        return;
    }

    const battle = loadBattle();

    if (!battle) {
        document.getElementById("battle-status").textContent =
            "No saved battle. Please choose a Pokémon first.";

        attacksContainer.replaceChildren();
        document.getElementById("potion-button").disabled = true;
        document.getElementById("catch-button").disabled = true;
        return;
    }

    document.getElementById("user-name").textContent =
        battle.userPokemonSelection.name;

    document.getElementById("user-image").src =
        battle.userPokemonSelection.image_url;

    document.getElementById("user-image").alt =
        battle.userPokemonSelection.name;

    document.getElementById("computer-name").textContent =
        battle.computerPokemonSelection.name;

    document.getElementById("computer-image").src =
        battle.computerPokemonSelection.image_url;

    document.getElementById("computer-image").alt =
        battle.computerPokemonSelection.name;

    document.getElementById("user-hp").textContent =
        "HP: " + battle.userCurrentHealth + " / " +
        battle.userPokemonSelection.health;

    document.getElementById("computer-hp").textContent =
        "HP: " + battle.computerCurrentHealth + " / " +
        battle.computerPokemonSelection.health;

    updateHealthBar(
        document.getElementById("user-health-bar"),
        battle.userCurrentHealth,
        battle.userPokemonSelection.health
    );

    updateHealthBar(
        document.getElementById("computer-health-bar"),
        battle.computerCurrentHealth,
        battle.computerPokemonSelection.health
    );

    const userEffects = [];

    if (battle.userBoostTurns > 0) {
        userEffects.push("Attack boosted");
    }

    if (battle.userStunTurns > 0) {
        userEffects.push("Stunned");
    }

    document.getElementById("user-effects").textContent =
        userEffects.join(" · ");

    const enemyEffects = [];

    if (battle.enemyWeakTurns > 0) {
        enemyEffects.push("Attack weakened");
    }

    if (battle.enemyStunTurns > 0) {
        enemyEffects.push("Stunned");
    }

    document.getElementById("computer-effects").textContent =
        enemyEffects.join(" · ");

    updateStatus(battle);

    const logContainer = document.getElementById("battle-log");
    logContainer.replaceChildren();

    battle.battleLog.forEach(function (entry) {
        const paragraph = document.createElement("p");
        paragraph.textContent = entry;
        logContainer.appendChild(paragraph);
    });

    logContainer.scrollTop = logContainer.scrollHeight;

    attacksContainer.replaceChildren();

    const finished = Boolean(battle.winner);

    battle.userPokemonSelection.attacks.forEach(function (attack) {
        const button = document.createElement("button");
        button.className = "move-button";

        const remainingPP = battle.userMovePP[attack.id] || 0;

        const title = document.createElement("span");
        title.textContent = attack.name;

        const details = document.createElement("span");
        details.className = "move-detail";

        if (attack.minDamage === 0 && attack.maxDamage === 0) {
            details.textContent =
                "Effect move · PP " + remainingPP + "/" + attack.pp;
        } else {
            details.textContent =
                attack.minDamage + "–" + attack.maxDamage +
                " damage · PP " + remainingPP + "/" + attack.pp;
        }

        button.append(title, details);
        button.disabled = finished || remainingPP <= 0;

        button.addEventListener("click", function () {
            userAttack(attack.id);
        });

        attacksContainer.appendChild(button);
    });

    const potionButton = document.getElementById("potion-button");
    potionButton.textContent = "Potion × " + battle.potions;
    potionButton.disabled =
        finished ||
        battle.potions <= 0 ||
        battle.userCurrentHealth >= battle.userPokemonSelection.health;

    const catchButton = document.getElementById("catch-button");
    catchButton.textContent = "Poké Ball × " + battle.pokeballs;
    catchButton.disabled = finished || battle.pokeballs <= 0;

    document.getElementById("item-info").textContent =
        "Potions: " + battle.potions +
        " · Poké Balls: " + battle.pokeballs +
        " · Catch chance increases when the opponent has low HP.";
}

function userAttack(attackId) {
    const battle = loadBattle();

    if (!battle || battle.winner) {
        return;
    }

    const attack = battle.userPokemonSelection.attacks.find(
        function (move) {
            return move.id === attackId;
        }
    );

    if (!attack || (battle.userMovePP[attack.id] || 0) <= 0) {
        return;
    }

    battle.userMovePP[attack.id]--;

    if (attack.effect === "boost") {
        battle.userBoostTurns = 2;

        addLog(
            battle,
            battle.userPokemonSelection.name +
            " used " + attack.name +
            "! Its attacks are stronger for the next two attacks."
        );
    } else if (attack.effect === "weaken") {
        battle.enemyWeakTurns = 2;

        addLog(
            battle,
            battle.userPokemonSelection.name +
            " used " + attack.name +
            "! The opponent's next two attacks are weakened."
        );
    } else if (attack.effect === "stun") {
        const damage = randomDamage(attack, false, false);

        battle.computerCurrentHealth = Math.max(
            0,
            battle.computerCurrentHealth - damage
        );

        addLog(
            battle,
            battle.userPokemonSelection.name +
            " used " + attack.name +
            " for " + damage + " damage!"
        );

        if (battle.computerCurrentHealth > 0) {
            battle.enemyStunTurns = 1;
            addLog(
                battle,
                battle.computerPokemonSelection.name +
                " is stunned and will miss its next turn!"
            );
        }
    } else {
        const boosted = battle.userBoostTurns > 0;
        const damage = randomDamage(attack, boosted, false);

        battle.computerCurrentHealth = Math.max(
            0,
            battle.computerCurrentHealth - damage
        );

        addLog(
            battle,
            battle.userPokemonSelection.name +
            " used " + attack.name +
            " for " + damage + " damage!"
        );

        if (boosted) {
            battle.userBoostTurns--;
        }
    }

    if (battle.computerCurrentHealth <= 0) {
        battle.winner = "player";

        addLog(
            battle,
            battle.computerPokemonSelection.name +
            " fainted! You win!"
        );

        saveBattle(battle);
        renderBattle();
        return;
    }

    saveBattle(battle);
    enemyTurn(battle);
}

function enemyTurn(battle) {
    if (battle.winner) {
        saveBattle(battle);
        renderBattle();
        return;
    }

    if (battle.enemyStunTurns > 0) {
        battle.enemyStunTurns--;

        addLog(
            battle,
            battle.computerPokemonSelection.name +
            " is stunned and cannot move!"
        );

        saveBattle(battle);
        renderBattle();
        return;
    }

    const availableAttacks =
        battle.computerPokemonSelection.attacks.filter(
            function (attack) {
                return (battle.computerMovePP[attack.id] || 0) > 0;
            }
        );

    if (availableAttacks.length === 0) {
        const damage = Math.floor(5 + Math.random() * 6);

        battle.userCurrentHealth = Math.max(
            0,
            battle.userCurrentHealth - damage
        );

        addLog(
            battle,
            battle.computerPokemonSelection.name +
            " used Struggle for " + damage + " damage!"
        );
    } else {
        const attack = availableAttacks[
            Math.floor(Math.random() * availableAttacks.length)
        ];

        battle.computerMovePP[attack.id]--;

        if (attack.effect === "boost") {
            battle.computerBoostTurns = 2;

            addLog(
                battle,
                battle.computerPokemonSelection.name +
                " used " + attack.name +
                " and strengthened its next attacks!"
            );
        } else if (attack.effect === "weaken") {
            battle.userWeakTurns = 2;

            addLog(
                battle,
                battle.computerPokemonSelection.name +
                " used " + attack.name +
                "! Your next two attacks are weakened."
            );
        } else if (attack.effect === "stun") {
            const damage = randomDamage(attack, false, false);

            battle.userCurrentHealth = Math.max(
                0,
                battle.userCurrentHealth - damage
            );

            addLog(
                battle,
                battle.computerPokemonSelection.name +
                " used " + attack.name +
                " for " + damage + " damage!"
            );

            if (battle.userCurrentHealth > 0) {
                battle.userStunTurns = 1;

                addLog(
                    battle,
                    battle.userPokemonSelection.name +
                    " is stunned and will miss its next turn!"
                );
            }
        } else {
            const boosted = (battle.computerBoostTurns || 0) > 0;
            const weakened = battle.enemyWeakTurns > 0;

            const damage = randomDamage(attack, boosted, weakened);

            battle.userCurrentHealth = Math.max(
                0,
                battle.userCurrentHealth - damage
            );

            addLog(
                battle,
                battle.computerPokemonSelection.name +
                " used " + attack.name +
                " for " + damage + " damage!"
            );

            if (boosted) {
                battle.computerBoostTurns--;
            }

            if (weakened) {
                battle.enemyWeakTurns--;
            }
        }
    }

    if (battle.userCurrentHealth <= 0) {
        battle.winner = "computer";

        addLog(
            battle,
            battle.userPokemonSelection.name +
            " fainted! You lost the battle."
        );
    }

    saveBattle(battle);
    renderBattle();
}

function usePotion() {
    const battle = loadBattle();

    if (
        !battle ||
        battle.winner ||
        battle.potions <= 0 ||
        battle.userCurrentHealth >= battle.userPokemonSelection.health
    ) {
        return;
    }

    battle.potions--;

    const oldHealth = battle.userCurrentHealth;

    battle.userCurrentHealth = Math.min(
        battle.userPokemonSelection.health,
        battle.userCurrentHealth + 30
    );

    const healed = battle.userCurrentHealth - oldHealth;

    addLog(
        battle,
        "You used a Potion and restored " + healed + " HP!"
    );

    saveBattle(battle);
    enemyTurn(battle);
}

function throwPokeball() {
    const battle = loadBattle();

    if (!battle || battle.winner || battle.pokeballs <= 0) {
        return;
    }

    battle.pokeballs--;

    const healthRatio =
        battle.computerCurrentHealth /
        battle.computerPokemonSelection.health;

    let catchChance = 0.1;

    if (healthRatio <= 0.5) {
        catchChance = 0.25;
    }

    if (healthRatio <= 0.25) {
        catchChance = 0.5;
    }

    if (healthRatio <= 0.1) {
        catchChance = 0.75;
    }

    addLog(
        battle,
        "You threw a Poké Ball at " +
        battle.computerPokemonSelection.name + "!"
    );

    if (Math.random() < catchChance) {
        battle.winner = "caught";
        battle.caught = true;

        addLog(
            battle,
            "Success! You caught " +
            battle.computerPokemonSelection.name + "!"
        );

        saveBattle(battle);
        renderBattle();
        return;
    }

    addLog(
        battle,
        "Oh no! " + battle.computerPokemonSelection.name +
        " broke free. Catch chance was " +
        Math.round(catchChance * 100) + "%."
    );

    saveBattle(battle);
    enemyTurn(battle);
}

function startNewBattle() {
    deleteBattleCookies();
    window.location.href = "index.html";
}

renderPokemonSelection();
renderBattle();

const newBattleButton = document.getElementById("new-battle");

if (newBattleButton) {
    newBattleButton.addEventListener("click", startNewBattle);
}

const potionButton = document.getElementById("potion-button");

if (potionButton) {
    potionButton.addEventListener("click", usePotion);
}

const catchButton = document.getElementById("catch-button");

if (catchButton) {
    catchButton.addEventListener("click", throwPokeball);
}
