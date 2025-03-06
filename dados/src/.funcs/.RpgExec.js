// Core Systems
const miningSystem = require('./.rpg/miningSystem.js');
const farmingSystem = require('./.rpg/farmingSystem.js');
const fishingSystem = require('./.rpg/fishingSystem.js');
const cookingSystem = require('./.rpg/cookingSystem.js');
const craftSystem = require('./.rpg/craftSystem.js');

// Quest & Achievement Systems
const questSystem = require('./.rpg/questSystem.js');
const achievementSystem = require('./.rpg/achievementSystem.js');

// Combat Systems
const dungeonSystem = require('./.rpg/dungeonSystem.js');
const raidSystem = require('./.rpg/raidSystem.js');
const bossSystem = require('./.rpg/bossSystem.js');
const battleSystem = require('./.rpg/battleSystem.js');

// Organization Systems
const factionSystem = require('./.rpg/factionSystem.js');
const territorySystem = require('./.rpg/territorySystem.js');
const gangSystem = require('./.rpg/gangSystem.js');
const clanSystem = require('./.rpg/clanSystem.js');
const petSystem = require('./.rpg/petSystem.js');

// Economy Systems
const investmentSystem = require('./.rpg/investmentSystem.js');
const casinoSystem = require('./.rpg/casinoSystem.js');
const shopSystem = require('./.rpg/shopSystem.js');
const economySystem = require('./.rpg/economySystem.js');

// Character Systems
const classSystem = require('./.rpg/classSystem.js');
const careerSystem = require('./.rpg/careerSystem.js');
const professionSystem = require('./.rpg/professionSystem.js');

// Event System
const eventSystem = require('./.rpg/eventSystem.js');

// Helper Functions
const { playerExists, getPlayer, savePlayer, formatProfile, createPlayer } = require('./.rpg/rpgFunctions.js');

// Lista de comandos RPG válidos
const rpgCommandsList = [
    // Comandos Básicos
    'registrar', 'perfil', 'inventario',
    
    // Sistemas Core
    'minerar', 'picareta', 'mochila', 'minerios', 'upminerador', 'skillminerador', 'minas',
    'plantar', 'fazenda', 'colher', 'clima', 'plantacoes', 'upfazendeiro', 'skillfazendeiro', 'tratamentos', 'ferramentas',
    'pescar', 'vara', 'iscas', 'peixes', 'uppescador', 'skillpescador', 'locais', 'equipamentos',
    'cozinhar', 'receitas', 'ingredientes', 'upcozinheiro', 'skillcozinheiro', 'cozinha',
    'craft', 'craftlist', 'estacoes', 'comprarestacao', 'melhorarestacao', 'craftinfo',
    
    // Sistemas de Combate
    'batalhar', 'skills', 'usarskill', 'usaritem', 'status', 'classe',
    'dungeon', 'dungeonlist', 'explorar', 'salaatual',
    'raid', 'raidinfo', 'entrarraid',
    'boss', 'bosslist', 'desafiarboss',
    
    // Sistemas de Organização
    'clan', 'claninfo', 'criarclan', 'convidar', 'expulsar', 'promover', 'rebaixar',
    'banco', 'depositar', 'sacar', 'construcao', 'melhorar',
    'faccao', 'faccaoinfo', 'guerra', 'territorio',
    'pet', 'petinfo', 'treinar', 'habilidade',
    'gang', 'ganginfo', 'criargang', 'territorio',
    
    // Sistemas de Economia
    'loja', 'comprar', 'vender', 'mercado',
    'investir', 'portfolio', 'acoes', 'dividendos',
    'cassino', 'roleta', 'blackjack', 'slots',
    'transferir', 'carteira', 'extrato',
    
    // Sistemas de Personagem
    'classe', 'subclasse', 'talentos', 'atributos',
    'carreira', 'trabalhar', 'promover', 'especializar',
    'profissao', 'profissaoinfo', 'aprenderprof', 'melhorarprof', 'abandonarprof',
    
    // Sistemas de Conquistas e Missões
    'conquistas', 'titulos', 'colecao',
    'missoes', 'historia', 'diarias', 'semanais',
    
    // Sistema de Eventos
    'eventos', 'eventoinfo', 'participar'
];

