let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button function": [goStore, goCave, fightDragon],
    text: 'You are in the town square. You see a sign that says "store".\n'
  },

  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button function": [buyHealth, buyWeapon, goTown],
    text: "You entered the store.\n"
  },

  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button function": [fightSlime, fightBeast, goTown],
    text: "You entered the cave. You see monsters.\n"
  },

  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button function": [attack, dodge, goTown],
    text: "You are fighting a monster.\n"
  },

  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button function": [goTown, easterEgg, goTown],
    text: "The monster screams \"Arg!\" as it dies.\n"
  },

  {
    name: "loose",
    "button text": ["Replay?", "Replay?", "Replay?"],
    "button function": [restart, restart, restart],
    text: "YOU DIE!"
  },

  {
    name: "win",
    "button text": ["Replay?", "Replay?", "Replay?"],
    "button function": [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN THE GAME!"
  },
  
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square"],
    "button function": [pickTwo, pickEight, goTown],
    text: "You find a secrett game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"

  },
  
];

// weapons available
const weapons = [
    {
        name: "stick",
        power: 5 ,

    },

    {
        name: "dagger",
        power: 30 ,

    },

    {
        name: "claw hammer",
        power: 50 ,

    },

    {
        name: "sword",
        power: 100 ,

    },
]

// monsters define
const monsters = [
    {
        name : "slime",
        level : 2,
        health : 15,
    },

    {
        name : "fanged beast",
        level : 8,
        health : 60,
    },

    {
        name : "dragon",
        level : 20,
        health : 300,
    },
]

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// shortcut function
function update(location) {
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    text.innerText = location.text;
    button1.onclick = location["button function"][0];
    button2.onclick = location["button function"][1];
    button3.onclick = location["button function"][2];
}



function goTown() {
  update(locations[0]);
}

function goCave() {
    update(locations[2]);
}

// store part
function goStore() {
  update(locations[1]);
}

function buyHealth() {
    if (gold>=10) {
        gold -= 10 ;
        health += 10 ;
        goldText.innerText = gold ;
        healthText.innerText = health;
        flashStatChange(healthText, true);
        flashStatChange(goldText, false);
    }
    else {
        text.innerText = "You don't have enough gold to buy health.\n"
    }
}

function buyWeapon() {
    if (currentWeapon< weapons.length-1) {
        if (gold>=30) {
            gold -=30;
            currentWeapon++;
            goldText.innerText = gold;
            flashStatChange(goldText, false);
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "Now you have a " + newWeapon +".\n" ;
            inventory.push(newWeapon) ;
            text.innerText += "You have in your inventory : " +inventory +"\n" ;
        }
        else {
            text.innerText = "You don't have enough gold to buy weapon.\n" ;
        }
    }
    else {
        text.innerText = "You already have the most powerful weapon.\n";
        button2.innerText = "Sell weapon for 15 gold" ;
        button2.onclick = sellWeapon ;
    }
}

function sellWeapon() {
    if (inventory.length>1) {
        gold += 15;
        goldText.innerText = gold;
        flashStatChange(goldText, true);
        let currentWeapon = inventory.shift();
        text.innerText = "You sold a " + currentWeapon +" .\n"
        text.innerText += "In your inventory you have " + inventory +"\n" ;
    }
    else {
        text.innerText ="You can't sell your only weapon.\n" ;
    }

}




function fightSlime() {
    fighting = 0 ;
    goFight();
}

function fightBeast() {
    fighting = 1 ;
    goFight();
}

function fightDragon() {
    fighting = 2 ;
    goFight();
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block" ;
    monsterNameText.innerText = monsters[fighting].name ;
    monsterHealthText.innerText = monsterHealth ;

}





function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks.\n";
    text.innerText += "You atatck it with your " + weapons[currentWeapon].name + ".\n";
    if (isMonsterHit()) {
        monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) +1 ;
        flashStatChange(monsterHealthText, false);
    }
    else {
        text.innerText += "You miss.\n"
    }
    health -= getMonsterAttackValue(monsters[fighting].level);
    flashStatChange(healthText, false);
    
    function isMonsterHit() {
        return Math.random() > .2 || health < 20 ;
    }

    
    healthText.innerText = health ;
    monsterHealthText.innerText = monsterHealth ;
    if (health<= 0) {
        loose()
    }
    else if (monsterHealth<=0 ) {
        fighting === 2 ? winGame() : defeatMonster() ;
    }

    if (Math.random()<= .1 && (inventory.length !== 1)) {
        text.innerText += "Your " + inventory.pop() + " breaks.\n";
        currentWeapon--;
    }
}

function getMonsterAttackValue(level) {
     let hit = (level * 5) - (Math.floor(Math.random() * xp)) ;
     return hit;
}

function dodge() {
    text.innerText = "You dodge the attack from the "+ monsters[fighting].name +".\n"

}

function defeatMonster() {
    const goldEarned = Math.floor(monsters[fighting].level * 6.7);
    const xpEarned = monsters[fighting].level;

    gold += Math.floor(monsters[fighting].level * 6.7);
    xp+= monsters[fighting].level;
    flashStatChange(goldText, true);
    flashStatChange(xpText, true);
    goldText.innerText = gold ;
    xpText.innerText = xp ;
    update(locations[4]);
    text.innerText += "You gained "+ xpEarned+ " XP and "+ goldEarned +" gold.\n";
}

function loose() {
    update(locations[5]);
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.inventory = xp;
    goTown();

}

function winGame() {
    update(locations[6]);
}

// easter egg
function easterEgg() {
    update(locations[7]);
}

function pickTwo() {
    pick(2)
}

function pickEight() {
    pick(8)
}
 
function pick(guess) {
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }
    text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
    for (let i=0 ; i<10 ; i++ ) {
        if (i!==9) {
        text.innerText += numbers[i] + ", ";
        }
        else {
            text.innerText += numbers[i] + ".\n"
        }
    }
    if (numbers.indexOf(guess)!==-1) {
        text.innerText += "Right! You win 20 gold\n";
        gold += 20;
        goldText.innerText = gold;
        flashStatChange(goldText, true); 
    }
    else {
        text.innerText += "Wrong! You lost 10 health.\n"
        flashStatChange(healthText, false);
        if (health<= 0) {
            loose();
        } 
    }
}

// add

function flashStatChange(element, isIncrease) {
  const className = isIncrease ? "flash-green" : "flash-red";
  element.classList.add(className);
  setTimeout(() => {
    element.classList.remove(className);
  }, 500);
}