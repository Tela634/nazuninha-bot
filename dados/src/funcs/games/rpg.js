// Sistema de Rpg
// Sistema unico, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar deixe o caralho dos créditos 
// <3

const players = {};

const classes = {
    guerreiro: {
        name: 'Guerreiro',
        baseHp: 120,
        baseAttack: 15,
        baseDefense: 10,
        skills: {
            'Golpe Forte': {
                damage: 20,
                cost: 10,
                description: 'Um golpe poderoso que causa dano extra'
            },
            'Defesa Total': {
                effect: 'defense_up',
                value: 15,
                cost: 15,
                description: 'Aumenta sua defesa temporariamente'
            }
        }
    },
    mago: {
        name: 'Mago',
        baseHp: 80,
        baseAttack: 20,
        baseDefense: 5,
        skills: {
            'Bola de Fogo': {
                damage: 30,
                cost: 15,
                description: 'Uma poderosa bola de fogo'
            },
            'Escudo Mágico': {
                effect: 'defense_up',
                value: 20,
                cost: 20,
                description: 'Cria um escudo mágico protetor'
            }
        }
    },
    arqueiro: {
        name: 'Arqueiro',
        baseHp: 90,
        baseAttack: 18,
        baseDefense: 7,
        skills: {
            'Flecha Precisa': {
                damage: 25,
                cost: 12,
                description: 'Uma flecha com precisão mortal'
            },
            'Chuva de Flechas': {
                damage: 35,
                cost: 25,
                description: 'Dispara múltiplas flechas'
            }
        }
    }
};

const dungeons = {
    floresta: {
        name: 'Floresta Sombria',
        minLevel: 1,
        maxLevel: 5,
        monsters: [
            { name: '🐺 Lobo Selvagem', hp: 50, attack: 8, defense: 3, xp: 20, gold: 15 },
            { name: '🕷️ Aranha Gigante', hp: 40, attack: 12, defense: 2, xp: 25, gold: 20 },
            { name: '🌳 Ent Furioso', hp: 80, attack: 10, defense: 8, xp: 35, gold: 30 }
        ],
        boss: { name: '🐗 Javali Ancestral', hp: 150, attack: 20, defense: 12, xp: 100, gold: 100 }
    },
    caverna: {
        name: 'Caverna das Sombras',
        minLevel: 5,
        maxLevel: 10,
        monsters: [
            { name: '💀 Esqueleto', hp: 70, attack: 15, defense: 5, xp: 40, gold: 35 },
            { name: '🧟 Zumbi', hp: 100, attack: 12, defense: 8, xp: 45, gold: 40 },
            { name: '🦇 Morcego Vampiro', hp: 60, attack: 18, defense: 4, xp: 50, gold: 45 }
        ],
        boss: { name: '🧛‍♂️ Vampiro Ancião', hp: 200, attack: 25, defense: 15, xp: 150, gold: 150 }
    },
    vulcao: {
        name: 'Vulcão Ardente',
        minLevel: 10,
        maxLevel: 15,
        monsters: [
            { name: '🔥 Elemental de Fogo', hp: 120, attack: 22, defense: 10, xp: 70, gold: 60 },
            { name: '🦎 Lagarto de Lava', hp: 100, attack: 25, defense: 12, xp: 75, gold: 65 },
            { name: '🌋 Golem de Magma', hp: 150, attack: 20, defense: 18, xp: 80, gold: 70 }
        ],
        boss: { name: '🐲 Dragão de Fogo', hp: 300, attack: 35, defense: 25, xp: 200, gold: 200 }
    }
};