// Main RPG command handler
const rpgCommands = async (type, nazu, from, sender, info, reply, command, q, prefix, isModoRpg) => {
    // Verifica se é um comando RPG válido
    if (!rpgCommandsList.includes(command)) return;
    
    // Verifica se RPG está ativo apenas para comandos RPG válidos
    if (!isModoRpg) return reply('❌ O modo RPG está desativado!');

    switch(command) {
        // Comandos de Mineração
        case 'minerar': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) return reply(`❌ Especifique uma mina! Use ${prefix}minas para ver as minas disponíveis.`);
                const result = miningSystem.mine(player, q);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'picareta': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.mining?.pickaxe) return reply('❌ Você não tem uma picareta! Use /loja para comprar.');
                const durability = player.mining.durability;
                reply(`⛏️ *Sua Picareta*\n\nTipo: ${player.mining.pickaxe}\nDurabilidade: ${durability}`);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'mochila': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.mining?.minerals) return reply('❌ Você não tem minérios na mochila!');
                let text = '🎒 *Sua Mochila de Minérios*\n\n';
                for (const [mineral, amount] of Object.entries(player.mining.minerals)) {
                    text += `${miningSystem.minerals[mineral].emoji} ${miningSystem.minerals[mineral].name}: ${amount}\n`;
                }
                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'minerios': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            let text = '💎 *Lista de Minérios*\n\n';
            for (const [id, mineral] of Object.entries(miningSystem.minerals)) {
                text += `${mineral.emoji} ${mineral.name}\n`;
            }
            reply(text);
        }
        break;

        case 'upminerador': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    let text = '🛠️ *Upgrades de Minerador*\n\n';
                    for (const [id, upgrade] of Object.entries(miningSystem.upgrades)) {
                        text += `${upgrade.name}\n💰 Preço: ${upgrade.price}\n📝 ${upgrade.description}\n\n`;
                    }
                    return reply(text + `\nPara comprar use: ${prefix}upminerador nome_do_upgrade`);
                }
                // Implementar lógica de compra do upgrade
                const upgrade = miningSystem.upgrades[q];
                if (!upgrade) return reply('❌ Upgrade não encontrado!');
                if (player.money < upgrade.price) return reply(`❌ Você precisa de ${upgrade.price} moedas para comprar este upgrade!`);
                
                if (!player.mining) player.mining = {};
                if (!player.mining.upgrades) player.mining.upgrades = [];
                
                if (player.mining.upgrades.includes(q)) return reply('❌ Você já possui este upgrade!');
                
                player.money -= upgrade.price;
                player.mining.upgrades.push(q);
                await savePlayer(sender, player);
                reply(`✅ Você comprou ${upgrade.name} por ${upgrade.price} moedas!`);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'skillminerador': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    let text = '📚 *Habilidades de Minerador*\n\n';
                    for (const [id, skill] of Object.entries(miningSystem.skills)) {
                        const level = player.mining?.skills?.[id] || 0;
                        text += `${skill.name} (Nível ${level}/${skill.maxLevel})\n💰 Custo: ${skill.costPerLevel}\n📝 ${skill.description}\n\n`;
                    }
                    return reply(text + `\nPara evoluir use: ${prefix}skillminerador nome_da_skill`);
                }
                // Implementar lógica de upgrade da skill
                const skill = miningSystem.skills[q];
                if (!skill) return reply('❌ Habilidade não encontrada!');
                
                if (!player.mining) player.mining = {};
                if (!player.mining.skills) player.mining.skills = {};
                
                const currentLevel = player.mining.skills[q] || 0;
                if (currentLevel >= skill.maxLevel) return reply('❌ Esta habilidade já está no nível máximo!');
                
                const cost = skill.costPerLevel * (currentLevel + 1);
                if (player.money < cost) return reply(`❌ Você precisa de ${cost} moedas para evoluir esta habilidade!`);
                
                player.money -= cost;
                player.mining.skills[q] = currentLevel + 1;
                await savePlayer(sender, player);
                reply(`✅ Você evoluiu ${skill.name} para o nível ${currentLevel + 1}!`);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'minas': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            let text = '⛰️ *Locais de Mineração*\n\n';
            for (const [id, location] of Object.entries(miningSystem.locations)) {
                text += `${location.name}\n📊 Nível necessário: ${location.level}\n⚡ Energia necessária: ${miningSystem.energyCost[id]}\n\n`;
            }
            reply(text);
        }
        break;

        // Comandos de Farming
        case 'plantar': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const [cropId, quantity] = q.split(' ');
                if (!cropId) return reply(`❌ Especifique o que quer plantar! Use ${prefix}plantacoes para ver as opções.`);
                const player = await getPlayer(sender);
                const result = farmingSystem.plant(player, cropId, parseInt(quantity) || 1);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'fazenda': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.farm) return reply('❌ Você não tem uma fazenda! Plante algo primeiro.');
                
                let text = '🌾 *SUA FAZENDA*\n\n';
                text += `🌤️ Clima: ${player.farm.weather.name}\n`;
                text += `📊 Nível: ${player.farm.level}\n`;
                text += `🌱 Plantações: ${player.farm.plots.length}/${player.farm.level * 5}\n\n`;
                
                if (player.farm.plots.length > 0) {
                    text += '*Plantações Ativas:*\n';
                    player.farm.plots.forEach((plot, index) => {
                        const timeLeft = plot.readyAt - Date.now();
                        text += `${index + 1}. ${farmingSystem.crops[plot.crop].emoji} ${farmingSystem.crops[plot.crop].name}\n`;
                        text += `⏰ ${timeLeft > 0 ? `Pronto em: ${Math.ceil(timeLeft / (60 * 1000))}min` : '✅ Pronto para colher!'}\n`;
                        text += `📊 Qualidade: ${plot.quality.name}\n`;
                        if (plot.disease) text += `⚠️ Doença: ${plot.disease.name}\n`;
                        text += '\n';
                    });
                }
                
                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'colher': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.farm?.plots.length) return reply('❌ Você não tem nada para colher!');
                
                let harvested = 0;
                let rewards = {};
                
                player.farm.plots = player.farm.plots.filter(plot => {
                    if (plot.readyAt > Date.now()) return true;
                    
                    harvested++;
                    const crop = farmingSystem.crops[plot.crop];
                    const amount = Math.floor(crop.yield * plot.quality.multiplier);
                    
                    if (player.farming?.skills?.colheita) {
                        const level = player.farming.skills.colheita;
                        const chance = farmingSystem.skills.colheita.effect.valuePerLevel * level;
                        if (Math.random() < chance) {
                            rewards[plot.crop] = (rewards[plot.crop] || 0) + amount * 2;
                            return false;
                        }
                    }
                    
                    rewards[plot.crop] = (rewards[plot.crop] || 0) + amount;
                    return false;
                });
                
                if (harvested === 0) return reply('❌ Nenhuma plantação pronta para colher!');
                
                let text = '🌾 *COLHEITA*\n\n';
                for (const [cropId, amount] of Object.entries(rewards)) {
                    const crop = farmingSystem.crops[cropId];
                    text += `${crop.emoji} ${amount}x ${crop.name}\n`;
                    if (!player.inventory) player.inventory = {};
                    player.inventory[cropId] = (player.inventory[cropId] || 0) + amount;
                }
                
                await savePlayer(sender, player);
                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'clima': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.farm) return reply('❌ Você não tem uma fazenda!');
                
                const weather = player.farm.weather;
                let text = '🌤️ *CLIMA ATUAL*\n\n';
                text += `Condição: ${weather.name}\n`;
                
                switch (weather.effect.type) {
                    case 'growth_speed':
                        text += `📈 Crescimento ${Math.round((weather.effect.value - 1) * 100)}% mais rápido`;
                        break;
                    case 'water_save':
                        text += '💧 Não precisa regar as plantas';
                        break;
                    case 'water_need':
                        text += '⚠️ Plantas precisam de mais água';
                        break;
                    case 'damage':
                        text += '⚠️ Risco de perder plantações';
                        break;
                    case 'freeze':
                        text += '❄️ Crescimento mais lento';
                        break;
                }
                
                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'plantacoes': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            let text = '🌱 *PLANTAÇÕES DISPONÍVEIS*\n\n';
            for (const [id, crop] of Object.entries(farmingSystem.crops)) {
                text += `${crop.emoji} ${crop.name}\n`;
                text += `📊 Nível necessário: ${crop.level}\n`;
                text += `⏰ Tempo: ${crop.growthTime} minutos\n`;
                text += `💰 Preço: ${crop.price}\n\n`;
            }
            reply(text);
        }
        break;

        case 'upfazendeiro': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    let text = '🛠️ *Equipamentos de Fazendeiro*\n\n';
                    for (const [id, tool] of Object.entries(farmingSystem.tools)) {
                        text += `${tool.name}\n💰 Preço: ${tool.price}\n📝 ${tool.description}\n\n`;
                    }
                    return reply(text + `\nPara comprar use: ${prefix}upfazendeiro nome_do_item`);
                }

                const tool = farmingSystem.tools[q];
                if (!tool) return reply('❌ Item não encontrado!');
                if (player.money < tool.price) return reply(`❌ Você precisa de ${tool.price} moedas!`);
                
                if (!player.farming) player.farming = {};
                if (!player.farming.tools) player.farming.tools = [];
                if (!player.farming.durability) player.farming.durability = {};
                
                if (player.farming.tools.includes(q)) return reply('❌ Você já tem este item!');
                
                player.money -= tool.price;
                player.farming.tools.push(q);
                player.farming.durability[q] = tool.durability;
                
                await savePlayer(sender, player);
                reply(`✅ Você comprou ${tool.name} por ${tool.price} moedas!`);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'skillfazendeiro': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    let text = '📚 *Habilidades de Fazendeiro*\n\n';
                    for (const [id, skill] of Object.entries(farmingSystem.skills)) {
                        const level = player.farming?.skills?.[id] || 0;
                        text += `${skill.name} (Nível ${level}/${skill.maxLevel})\n💰 Custo: ${skill.costPerLevel}\n📝 ${skill.description}\n\n`;
                    }
                    return reply(text + `\nPara evoluir use: ${prefix}skillfazendeiro nome_da_skill`);
                }

                const skill = farmingSystem.skills[q];
                if (!skill) return reply('❌ Habilidade não encontrada!');
                
                if (!player.farming) player.farming = {};
                if (!player.farming.skills) player.farming.skills = {};
                
                const currentLevel = player.farming.skills[q] || 0;
                if (currentLevel >= skill.maxLevel) return reply('❌ Esta habilidade já está no nível máximo!');
                
                const cost = skill.costPerLevel * (currentLevel + 1);
                if (player.money < cost) return reply(`❌ Você precisa de ${cost} moedas!`);
                
                player.money -= cost;
                player.farming.skills[q] = currentLevel + 1;
                
                await savePlayer(sender, player);
                reply(`✅ Você evoluiu ${skill.name} para o nível ${currentLevel + 1}!`);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'tratamentos': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    let text = '💊 *Tratamentos Disponíveis*\n\n';
                    for (const [id, treatment] of Object.entries(farmingSystem.treatments)) {
                        text += `${treatment.name}\n💰 Preço: ${treatment.price}\n🔄 Usos: ${treatment.uses}\n\n`;
                    }
                    return reply(text + `\nPara comprar use: ${prefix}tratamentos nome_do_tratamento`);
                }

                const treatment = farmingSystem.treatments[q];
                if (!treatment) return reply('❌ Tratamento não encontrado!');
                if (player.money < treatment.price) return reply(`❌ Você precisa de ${treatment.price} moedas!`);
                
                if (!player.farming) player.farming = {};
                if (!player.farming.treatments) player.farming.treatments = {};
                
                player.money -= treatment.price;
                player.farming.treatments[q] = (player.farming.treatments[q] || 0) + treatment.uses;
                
                await savePlayer(sender, player);
                reply(`✅ Você comprou ${treatment.name} por ${treatment.price} moedas!`);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'ferramentas': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.farming?.tools?.length) return reply('❌ Você não tem ferramentas!');
                
                let text = '🛠️ *Suas Ferramentas*\n\n';
                for (const toolId of player.farming.tools) {
                    const tool = farmingSystem.tools[toolId];
                    text += `${tool.name}\n⚡ Durabilidade: ${player.farming.durability[toolId]}/${tool.durability}\n\n`;
                }
                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Comandos de Pesca
        case 'pescar': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) return reply(`❌ Especifique um local! Use ${prefix}locais para ver os locais disponíveis.`);
                const result = fishingSystem.fish(player, q);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'vara': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.fishing?.rod) return reply('❌ Você não tem uma vara de pesca! Use /loja para comprar.');
                const durability = player.fishing.durability;
                reply(`🎣 *Sua Vara de Pesca*\n\nTipo: ${player.fishing.rod}\nDurabilidade: ${durability}`);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'iscas': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    let text = '🪱 *Iscas Disponíveis*\n\n';
                    for (const [id, bait] of Object.entries(fishingSystem.baits)) {
                        text += `${bait.name}\n💰 Preço: ${bait.price}\n📝 ${bait.description}\n\n`;
                    }
                    return reply(text + `\nPara comprar use: ${prefix}iscas nome_da_isca`);
                }

                const bait = fishingSystem.baits[q];
                if (!bait) return reply('❌ Isca não encontrada!');
                if (player.money < bait.price) return reply(`❌ Você precisa de ${bait.price} moedas!`);
                
                if (!player.fishing) player.fishing = {};
                player.fishing.bait = q;
                player.money -= bait.price;
                
                await savePlayer(sender, player);
                reply(`✅ Você comprou ${bait.name} por ${bait.price} moedas!`);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'peixes': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            let text = '🐟 *Lista de Peixes*\n\n';
            for (const [id, fish] of Object.entries(fishingSystem.fishes)) {
                text += `${fish.emoji} ${fish.name}\n`;
                text += `💰 Valor base: ${fish.price}\n`;
                text += `📊 Raridade: ${fish.rarity}\n\n`;
            }
            reply(text);
        }
        break;

        case 'uppescador': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    let text = '🎣 *Equipamentos de Pesca*\n\n';
                    for (const [id, equipment] of Object.entries(fishingSystem.equipment)) {
                        text += `${equipment.name}\n💰 Preço: ${equipment.price}\n📝 ${equipment.description}\n\n`;
                    }
                    return reply(text + `\nPara comprar use: ${prefix}uppescador nome_do_item`);
                }

                const equipment = fishingSystem.equipment[q];
                if (!equipment) return reply('❌ Equipamento não encontrado!');
                if (player.money < equipment.price) return reply(`❌ Você precisa de ${equipment.price} moedas!`);
                
                if (!player.fishing) player.fishing = {};
                if (!player.fishing.equipment) player.fishing.equipment = {};
                
                player.money -= equipment.price;
                player.fishing.equipment[q] = equipment.durability;
                
                await savePlayer(sender, player);
                reply(`✅ Você comprou ${equipment.name} por ${equipment.price} moedas!`);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'skillpescador': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    let text = '📚 *Habilidades de Pescador*\n\n';
                    for (const [id, skill] of Object.entries(fishingSystem.skills)) {
                        const level = player.fishing?.skills?.[id] || 0;
                        text += `${skill.name} (Nível ${level}/${skill.maxLevel})\n💰 Custo: ${skill.costPerLevel}\n📝 ${skill.description}\n\n`;
                    }
                    return reply(text + `\nPara evoluir use: ${prefix}skillpescador nome_da_skill`);
                }

                const skill = fishingSystem.skills[q];
                if (!skill) return reply('❌ Habilidade não encontrada!');
                
                if (!player.fishing) player.fishing = {};
                if (!player.fishing.skills) player.fishing.skills = {};
                
                const currentLevel = player.fishing.skills[q] || 0;
                if (currentLevel >= skill.maxLevel) return reply('❌ Esta habilidade já está no nível máximo!');
                
                const cost = skill.costPerLevel * (currentLevel + 1);
                if (player.money < cost) return reply(`❌ Você precisa de ${cost} moedas!`);
                
                player.money -= cost;
                player.fishing.skills[q] = currentLevel + 1;
                
                await savePlayer(sender, player);
                reply(`✅ Você evoluiu ${skill.name} para o nível ${currentLevel + 1}!`);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'locais': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            let text = '🌊 *Locais de Pesca*\n\n';
            for (const [id, location] of Object.entries(fishingSystem.locations)) {
                text += `${location.name}\n`;
                text += `📊 Nível necessário: ${location.level}\n`;
                text += `🐟 Peixes: ${location.fishes.join(', ')}\n\n`;
            }
            reply(text);
        }
        break;

        case 'equipamentos': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.fishing?.equipment) return reply('❌ Você não tem equipamentos de pesca!');
                
                let text = '⚙️ *Seus Equipamentos*\n\n';
                for (const [id, durability] of Object.entries(player.fishing.equipment)) {
                    const equipment = fishingSystem.equipment[id];
                    text += `${equipment.name}\n⚡ Durabilidade: ${durability}/${equipment.durability}\n\n`;
                }
                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Comandos de Culinária
        case 'cozinhar': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) return reply(`❌ Especifique uma receita! Use ${prefix}receitas para ver as receitas disponíveis.`);
                const result = cookingSystem.cook(player, q);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'receitas': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            let text = '📖 *LIVRO DE RECEITAS*\n\n';
            for (const [id, recipe] of Object.entries(cookingSystem.recipes)) {
                text += `${recipe.emoji} ${recipe.name}\n`;
                text += `📊 Nível necessário: ${recipe.level}\n`;
                text += `📝 Ingredientes:\n`;
                for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
                    text += `├ ${amount}x ${ingredient}\n`;
                }
                text += `✨ XP: ${recipe.xp}\n\n`;
            }
            reply(text);
        }
        break;

        case 'ingredientes': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            let text = '🥘 *QUALIDADE DOS INGREDIENTES*\n\n';
            for (const [id, quality] of Object.entries(cookingSystem.ingredients)) {
                text += `${quality.name}\n`;
                text += `📊 Multiplicador: ${quality.multiplier}x\n`;
                text += `💰 Preço: ${quality.price_multiplier}x\n\n`;
            }
            reply(text);
        }
        break;

        case 'upcozinheiro': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    let text = '🔧 *EQUIPAMENTOS DE COZINHA*\n\n';
                    for (const [id, equipment] of Object.entries(cookingSystem.equipment)) {
                        text += `${equipment.name}\n💰 Preço: ${equipment.price}\n📝 ${equipment.description}\n\n`;
                    }
                    return reply(text + `\nPara comprar use: ${prefix}upcozinheiro nome_do_item`);
                }

                const equipment = cookingSystem.equipment[q];
                if (!equipment) return reply('❌ Equipamento não encontrado!');
                if (player.money < equipment.price) return reply(`❌ Você precisa de ${equipment.price} moedas!`);
                
                if (!player.cooking) player.cooking = {};
                if (!player.cooking.equipment) player.cooking.equipment = {};
                
                player.money -= equipment.price;
                player.cooking.equipment[q] = equipment.durability;
                
                await savePlayer(sender, player);
                reply(`✅ Você comprou ${equipment.name} por ${equipment.price} moedas!`);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'skillcozinheiro': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    let text = '📚 *HABILIDADES DE COZINHEIRO*\n\n';
                    for (const [id, skill] of Object.entries(cookingSystem.skills)) {
                        const level = player.cooking?.skills?.[id] || 0;
                        text += `${skill.name} (Nível ${level}/${skill.maxLevel})\n💰 Custo: ${skill.costPerLevel}\n📝 ${skill.description}\n\n`;
                    }
                    return reply(text + `\nPara evoluir use: ${prefix}skillcozinheiro nome_da_skill`);
                }

                const skill = cookingSystem.skills[q];
                if (!skill) return reply('❌ Habilidade não encontrada!');
                
                if (!player.cooking) player.cooking = {};
                if (!player.cooking.skills) player.cooking.skills = {};
                
                const currentLevel = player.cooking.skills[q] || 0;
                if (currentLevel >= skill.maxLevel) return reply('❌ Esta habilidade já está no nível máximo!');
                
                const cost = skill.costPerLevel * (currentLevel + 1);
                if (player.money < cost) return reply(`❌ Você precisa de ${cost} moedas!`);
                
                player.money -= cost;
                player.cooking.skills[q] = currentLevel + 1;
                
                await savePlayer(sender, player);
                reply(`✅ Você evoluiu ${skill.name} para o nível ${currentLevel + 1}!`);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'cozinha': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.cooking) return reply('❌ Você ainda não começou a cozinhar!');
                
                let text = '👨‍🍳 *SUA COZINHA*\n\n';
                text += `📊 Nível: ${player.cooking.level || 1}\n`;
                text += `✨ XP: ${player.cooking.xp || 0}/${(player.cooking.level || 1) * 100}\n\n`;
                
                if (player.cooking.equipment) {
                    text += '*Equipamentos:*\n';
                    for (const [id, durability] of Object.entries(player.cooking.equipment)) {
                        const equipment = cookingSystem.equipment[id];
                        text += `${equipment.name}\n⚡ Durabilidade: ${durability}/${equipment.durability}\n\n`;
                    }
                }
                
                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Comandos de Crafting
        case 'craft': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const [recipeId, amount] = q.split(' ');
                if (!recipeId) return reply(`❌ Especifique uma receita! Use ${prefix}craftlist para ver as receitas disponíveis.`);
                const player = await getPlayer(sender);
                const result = craftSystem.craft(player, recipeId, parseInt(amount) || 1);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'craftlist': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            reply(craftSystem.formatRecipeList());
        }
        break;

        case 'estacoes': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            let text = '🛠️ *ESTAÇÕES DE TRABALHO*\n\n';
            for (const [id, station] of Object.entries(craftSystem.workstations)) {
                text += `${station.name}\n`;
                text += `📝 ${station.description}\n`;
                text += `💰 Preço: ${station.price}\n`;
                text += `📊 Nível necessário: ${station.level}\n\n`;
                text += `*Melhorias:*\n`;
                station.upgrades.forEach(upgrade => {
                    text += `├ ${upgrade.name}\n`;
                    text += `├ 💰 Preço: ${upgrade.price}\n`;
                    text += `├ 📊 Nível: ${upgrade.level}\n`;
                    text += `└ ✨ Bônus: +${upgrade.bonus * 100}%\n\n`;
                });
            }
            reply(text);
        }
        break;

        case 'comprarestacao': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) return reply(`❌ Especifique uma estação! Use ${prefix}estacoes para ver as opções.`);
                const result = craftSystem.buyWorkstation(player, q);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'melhorarestacao': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) return reply(`❌ Especifique uma estação! Use ${prefix}estacoes para ver as opções.`);
                const result = craftSystem.upgradeWorkstation(player, q);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'craftinfo': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                reply(craftSystem.formatCraftingInfo(player));
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Comandos de Batalha
        case 'batalhar': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.battle) {
                    // Inicia nova batalha
                    const enemy = generateEnemy(player.level);
                    player.battle = battleSystem.initializeBattle(player, enemy);
                    await savePlayer(sender, player);
                    reply(battleSystem.formatBattleStatus(player.battle));
                } else {
                    reply('❌ Você já está em uma batalha!');
                }
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'skills': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.class) return reply('❌ Você precisa escolher uma classe primeiro!');
                
                let text = '⚔️ *SUAS HABILIDADES*\n\n';
                Object.entries(battleSystem.skills)
                    .filter(([_, skill]) => skill.type === player.class)
                    .forEach(([id, skill]) => {
                        text += `${skill.name}\n`;
                        text += `├ Energia: ${skill.energyCost}\n`;
                        text += `├ Recarga: ${skill.cooldown} turnos\n`;
                        if (skill.damage) text += `├ Dano: ${skill.damage * 100}%\n`;
                        if (skill.effect) {
                            switch (skill.effect.type) {
                                case 'heal':
                                    text += `└ Cura: ${skill.effect.value * 100}% HP máx\n`;
                                    break;
                                case 'buff':
                                    Object.entries(skill.effect.stats).forEach(([stat, value]) => {
                                        text += `└ ${stat}: ${(value > 1 ? '+' : '')}${Math.floor((value - 1) * 100)}%\n`;
                                    });
                                    break;
                                default:
                                    if (skill.effect.chance) {
                                        text += `└ ${skill.effect.type}: ${skill.effect.chance * 100}% chance\n`;
                                    }
                            }
                        }
                        text += '\n';
                    });
                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'usarskill': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.battle) return reply('❌ Você não está em batalha!');
                if (!q) return reply('❌ Especifique a skill!');
                
                const result = battleSystem.processTurn(player.battle, { type: 'skill', id: q });
                if (result.ended) {
                    delete player.battle;
                    if (result.victory) {
                        // Recompensas de vitória
                        const rewards = calculateBattleRewards(player);
                        result.log.push(`\n💰 Recompensas:\n${rewards}`);
                    }
                }
                
                await savePlayer(sender, player);
                reply(result.log.join('\n\n') + 
                    (!result.ended ? '\n\n' + battleSystem.formatBattleStatus(player.battle) : ''));
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'usaritem': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.battle) return reply('❌ Você não está em batalha!');
                if (!q) return reply('❌ Especifique o item!');
                
                const result = battleSystem.processTurn(player.battle, { type: 'item', id: q });
                if (result.ended) {
                    delete player.battle;
                    if (result.victory) {
                        // Recompensas de vitória
                        const rewards = calculateBattleRewards(player);
                        result.log.push(`\n💰 Recompensas:\n${rewards}`);
                    }
                }
                
                await savePlayer(sender, player);
                reply(result.log.join('\n\n') + 
                    (!result.ended ? '\n\n' + battleSystem.formatBattleStatus(player.battle) : ''));
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'status': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.battle) return reply('❌ Você não está em batalha!');
                reply(battleSystem.formatBattleStatus(player.battle));
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'classe': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    let text = '👥 *CLASSES DISPONÍVEIS*\n\n';
                    text += '*Guerreiro* ⚔️\n';
                    text += '├ Alto HP e Defesa\n';
                    text += '└ Especialista em controle\n\n';
                    text += '*Mago* 🔮\n';
                    text += '├ Alto Dano Mágico\n';
                    text += '└ Habilidades de Suporte\n\n';
                    text += '*Ladino* 🗡️\n';
                    text += '├ Alta Agilidade\n';
                    text += '└ Dano por Status\n\n';
                    text += `Para escolher use: ${prefix}classe nome_da_classe`;
                    return reply(text);
                }

                const classes = ['warrior', 'mage', 'rogue'];
                const className = q.toLowerCase();
                if (!classes.includes(className)) {
                    return reply('❌ Classe inválida!');
                }

                player.class = className;
                await savePlayer(sender, player);
                reply(`✅ Você escolheu a classe: ${className}!`);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Comandos de Dungeon
        case 'dungeon': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) return reply(`❌ Especifique uma dungeon! Use ${prefix}dungeonlist para ver as dungeons disponíveis.`);
                
                if (!player.dungeon) {
                    // Inicia nova dungeon
                    player.dungeon = dungeonSystem.createInstance(q, player);
                    const result = dungeonSystem.processRoom(player.dungeon, player);
                    await savePlayer(sender, player);
                    reply(result.message);
                } else {
                    reply('❌ Você já está em uma dungeon!');
                }
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'dungeonlist': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            reply(dungeonSystem.formatDungeonList());
        }
        break;

        case 'explorar': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.dungeon) return reply('❌ Você não está em uma dungeon!');
                
                // Processa sala atual
                const result = dungeonSystem.processRoom(player.dungeon, player);
                
                // Se for última sala (boss)
                if (result.type === 'boss') {
                    // Inicia batalha com boss
                    if (!player.battle) {
                        const boss = generateBoss(result.boss, player.level);
                        player.battle = battleSystem.initializeBattle(player, boss);
                    }
                    await savePlayer(sender, player);
                    reply(result.message + '\n\n' + battleSystem.formatBattleStatus(player.battle));
                    return;
                }
                
                // Se for evento
                if (result.type === 'event') {
                    await savePlayer(sender, player);
                    reply(`🎲 *EVENTO*\n\n${result.event.name}\n${result.result}`);
                    return;
                }
                
                // Se for combate normal
                if (!player.battle) {
                    const enemies = result.enemies.map(e => generateEnemy(e, player.level));
                    player.battle = battleSystem.initializeBattle(player, enemies[0]);
                }
                
                await savePlayer(sender, player);
                reply(result.message + '\n\n' + battleSystem.formatBattleStatus(player.battle));
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'salaatual': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.dungeon) return reply('❌ Você não está em uma dungeon!');
                
                const dungeon = dungeonSystem.dungeons[player.dungeon.dungeon];
                let text = `🏰 *${dungeon.name}*\n\n`;
                text += `Sala atual: ${player.dungeon.currentRoom}/${dungeon.rooms}\n`;
                text += `Nível recomendado: ${dungeon.level}\n\n`;
                
                if (player.battle) {
                    text += battleSystem.formatBattleStatus(player.battle);
                }
                
                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Comandos de Missões
        case 'missoes': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                let text = '📜 *SUAS MISSÕES* 📜\n\n';
                
                // Missões da História
                text += '*História Principal*\n';
                const currentChapter = player.story?.currentChapter || 'chapter1';
                const chapter = questSystem.quests.story[currentChapter];
                text += `${chapter.name}\n`;
                text += `${chapter.description}\n\n`;
                chapter.tasks.forEach(task => {
                    const progress = player.story?.tasks?.[task.type] || 0;
                    text += `├ ${task.description}\n`;
                    text += `└ Progresso: ${progress}/${task.amount}\n`;
                });
                text += '\n';
                
                // Missões Diárias
                text += '*Missões Diárias*\n';
                if (player.daily?.quests) {
                    Object.entries(player.daily.quests).forEach(([id, quest]) => {
                        const questData = questSystem.quests.daily[id];
                        text += `${questData.name}\n`;
                        text += `├ ${questData.description.replace('{amount}', quest.amount)}\n`;
                        text += `└ Progresso: ${quest.progress}/${quest.amount}\n\n`;
                    });
                } else {
                    text += '_Nenhuma missão diária ativa_\n\n';
                }
                
                // Missões Semanais
                text += '*Missões Semanais*\n';
                if (player.weekly?.quests) {
                    Object.entries(player.weekly.quests).forEach(([id, quest]) => {
                        const questData = questSystem.quests.weekly[id];
                        text += `${questData.name}\n`;
                        text += `├ ${questData.description.replace('{amount}', quest.amount)}\n`;
                        text += `└ Progresso: ${quest.progress}/${quest.amount}\n\n`;
                    });
                } else {
                    text += '_Nenhuma missão semanal ativa_\n';
                }
                
                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'historia': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                let text = '📖 *HISTÓRIA PRINCIPAL* 📖\n\n';
                
                Object.entries(questSystem.quests.story).forEach(([id, chapter]) => {
                    const isCompleted = player.story?.completedChapters?.includes(id);
                    const isCurrent = player.story?.currentChapter === id;
                    
                    text += `${isCompleted ? '✅' : isCurrent ? '➡️' : '❌'} ${chapter.name}\n`;
                    text += `├ ${chapter.description}\n`;
                    text += `└ Recompensas:\n`;
                    text += `  ├ 💰 ${chapter.rewards.money}\n`;
                    text += `  ├ ✨ ${chapter.rewards.xp} XP\n`;
                    text += `  └ 📦 ${chapter.rewards.items.join(', ')}\n\n`;
                });
                
                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'diarias': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                
                // Reseta missões diárias se necessário
                const now = new Date();
                const lastDaily = player.daily?.lastReset ? new Date(player.daily.lastReset) : null;
                if (!lastDaily || now.getDate() !== lastDaily.getDate()) {
                    player.daily = {
                        lastReset: now.toISOString(),
                        quests: generateDailyQuests()
                    };
                    await savePlayer(sender, player);
                }
                
                let text = '📅 *MISSÕES DIÁRIAS* 📅\n\n';
                
                if (player.daily?.quests) {
                    Object.entries(player.daily.quests).forEach(([id, quest]) => {
                        const questData = questSystem.quests.daily[id];
                        const isCompleted = quest.progress >= quest.amount;
                        
                        text += `${isCompleted ? '✅' : '❌'} ${questData.name}\n`;
                        text += `├ ${questData.description.replace('{amount}', quest.amount)}\n`;
                        text += `├ Progresso: ${quest.progress}/${quest.amount}\n`;
                        text += `└ Recompensas:\n`;
                        text += `  ├ 💰 ${questData.rewards.money}\n`;
                        text += `  └ ✨ ${questData.rewards.xp} XP\n\n`;
                    });
                }
                
                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'semanais': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                
                // Reseta missões semanais se necessário
                const now = new Date();
                const lastWeekly = player.weekly?.lastReset ? new Date(player.weekly.lastReset) : null;
                if (!lastWeekly || getDaysDifference(now, lastWeekly) >= 7) {
                    player.weekly = {
                        lastReset: now.toISOString(),
                        quests: generateWeeklyQuests()
                    };
                    await savePlayer(sender, player);
                }
                
                let text = '📅 *MISSÕES SEMANAIS* 📅\n\n';
                
                if (player.weekly?.quests) {
                    Object.entries(player.weekly.quests).forEach(([id, quest]) => {
                        const questData = questSystem.quests.weekly[id];
                        const isCompleted = quest.progress >= quest.amount;
                        
                        text += `${isCompleted ? '✅' : '❌'} ${questData.name}\n`;
                        text += `├ ${questData.description.replace('{amount}', quest.amount)}\n`;
                        text += `├ Progresso: ${quest.progress}/${quest.amount}\n`;
                        text += `└ Recompensas:\n`;
                        text += `  ├ 💰 ${questData.rewards.money}\n`;
                        text += `  ├ ✨ ${questData.rewards.xp} XP\n`;
                        if (questData.rewards.items) {
                            text += `  └ 📦 ${questData.rewards.items.join(', ')}\n`;
                        }
                        if (questData.rewards.faction_points) {
                            text += `  └ ⚔️ ${questData.rewards.faction_points} Pontos de Facção\n`;
                        }
                        text += '\n';
                    });
                }
                
                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Comandos de Pet
        case 'pet': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    reply(petSystem.formatPetList(player));
                    return;
                }

                const [action, ...params] = q.split(' ');
                switch(action) {
                    case 'comprar':
                        const petId = params.join('_').toLowerCase();
                        const result = petSystem.catchPet(player, petId);
                        await savePlayer(sender, player);
                        reply(result.message);
                        break;

                    case 'treinar':
                        const petIndex = parseInt(params[0]) - 1;
                        const trainResult = petSystem.trainPet(player, petIndex);
                        await savePlayer(sender, player);
                        reply(trainResult.message);
                        break;

                    case 'habilidade':
                        const [pIndex, aIndex] = params.map(n => parseInt(n) - 1);
                        const abilityResult = petSystem.usePetAbility(player, pIndex, aIndex);
                        await savePlayer(sender, player);
                        reply(abilityResult.message);
                        break;

                    default:
                        reply('❌ Ação inválida! Use /pet para ver os comandos disponíveis.');
                }
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'petinfo': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) return reply('❌ Especifique o número do pet!');
                
                const petIndex = parseInt(q) - 1;
                const pet = player.pets[petIndex];
                if (!pet) return reply('❌ Pet não encontrado!');

                let text = `${pet.emoji} *${pet.name}*\n\n`;
                text += `Tipo: ${pet.type}\n`;
                text += `Level: ${pet.level}\n`;
                text += `XP: ${pet.xp}/${pet.level * 100}\n\n`;
                text += `*Stats:*\n`;
                Object.entries(pet.stats).forEach(([stat, value]) => {
                    text += `├ ${stat}: ${value}\n`;
                });
                text += `\n*Habilidades:*\n`;
                pet.abilities.forEach(ability => {
                    const abilityInfo = petSystem.abilities[ability];
                    text += `├ ${abilityInfo.name}\n`;
                    text += `└ ${abilityInfo.description}\n`;
                });
                if (pet.evolution) {
                    text += `\nEvolui para: ${petSystem.pets[pet.evolution].name}`;
                }

                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'treinar': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) return reply('❌ Especifique o número do pet!');
                
                const petIndex = parseInt(q) - 1;
                const result = petSystem.trainPet(player, petIndex);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'habilidade': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) return reply('❌ Especifique: número_do_pet número_da_habilidade');
                
                const [petIndex, abilityIndex] = q.split(' ').map(n => parseInt(n) - 1);
                const result = petSystem.usePetAbility(player, petIndex, abilityIndex);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Comandos de Facção
        case 'faccao': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    reply(factionSystem.formatFactionList());
                    return;
                }

                const [action, ...params] = q.split(' ');
                switch(action) {
                    case 'entrar':
                        const factionId = params.join('_').toLowerCase();
                        const result = factionSystem.joinFaction(player, factionId);
                        await savePlayer(sender, player);
                        reply(result.message);
                        break;

                    case 'sair':
                        if (!player.faction) return reply('❌ Você não está em uma facção!');
                        delete player.faction;
                        await savePlayer(sender, player);
                        reply('✅ Você saiu da facção!');
                        break;

                    default:
                        reply('❌ Ação inválida! Use /faccao para ver as facções disponíveis.');
                }
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'faccaoinfo': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                reply(factionSystem.formatFactionInfo(player));
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'guerra': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.faction) return reply('❌ Você não está em uma facção!');

                const [action, ...params] = q ? q.split(' ') : [];
                switch(action) {
                    case 'declarar':
                        if (params.length < 1) return reply('❌ Especifique a facção inimiga!');
                        const enemyId = params.join('_').toLowerCase();
                        const warResult = factionSystem.declareWar(player.faction.id, enemyId);
                        reply(warResult.message);
                        break;

                    case 'entrar':
                        if (!currentWar) return reply('❌ Não há guerra ativa!');
                        const joinResult = factionSystem.joinWar(currentWar, player);
                        reply(joinResult.message);
                        break;

                    case 'status':
                        if (!currentWar) return reply('❌ Não há guerra ativa!');
                        const faction1 = factionSystem.factions[currentWar.faction1];
                        const faction2 = factionSystem.factions[currentWar.faction2];
                        let text = `⚔️ *GUERRA ATUAL* ⚔️\n\n`;
                        text += `${faction1.name} vs ${faction2.name}\n\n`;
                        text += `Pontuação:\n`;
                        text += `├ ${faction1.name}: ${currentWar.points[currentWar.faction1]}\n`;
                        text += `└ ${faction2.name}: ${currentWar.points[currentWar.faction2]}\n\n`;
                        text += `Territórios:\n`;
                        text += `├ ${faction1.name}: ${currentWar.territories[currentWar.faction1].length}\n`;
                        text += `└ ${faction2.name}: ${currentWar.territories[currentWar.faction2].length}`;
                        reply(text);
                        break;

                    default:
                        reply('❌ Ação inválida! Use /guerra declarar, entrar ou status.');
                }
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'territorio': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.faction) return reply('❌ Você não está em uma facção!');
                if (!currentWar) return reply('❌ Não há guerra ativa!');

                const [action, ...params] = q ? q.split(' ') : [];
                switch(action) {
                    case 'capturar':
                        if (params.length < 1) return reply('❌ Especifique o território!');
                        const territoryId = params.join('_').toLowerCase();
                        const territory = {
                            id: territoryId,
                            name: territoryId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                            type: 'outpost'
                        };
                        const result = factionSystem.captureTerritory(currentWar, territory, player);
                        reply(result.message);
                        break;

                    case 'listar':
                        const faction = factionSystem.factions[player.faction.id];
                        let text = `🏰 *TERRITÓRIOS DA FACÇÃO* 🏰\n\n`;
                        text += `Territórios Base:\n`;
                        faction.territories.forEach(t => {
                            text += `└ ${t}\n`;
                        });
                        if (currentWar) {
                            text += `\nTerritórios Conquistados:\n`;
                            currentWar.territories[player.faction.id].forEach(t => {
                                text += `└ ${t.name}\n`;
                            });
                        }
                        reply(text);
                        break;

                    default:
                        reply('❌ Ação inválida! Use /territorio capturar ou listar.');
                }
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Comandos de Eventos
        case 'eventos': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const events = eventSystem.checkForEvents();
                reply(eventSystem.formatEventList());
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'eventoinfo': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const events = eventSystem.getActiveEvents();
                if (!q || !events[q]) return reply('❌ Especifique um evento ativo!');

                const event = events[q];
                let text = `🎉 *${event.name}* 🎉\n\n`;
                text += `${event.description}\n\n`;
                text += `⏰ Tempo restante: ${Math.ceil(event.timeLeft / 1000 / 60)} minutos\n\n`;
                text += `*Efeitos Ativos:*\n`;
                Object.entries(event.effects).forEach(([type, effect]) => {
                    text += `├ ${effect.description}\n`;
                });
                if (event.area) {
                    text += `\nÁrea afetada: ${event.area}`;
                }
                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'participar': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const events = eventSystem.getActiveEvents();
                if (!q || !events[q]) return reply('❌ Especifique um evento ativo!');

                const event = events[q];
                const player = await getPlayer(sender);

                // Aplica efeitos do evento ao jogador
                const effects = eventSystem.applyEventEffects(player, 'all');
                
                let text = `✅ *PARTICIPANDO DO EVENTO*\n\n`;
                text += `${event.name}\n`;
                text += `${event.description}\n\n`;
                text += `*Bônus Ativos:*\n`;
                if (effects.bonus > 1.0) {
                    text += `├ +${((effects.bonus - 1) * 100).toFixed(0)}% em ganhos\n`;
                }
                if (effects.malus < 1.0) {
                    text += `├ ${((1 - effects.malus) * 100).toFixed(0)}% de penalidade\n`;
                }
                Object.entries(effects.chances).forEach(([type, chance]) => {
                    text += `├ ${(chance * 100).toFixed(0)}% de chance de ${type}\n`;
                });

                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Comandos de Economia
        case 'loja': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                if (!q) {
                    let text = `🏪 *LOJAS DISPONÍVEIS* 🏪\n\n`;
                    Object.entries(economySystem.shops).forEach(([id, shop]) => {
                        text += `${shop.name}\n`;
                        text += `├ ${shop.description}\n`;
                        text += `└ Use /loja ${id} para ver os itens\n\n`;
                    });
                    reply(text);
                    return;
                }

                reply(economySystem.formatShopList(q));
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'comprar': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const [shopId, itemId, quantity] = q ? q.split(' ') : [];
                if (!shopId || !itemId) return reply('❌ Use: /comprar loja item quantidade');

                const player = await getPlayer(sender);
                const result = economySystem.buyItem(player, shopId, itemId, parseInt(quantity) || 1);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'vender': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const [itemId, quantity] = q ? q.split(' ') : [];
                if (!itemId) return reply('❌ Use: /vender item quantidade');

                const player = await getPlayer(sender);
                const result = economySystem.sellItem(player, itemId, parseInt(quantity) || 1);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'mercado': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const [action, ...params] = q ? q.split(' ') : [];
                const player = await getPlayer(sender);

                switch(action) {
                    case 'vender':
                        if (params.length < 3) return reply('❌ Use: /mercado vender item quantidade preço');
                        const [itemId, quantity, price] = params;
                        const listResult = economySystem.createMarketListing(
                            player, 
                            itemId, 
                            parseInt(quantity), 
                            parseInt(price)
                        );
                        await savePlayer(sender, player);
                        reply(listResult.message);
                        break;

                    case 'comprar':
                        if (params.length < 1) return reply('❌ Use: /mercado comprar id_listagem');
                        const buyResult = economySystem.buyFromMarket(player, params[0]);
                        await savePlayer(sender, player);
                        reply(buyResult.message);
                        break;

                    default:
                        reply(economySystem.formatMarketList());
                }
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'depositar': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                if (!q) return reply('❌ Especifique o valor!');

                const player = await getPlayer(sender);
                const result = economySystem.deposit(player, parseInt(q));
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'sacar': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                if (!q) return reply('❌ Especifique o valor!');

                const player = await getPlayer(sender);
                const result = economySystem.withdraw(player, parseInt(q));
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'transferir': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const [receiverId, amount] = q ? q.split(' ') : [];
                if (!receiverId || !amount) return reply('❌ Use: /transferir jogador valor');

                const player = await getPlayer(sender);
                const result = economySystem.transfer(player, receiverId, parseInt(amount));
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Comandos de Profissão
        case 'profissao': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                reply(professionSystem.formatProfessionList());
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'profissaoinfo': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                if (!q) return reply('❌ Especifique a profissão!');
                const player = await getPlayer(sender);
                reply(professionSystem.formatProfessionInfo(player, q));
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'aprenderprof': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                if (!q) return reply('❌ Especifique a profissão!');
                const player = await getPlayer(sender);
                const result = professionSystem.learnProfession(player, q);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'melhorarprof': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const [profId, skillId] = q ? q.split(' ') : [];
                if (!profId || !skillId) return reply('❌ Use: /melhorarprof profissao habilidade');

                const player = await getPlayer(sender);
                const result = professionSystem.learnProfessionSkill(player, profId, skillId);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'abandonarprof': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                if (!q) return reply('❌ Especifique a profissão!');
                const player = await getPlayer(sender);
                const result = professionSystem.abandonProfession(player, q);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Comandos Básicos
        // Achievement System Commands
        case 'conquistas': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                reply(achievementSystem.formatAchievements(player));
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'titulos': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                reply(achievementSystem.formatTitles(player));
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'colecao': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                reply(achievementSystem.formatCollection(player));
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Raid System Commands
        case 'raid': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                const result = raidSystem.startRaid(player);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'raidinfo': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                reply(raidSystem.formatRaidInfo(player));
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'entrarraid': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                const result = raidSystem.joinRaid(player, q);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Boss System Commands
        case 'boss': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                const result = bossSystem.initiateBossFight(player);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'bosslist': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                reply(bossSystem.formatBossList());
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'desafiarboss': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) return reply('❌ Especifique o boss!');
                const result = bossSystem.challengeBoss(player, q);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Event System Commands
        case 'eventos': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const events = eventSystem.getActiveEvents();
                if (Object.keys(events).length > 0) {
                    reply(eventSystem.formatEventList(events));
                } else {
                    reply('❌ Nenhum evento ativo no momento!');
                }
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;
        
        // Clan System Commands
        case 'clan': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    reply(clanSystem.formatClanList());
                    return;
                }

                const [action, ...params] = q.split(' ');
                switch(action) {
                    case 'criar':
                        if (params.length < 2) return reply('❌ Use: /clan criar nome tag');
                        const [name, tag] = params;
                        const result = clanSystem.createClan(player, name, tag);
                        await savePlayer(sender, player);
                        reply(result.message);
                        break;
                    case 'sair':
                        const leaveResult = clanSystem.leaveClan(player);
                        await savePlayer(sender, player);
                        reply(leaveResult.message);
                        break;
                    default:
                        reply('❌ Ação inválida! Use /clan criar ou /clan sair');
                }
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'claninfo': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.clan) return reply('❌ Você não está em um clã!');
                const clan = clanSystem.clans[player.clan.id];
                reply(clanSystem.formatClanInfo(clan));
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'banco': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.clan) return reply('❌ Você não está em um clã!');
                
                if (!q) {
                    const clan = clanSystem.clans[player.clan.id];
                    let text = '🏦 *BANCO DO CLÃ*\n\n';
                    text += `Capacidade: ${clan.bank.capacity}\n\n`;
                    text += '*Recursos:*\n';
                    Object.entries(clan.bank.resources).forEach(([resource, amount]) => {
                        text += `${resource}: ${amount}\n`;
                    });
                    reply(text);
                    return;
                }

                const [action, resource, amount] = q.split(' ');
                if (!action || !resource || !amount) return reply('❌ Use: /banco depositar/sacar recurso quantidade');

                const result = action === 'depositar' 
                    ? clanSystem.depositResource(player, resource, parseInt(amount))
                    : clanSystem.withdrawResource(player, resource, parseInt(amount));
                
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'construcao': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.clan) return reply('❌ Você não está em um clã!');
                
                if (!q) {
                    let text = '🏗️ *CONSTRUÇÕES DO CLÃ*\n\n';
                    Object.entries(clanSystem.upgrades).forEach(([id, building]) => {
                        const clan = clanSystem.clans[player.clan.id];
                        const level = clan.buildings[id];
                        text += `${building.name}\n`;
                        text += `├ Nível: ${level}/${building.maxLevel}\n`;
                        if (level < building.maxLevel) {
                            text += `├ Custo: ${building.cost(level + 1)}\n`;
                            text += `└ Próximo nível: ${Object.entries(building.effect(level + 1))
                                .map(([stat, value]) => `${stat} +${value * 100}%`)
                                .join(', ')}\n\n`;
                        }
                    });
                    reply(text);
                    return;
                }

                const result = clanSystem.upgradeBuilding(player, q, player.clan.id);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Investment System Commands
        case 'investir': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    reply(investmentSystem.formatInvestmentOptions());
                    return;
                }
                const [action, amount] = q.split(' ');
                const result = investmentSystem.invest(player, action, parseInt(amount));
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'portfolio': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                reply(investmentSystem.formatPortfolio(player));
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'acoes': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    reply(investmentSystem.formatStockMarket());
                    return;
                }
                const [action, stock, amount] = q.split(' ');
                if (action === 'comprar') {
                    const result = investmentSystem.buyStock(player, stock, parseInt(amount));
                    await savePlayer(sender, player);
                    reply(result.message);
                } else if (action === 'vender') {
                    const result = investmentSystem.sellStock(player, stock, parseInt(amount));
                    await savePlayer(sender, player);
                    reply(result.message);
                } else {
                    reply('❌ Use: /acoes comprar/vender acao quantidade');
                }
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'dividendos': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                const result = investmentSystem.collectDividends(player);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Casino System Commands
        case 'cassino': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                reply(casinoSystem.formatCasinoInfo());
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'roleta': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) return reply('❌ Use: /roleta aposta número');
                const [bet, number] = q.split(' ');
                const result = casinoSystem.playRoulette(player, parseInt(bet), parseInt(number));
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'blackjack': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) return reply('❌ Use: /blackjack aposta');
                const result = casinoSystem.playBlackjack(player, parseInt(q));
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'slots': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) return reply('❌ Use: /slots aposta');
                const result = casinoSystem.playSlots(player, parseInt(q));
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Career System Commands
        case 'carreira': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    reply(careerSystem.formatCareerList());
                    return;
                }
                const result = careerSystem.startCareer(player, q);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'trabalhar': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                const result = careerSystem.work(player);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'promover': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                const result = careerSystem.promote(player);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'especializar': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    reply(careerSystem.formatSpecializationList(player));
                    return;
                }
                const result = careerSystem.specialize(player, q);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Class System Commands
        case 'subclasse': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.class) return reply('❌ Escolha uma classe principal primeiro!');
                if (!q) {
                    reply(classSystem.formatSubclassList(player.class));
                    return;
                }
                const result = classSystem.chooseSubclass(player, q);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'talentos': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.class) return reply('❌ Escolha uma classe primeiro!');
                if (!q) {
                    reply(classSystem.formatTalentTree(player));
                    return;
                }
                const result = classSystem.learnTalent(player, q);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'atributos': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.class) return reply('❌ Escolha uma classe primeiro!');
                if (!q) {
                    reply(classSystem.formatAttributes(player));
                    return;
                }
                const [attribute, points] = q.split(' ');
                const result = classSystem.allocateAttributePoints(player, attribute, parseInt(points));
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Gang System Commands
        case 'gang': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) {
                    reply(gangSystem.formatGangList());
                    return;
                }
                const [action, ...params] = q.split(' ');
                switch(action) {
                    case 'criar':
                        if (params.length < 1) return reply('❌ Use: /gang criar nome');
                        const result = gangSystem.createGang(player, params.join(' '));
                        await savePlayer(sender, player);
                        reply(result.message);
                        break;
                    case 'sair':
                        const leaveResult = gangSystem.leaveGang(player);
                        await savePlayer(sender, player);
                        reply(leaveResult.message);
                        break;
                    default:
                        reply('❌ Ação inválida! Use /gang criar ou /gang sair');
                }
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'ganginfo': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!player.gang) return reply('❌ Você não está em uma gang!');
                reply(gangSystem.formatGangInfo(player.gang));
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'criargang': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                if (!q) return reply('❌ Use: /criargang nome');
                const result = gangSystem.createGang(player, q);
                await savePlayer(sender, player);
                reply(result.message);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        // Inventory Command
        case 'inventario': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            try {
                const player = await getPlayer(sender);
                let text = '🎒 *SEU INVENTÁRIO*\n\n';
                
                // Minerais
                if (player.mining?.minerals) {
                    text += '*Minerais:*\n';
                    Object.entries(player.mining.minerals).forEach(([mineral, amount]) => {
                        text += `${miningSystem.minerals[mineral].emoji} ${miningSystem.minerals[mineral].name}: ${amount}\n`;
                    });
                    text += '\n';
                }
                
                // Plantações
                if (player.farming?.inventory) {
                    text += '*Plantações:*\n';
                    Object.entries(player.farming.inventory).forEach(([crop, amount]) => {
                        text += `${farmingSystem.crops[crop].emoji} ${farmingSystem.crops[crop].name}: ${amount}\n`;
                    });
                    text += '\n';
                }
                
                // Peixes
                if (player.fishing?.inventory) {
                    text += '*Peixes:*\n';
                    Object.entries(player.fishing.inventory).forEach(([fish, amount]) => {
                        text += `${fishingSystem.fishes[fish].emoji} ${fishingSystem.fishes[fish].name}: ${amount}\n`;
                    });
                    text += '\n';
                }
                
                // Comidas
                if (player.cooking?.inventory) {
                    text += '*Comidas:*\n';
                    Object.entries(player.cooking.inventory).forEach(([food, amount]) => {
                        text += `${cookingSystem.recipes[food].emoji} ${cookingSystem.recipes[food].name}: ${amount}\n`;
                    });
                    text += '\n';
                }
                
                // Itens Craftados
                if (player.crafting?.inventory) {
                    text += '*Itens Craftados:*\n';
                    Object.entries(player.crafting.inventory).forEach(([item, amount]) => {
                        text += `${craftSystem.items[item].emoji} ${craftSystem.items[item].name}: ${amount}\n`;
                    });
                    text += '\n';
                }
                
                // Equipamentos
                if (player.equipment) {
                    text += '*Equipamentos:*\n';
                    Object.entries(player.equipment).forEach(([slot, item]) => {
                        if (item) text += `${slot}: ${item.name}\n`;
                    });
                }
                
                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'registrar': {
            if (playerExists(sender)) return reply('❌ Você já está registrado!');
            if (!q) return reply(`❌ Digite seu nome. Exemplo: ${prefix}registrar Aventureiro`);
            try {
                createPlayer(sender, q);
                reply(`✅ Bem-vindo ao RPG, ${q}!`);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;

        case 'perfil': {
            if (!playerExists(sender)) return reply(`❌ Você não está registrado! Use ${prefix}registrar para começar.`);
            
            try {
                const player = await getPlayer(sender);
                let text = formatProfile(player);
                reply(text);
            } catch (e) {
                reply('❌ ' + e.message);
            }
        }
        break;
    }
};

module.exports = rpgCommands;
