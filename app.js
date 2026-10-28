
"use strict";

const pokemonList = [
    {
        id: "pikachu",
        name: "Pikachu",
        type: "Electric",
        health: 100,
        image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        attacks: [
            { name: "Quick Attack", damage: 15 },
            { name: "Thunderbolt", damage: 25 },
            { name: "Iron Tail", damage: 20 }
        ]
    },
    {
        id: "charmander",
        name: "Charmander",
        type: "Fire",
        health: 100,
        image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
        attacks: [
            { name: "Quick Attack", damage: 15 },
            { name: "Flame Burst", damage: 25 },
            { name: "Scratch", damage: 20 }
        ]
    },
    {
        id: "bulbasaur",
        name: "Bulbasaur",
        type: "Grass",
        health: 100,
        image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        attacks: [
            { name: "Tackle", damage: 15 },
            { name: "Vine Whip", damage: 25 },
            { name: "Razor Leaf", damage: 20 }
        ]
    }
];

const enemyOptions = pokemonList.filter(function (pokemon) {
    return pokemon.id !== getCookie("userPokemonId");
});

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
}

function loadBattle() {
    const saved = getCookie("battleState");

    if (!saved) {
        return null;
    }

    try {
        return JSON.parse(saved);
    } catch (error) {
        return null;
    }
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
        winner: null,
        battleLog: ["A battle between " + chosen.name + " and " + enemy.name + " begins!"]
    };

    saveBattle(battle);
    window.location.href = "battle.html";
}

function renderPokemonSelection() {
    const container = document.getElementById("pokemon-list");

    if (!container) {
        return;
    }

    pokemonList.forEach(function (pokemon) {
        const card = document.createElement("article");
        card.className = "pokemon-card";

        const image = document.createElement("img");
        image.src = pokemon.image_url;
        image.alt = pokemon.name;

        const title = document.createElement("h2");
        title.textContent = pokemon.name;

        const description = document.createElement("p");
        description.textContent = pokemon.type + " type Pokémon · 100 HP";

        const button = document.createElement("button");
        button.textContent = "Choose " + pokemon.name;

        button.addEventListener("click", function () {
            choosePokemon(pokemon.id);
        });

        card.append(image, title, description, button);
        container.appendChild(card);
    });

    const savedBattle = loadBattle();
    const resumeArea = document.getElementById("resume-area");

    if (savedBattle && !savedBattle.winner) {
        const resumeLink = document.createElement("a");
        resumeLink.href = "battle.html";
        resumeLink.className = "resume-link";
        resumeLink.textContent = "Resume Existing Battle";
        resumeArea.appendChild(resumeLink);
    } else if (savedBattle && savedBattle.winner) {
        const message = document.getElementById("message");
        message.textContent = "Your last battle is finished. Choose a Pokémon to start again.";
    }
}

function updateHealthBar(bar, currentHealth, maximumHealth) {
    const percentage = Math.max(0, currentHealth / maximumHealth * 100);

    bar.style.width = percentage + "%";

    if (percentage > 50) {
        bar.style.backgroundColor = "#22c55e";
    } else if (percentage > 20) {
        bar.style.backgroundColor = "#f59e0b";
    } else {
        bar.style.backgroundColor = "#ef4444";
    }
}

function renderBattle() {
    const attacksContainer = document.getElementById("attacks");

    if (!attacksContainer) {
        return;
    }

    let battle = loadBattle();

    if (!battle) {
        document.getElementById("battle-status").textContent =
            "No saved battle. Please choose a Pokémon first.";
        attacksContainer.replaceChildren();
        return;
    }

    document.getElementById("user-name").textContent =
        battle.userPokemonSelection.name;

    document.getElementById("user-image").src =
        battle.userPokemonSelection.image_url;

    document.getElementById("computer-name").textContent =
        battle.computerPokemonSelection.name;

    document.getElementById("computer-image").src =
        battle.computerPokemonSelection.image_url;

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

    document.getElementById("battle-status").textContent =
        battle.winner
            ? battle.winner + " wins!"
            : "Choose an attack to fight!";

    document.getElementById("battle-log").replaceChildren();

    battle.battleLog.forEach(function (entry) {
        const paragraph = document.createElement("p");
        paragraph.textContent = entry;
        document.getElementById("battle-log").appendChild(paragraph);
    });

    attacksContainer.replaceChildren();

    battle.userPokemonSelection.attacks.forEach(function (attack) {
        const button = document.createElement("button");
        button.textContent = attack.name + " (" + attack.damage + " damage)";
        button.disabled = Boolean(battle.winner);

        button.addEventListener("click", function () {
            userAttack(attack);
        });

        attacksContainer.appendChild(button);
    });
}

function userAttack(attack) {
    const battle = loadBattle();

    if (!battle || battle.winner) {
        return;
    }

    battle.computerCurrentHealth = Math.max(
        0,
        battle.computerCurrentHealth - attack.damage
    );

    battle.battleLog.push(
        battle.userPokemonSelection.name + " used " + attack.name +
        " for " + attack.damage + " damage!"
    );

    if (battle.computerCurrentHealth <= 0) {
        battle.winner = battle.userPokemonSelection.name;
        battle.battleLog.push(
            battle.computerPokemonSelection.name + " fainted! You win!"
        );
        saveBattle(battle);
        renderBattle();
        return;
    }

    const enemyAttacks = battle.computerPokemonSelection.attacks;
    const enemyAttack = enemyAttacks[
        Math.floor(Math.random() * enemyAttacks.length)
    ];

    battle.userCurrentHealth = Math.max(
        0,
        battle.userCurrentHealth - enemyAttack.damage
    );

    battle.battleLog.push(
        battle.computerPokemonSelection.name + " used " + enemyAttack.name +
        " for " + enemyAttack.damage + " damage!"
    );

    if (battle.userCurrentHealth <= 0) {
        battle.winner = battle.computerPokemonSelection.name;
        battle.battleLog.push(
            battle.userPokemonSelection.name + " fainted! You lose!"
        );
    }

    saveBattle(battle);
    renderBattle();
}

function startNewBattle() {
    deleteCookie("battleState");
    window.location.href = "index.html";
}

renderPokemonSelection();
renderBattle();

const newBattleButton = document.getElementById("new-battle");

if (newBattleButton) {
    newBattleButton.addEventListener("click", startNewBattle);
}