const shopItems = {
    'Poção de Cura Pequena': {
        type: 'potion',
        effect: 'heal',
        value: 30,
        price: 50,
        description: 'Recupera 30 HP'
    },
    'Poção de Cura Média': {
        type: 'potion',
        effect: 'heal',
        value: 70,
        price: 100,
        description: 'Recupera 70 HP'
    },
    'Poção de Cura Grande': {
        type: 'potion',
        effect: 'heal',
        value: 150,
        price: 200,
        description: 'Recupera 150 HP'
    },
    'Poção de Força': {
        type: 'potion',
        effect: 'attack_up',
        value: 10,
        duration: 3,
        price: 150,
        description: 'Aumenta o ataque em 10 por 3 turnos'
    },
    'Poção de Defesa': {
        type: 'potion',
        effect: 'defense_up',
        value: 8,
        duration: 3,
        price: 150,
        description: 'Aumenta a defesa em 8 por 3 turnos'
    },
    'Espada de Ferro': {
        type: 'weapon',
        attack: 15,
        price: 300,
        class: 'guerreiro',
        description: 'Uma espada básica mas confiável'
    },
    'Cajado Místico': {
        type: 'weapon',
        attack: 20,
        price: 300,
        class: 'mago',
        description: 'Um cajado que amplifica magias'
    },
    'Arco Longo': {
        type: 'weapon',
        attack: 18,
        price: 300,
        class: 'arqueiro',
        description: 'Um arco com excelente alcance'
    },
    'Armadura de Ferro': {
        type: 'armor',
        defense: 12,
        price: 300,
        class: 'guerreiro',
        description: 'Uma armadura resistente'
    },
    'Vestes Místicas': {
        type: 'armor',
        defense: 8,
        price: 300,
        class: 'mago',
        description: 'Vestes que aumentam o poder mágico'
    },
    'Armadura de Couro': {
        type: 'armor',
        defense: 10,
        price: 300,
        class: 'arqueiro',
        description: 'Armadura leve e flexível'
    }
};

class RPGPlayer {
    constructor(id, className) {
        this.id = id;
        this.className = className;
        this.level = 1;
        this.xp = 0;
        this.gold = 100;

        const classData = classes[className];
        this.hp = classData.baseHp;
        this.maxHp = classData.baseHp;
        this.attack = classData.baseAttack;
        this.defense = classData.baseDefense;
        this.skills = {...classData.skills};

        this.inventory = [];
        this.equipment = {
            weapon: null,
            armor: null
        };

        this.inBattle = false;
        this.currentDungeon = null;
        this.buffs = [];
    };

    gainXP(amount) {
        this.xp += amount;
        if (this.xp >= this.level * 100) {
            this.levelUp();
            return true;
        }
        return false;
    }

    levelUp() {
        this.level++;
        this.xp = 0;

        const classData = classes[this.className];
        this.maxHp += Math.floor(classData.baseHp * 0.1);
        this.hp = this.maxHp;
        this.attack += Math.floor(classData.baseAttack * 0.1);
        this.defense += Math.floor(classData.baseDefense * 0.1);
    }

    heal(amount) {
        this.hp = Math.min(this.hp + amount, this.maxHp);
    }

    takeDamage(amount) {
        const totalDefense = this.defense + (this.equipment.armor ? this.equipment.armor.defense : 0);
        const damage = Math.max(1, amount - totalDefense);
        this.hp = Math.max(0, this.hp - damage);
        return damage;
    }

    getTotalAttack() {
        return this.attack + (this.equipment.weapon ? this.equipment.weapon.attack : 0);
    }

    getTotalDefense() {
        return this.defense + (this.equipment.armor ? this.equipment.armor.defense : 0);
    }

    addItem(item) {
        this.inventory.push(item);
    }

    useItem(itemName) {
        const itemIndex = this.inventory.findIndex(i => i === itemName);
        if (itemIndex === -1) return null;
        
        const item = shopItems[itemName];
        if (!item) return null;

        this.inventory.splice(itemIndex, 1);

        if (item.type === 'potion') {
            if (item.effect === 'heal') {
                this.heal(item.value);
                return `❤️ Você recuperou ${item.value} HP!`;
            } else {
                this.buffs.push({
                    effect: item.effect,
                    value: item.value,
                    duration: item.duration
                });
                return `⚡ ${item.description}`;
            }
        }
        return null;
    }

    equipItem(itemName) {
        const item = shopItems[itemName];
        if (!item) return { success: false, message: '❌ Item não encontrado!' };
        if (item.class && item.class !== this.className) {
            return { success: false, message: '❌ Sua classe não pode equipar este item!' };
        }

        const itemIndex = this.inventory.findIndex(i => i === itemName);
        if (itemIndex === -1) {
            return { success: false, message: '❌ Você não possui este item!' };
        }

        this.inventory.splice(itemIndex, 1);

        if (item.type === 'weapon' || item.type === 'armor') {
            const currentItem = this.equipment[item.type];
            if (currentItem) {
                this.inventory.push(currentItem.name);
            }
            this.equipment[item.type] = {
                name: itemName,
                ...item
            };
        }

        return { 
            success: true, 
            message: `✅ ${itemName} equipado com sucesso!` 
        };
    };

    getStatus() {
        return `🎮 *Status do Jogador*\n\n` +
               `📊 Level: ${this.level}\n` +
               `⭐ XP: ${this.xp}/${this.level * 100}\n` +
               `❤️ HP: ${this.hp}/${this.maxHp}\n` +
               `⚔️ Ataque: ${this.getTotalAttack()} (${this.attack} + ${this.getTotalAttack() - this.attack})\n` +
               `🛡️ Defesa: ${this.getTotalDefense()} (${this.defense} + ${this.getTotalDefense() - this.defense})\n` +
               `💰 Ouro: ${this.gold}\n\n` +
               `🎒 Inventário:\n${this.inventory.length ? this.inventory.join('\n') : 'Vazio'}\n\n` +
               `⚔️ Arma: ${this.equipment.weapon ? this.equipment.weapon.name : 'Nenhuma'}\n` +
               `🛡️ Armadura: ${this.equipment.armor ? this.equipment.armor.name : 'Nenhuma'}`;
    };
};

module.exports = {
    createPlayer: (userId, className) => {
        if (!classes[className]) {
            return { 
                success: false, 
                message: '❌ Classe inválida! Escolha entre: ' + Object.keys(classes).join(', ')
            };
        };
        
        if (players[userId]) {
            return { 
                success: false, 
                message: '❌ Você já tem um personagem! Use /rpgstatus para ver seus status.'
            };
        }

        players[userId] = new RPGPlayer(userId, className);
        return {
            success: true,
            message: `✅ Personagem criado com sucesso!\n\nClasse: ${classes[className].name}\n\n${players[userId].getStatus()}`
        };
    },

    getPlayer: (userId) => players[userId],

    getClasses: () => {
        let text = '🎮 *Classes Disponíveis*\n\n';
        Object.entries(classes).forEach(([id, data]) => {
            text += `*${data.name}*\n`;
            text += `❤️ HP: ${data.baseHp}\n`;
            text += `⚔️ Ataque: ${data.baseAttack}\n`;
            text += `🛡️ Defesa: ${data.baseDefense}\n`;
            text += `\n*Habilidades:*\n`;
            Object.entries(data.skills).forEach(([name, skill]) => {
                text += `➤ ${name}: ${skill.description}\n`;
            });
            text += '\n';
        });
        return text;
    },

    enterDungeon: (player, dungeonName) => {
        const dungeon = dungeons[dungeonName];
        if (!dungeon) {
            return { 
                success: false, 
                message: '❌ Dungeon não encontrada! Disponíveis: ' + Object.keys(dungeons).join(', ')
            };
        };

        if (player.level < dungeon.minLevel) {
            return {
                success: false,
                message: `❌ Você precisa ser nível ${dungeon.minLevel} para entrar em ${dungeon.name}!`
            };
        };

        const isBoss = Math.random() < 0.1;
        const monster = isBoss ? {...dungeon.boss} : {...dungeon.monsters[Math.floor(Math.random() * dungeon.monsters.length)]};

        player.inBattle = true;
        player.currentDungeon = {
            name: dungeonName,
            monster: monster,
            turns: 0
        };

        return {
            success: true,
            message: `⚔️ *BATALHA INICIADA!*\n\n` +
                    `Você encontrou ${monster.name} em ${dungeon.name}!\n\n` +
                    `👾 *Monstro:*\n` +
                    `❤️ HP: ${monster.hp}\n` +
                    `⚔️ Ataque: ${monster.attack}\n` +
                    `🛡️ Defesa: ${monster.defense}\n\n` +
                    `Comandos disponíveis:\n` +
                    `➤ /rpgattack - Ataque básico\n` +
                    `➤ /rpgskill <nome> - Usa uma habilidade\n` +
                    `➤ /rpgitem <nome> - Usa um item\n` +
                    `➤ /rpgflee - Tenta fugir`
        };
    },

    processAttack: (player, isSkill = false, skillName = null) => {
        if (!player.inBattle || !player.currentDungeon) {
            return { success: false, message: '❌ Você não está em batalha!' };
        };
        const monster = player.currentDungeon.monster;
        let damage = player.getTotalAttack();
        let log = '';
        if (isSkill && skillName) {
            const skill = player.skills[skillName];
            if (!skill) {
                return { success: false, message: '❌ Habilidade não encontrada!' };
            }
            damage = skill.damage || damage;
            log += `🎯 Você usou ${skillName}!\n`;
        };
        const monsterDamage = Math.max(1, damage - monster.defense);
        monster.hp -= monsterDamage;
        log += `👊 Você causou ${monsterDamage} de dano!\n`;
        if (monster.hp <= 0) {
            player.inBattle = false;
            player.gold += monster.gold;
            const leveledUp = player.gainXP(monster.xp);
            log += `\n🎉 *Vitória!*\n`;
            log += `💰 +${monster.gold} ouro\n`;
            log += `⭐ +${monster.xp} XP\n`;
            if (leveledUp) {
                log += `\n🆙 *Level Up!* Você alcançou o nível ${player.level}!\n`;
            };
            player.currentDungeon = null;
            return { success: true, log, battle: false };
        };
        const playerDamage = player.takeDamage(monster.attack);
        log += `😈 ${monster.name} causou ${playerDamage} de dano!\n\n`;
        log += `Status:\n`;
        log += `❤️ Seu HP: ${player.hp}/${player.maxHp}\n`;
        log += `❤️ HP do ${monster.name}: ${monster.hp}\n`;
        if (player.hp <= 0) {
            player.inBattle = false;
            player.hp = Math.max(1, player.maxHp / 2);
            player.gold = Math.max(0, player.gold - Math.floor(player.gold * 0.1));
            
            log += `\n💀 *Derrota!*\n`;
            log += `Você perdeu 10% do seu ouro!\n`;
            player.currentDungeon = null;
            return { success: true, log, battle: false };
        };
        return { success: true, log, battle: true };
    },

    flee: (player) => {
        if (!player.inBattle || !player.currentDungeon) {
            return { success: false, message: '❌ Você não está em batalha!' };
        };
        const escapeChance = 0.5;
        if (Math.random() < escapeChance) {
            player.inBattle = false;
            player.currentDungeon = null;
            return { 
                success: true, 
                message: '🏃‍♂️ Você conseguiu fugir com sucesso!' 
            };
        };
        const monster = player.currentDungeon.monster;
        const damage = player.takeDamage(monster.attack);
        return {
            success: false,
            message: `❌ Você falhou em fugir!\n😈 ${monster.name} causou ${damage} de dano!\n\n❤️ Seu HP: ${player.hp}/${player.maxHp}`
        };
    },

    shop: {
        items: shopItems,
        buyItem: (player, itemName) => {
            const item = shopItems[itemName];
            if (!item) {
                return { success: false, message: '❌ Item não encontrado!' };
            };
            if (player.gold < item.price) {
                return { success: false, message: '❌ Ouro insuficiente!' };
            };
            player.gold -= item.price;
            player.addItem(itemName);
            return { 
                success: true, 
                message: `✅ Item comprado com sucesso!\n💰 Ouro restante: ${player.gold}`
            };
        },
        
        listItems: () => {
            let text = '🏪 *LOJA DO RPG*\n\n';
            text += '🧪 *Poções:*\n';
            Object.entries(shopItems)
                .filter(([,item]) => item.type === 'potion')
                .forEach(([name, item]) => {
                    text += `➤ ${name} - 💰 ${item.price}\n   ${item.description}\n`;
                });
            text += '\n⚔️ *Armas:*\n';
            Object.entries(shopItems)
                .filter(([,item]) => item.type === 'weapon')
                .forEach(([name, item]) => {
                    text += `➤ ${name} - 💰 ${item.price}\n   ATK: +${item.attack} | Classe: ${item.class}\n`;
                });
            text += '\n🛡️ *Armaduras:*\n';
            Object.entries(shopItems)
                .filter(([,item]) => item.type === 'armor')
                .forEach(([name, item]) => {
                    text += `➤ ${name} - 💰 ${item.price}\n   DEF: +${item.defense} | Classe: ${item.class}\n`;
                });
            
            return text;
        }
    },

    listDungeons: () => {
        let text = '🗺️ *DUNGEONS DISPONÍVEIS*\n\n';
        Object.entries(dungeons).forEach(([id, dungeon]) => {
            text += `*${dungeon.name}*\n`;
            text += `📊 Nível: ${dungeon.minLevel}-${dungeon.maxLevel}\n\n`;
            text += `👾 *Monstros:*\n`;
            dungeon.monsters.forEach(monster => {
                text += `➤ ${monster.name}\n`;
            });
            text += `\n🔥 *Boss:* ${dungeon.boss.name}\n\n`;
        });
        return text;
    },

    getTopPlayers: () => {
        return Object.values(players)
            .sort((a, b) => b.level - a.level)
            .slice(0, 10)
            .map((p, i) => `${i + 1}. @${p.id.split('@')[0]} - ${classes[p.className].name} Nível ${p.level}`);
    }
};
