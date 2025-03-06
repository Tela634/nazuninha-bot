class ClanSystem {
    constructor() {
        this.clans = {};
        this.maxMembers = {
            1: 10,  // Nível 1: 10 membros
            2: 15,  // Nível 2: 15 membros
            3: 20,  // Nível 3: 20 membros
            4: 25,  // Nível 4: 25 membros
            5: 30   // Nível 5: 30 membros
        };

        this.upgrades = {
            'banco': {
                name: 'Banco do Clã',
                description: 'Armazena recursos para membros',
                maxLevel: 5,
                cost: level => 50000 * level,
                effect: level => ({ capacity: 1000000 * level })
            },
            'forja': {
                name: 'Forja do Clã',
                description: 'Permite criar itens especiais',
                maxLevel: 5,
                cost: level => 100000 * level,
                effect: level => ({ craftBonus: 0.1 * level })
            },
            'altar': {
                name: 'Altar do Clã',
                description: 'Fornece bônus de XP',
                maxLevel: 5,
                cost: level => 75000 * level,
                effect: level => ({ xpBonus: 0.05 * level })
            },
            'quartel': {
                name: 'Quartel do Clã',
                description: 'Aumenta poder em guerras',
                maxLevel: 5,
                cost: level => 150000 * level,
                effect: level => ({ attackBonus: 0.1 * level })
            }
        };
    }

    createClan(leader, name, tag) {
        // Verifica se nome/tag já existem
        if (Object.values(this.clans).some(c => c.name === name || c.tag === tag)) {
            throw new Error('❌ Nome ou tag já em uso!');
        }

        // Verifica formato da tag
        if (!/^[A-Z]{2,4}$/.test(tag)) {
            throw new Error('❌ Tag deve ter 2-4 letras maiúsculas!');
        }

        // Cria o clã
        const clan = {
            id: `clan_${Date.now()}`,
            name: name,
            tag: tag,
            leader: leader.id,
            officers: [],
            members: [leader.id],
            level: 1,
            xp: 0,
            money: 0,
            bank: {
                capacity: 1000000,
                resources: {}
            },
            buildings: {
                banco: 1,
                forja: 0,
                altar: 0,
                quartel: 0
            },
            wars: {
                wins: 0,
                losses: 0
            },
            createdAt: Date.now()
        };

        this.clans[clan.id] = clan;

        return {
            success: true,
            clan: clan,
            message: `🛡️ *CLÃ CRIADO*\n\n` +
                    `Nome: ${clan.name}\n` +
                    `Tag: [${clan.tag}]\n` +
                    `Líder: ${leader.name}\n\n` +
                    `Use /clan convidar para recrutar membros!`
        };
    }

    joinClan(player, clanId) {
        const clan = this.clans[clanId];
        if (!clan) throw new Error('❌ Clã não encontrado!');

        // Verifica se já está em um clã
        if (player.clan) {
            throw new Error('❌ Você já está em um clã! Use /clan sair primeiro.');
        }

        // Verifica limite de membros
        if (clan.members.length >= this.maxMembers[clan.level]) {
            throw new Error('❌ Este clã está cheio!');
        }

        // Adiciona ao clã
        clan.members.push(player.id);
        player.clan = {
            id: clanId,
            joined: Date.now()
        };

        return {
            success: true,
            message: `✅ Você entrou no clã ${clan.name} [${clan.tag}]!`
        };
    }

    leaveClan(player) {
        if (!player.clan) throw new Error('❌ Você não está em um clã!');

        const clan = this.clans[player.clan.id];
        if (!clan) throw new Error('❌ Clã não encontrado!');

        // Remove do clã
        clan.members = clan.members.filter(id => id !== player.id);
        clan.officers = clan.officers.filter(id => id !== player.id);

        // Se era o líder, promove oficial mais antigo
        if (clan.leader === player.id) {
            if (clan.officers.length > 0) {
                clan.leader = clan.officers[0];
                clan.officers = clan.officers.slice(1);
            } else if (clan.members.length > 0) {
                clan.leader = clan.members[0];
            } else {
                // Clã ficou vazio, deleta
                delete this.clans[clan.id];
                return {
                    success: true,
                    message: `🏰 O clã ${clan.name} foi dissolvido!`
                };
            }
        }

        delete player.clan;

        return {
            success: true,
            message: `✅ Você saiu do clã ${clan.name}!`
        };
    }

    promoteMember(leader, targetId, clanId) {
        const clan = this.clans[clanId];
        if (!clan) throw new Error('❌ Clã não encontrado!');

        // Verifica permissão
        if (clan.leader !== leader.id) {
            throw new Error('❌ Apenas o líder pode promover membros!');
        }

        // Verifica se alvo é membro
        if (!clan.members.includes(targetId)) {
            throw new Error('❌ Jogador não é membro do clã!');
        }

        // Promove para oficial
        clan.members = clan.members.filter(id => id !== targetId);
        clan.officers.push(targetId);

        return {
            success: true,
            message: `⭐ Membro promovido a Oficial!`
        };
    }

    demoteMember(leader, targetId, clanId) {
        const clan = this.clans[clanId];
        if (!clan) throw new Error('❌ Clã não encontrado!');

        // Verifica permissão
        if (clan.leader !== leader.id) {
            throw new Error('❌ Apenas o líder pode rebaixar oficiais!');
        }

        // Verifica se alvo é oficial
        if (!clan.officers.includes(targetId)) {
            throw new Error('❌ Jogador não é oficial do clã!');
        }

        // Rebaixa para membro
        clan.officers = clan.officers.filter(id => id !== targetId);
        clan.members.push(targetId);

        return {
            success: true,
            message: `⬇️ Oficial rebaixado a Membro!`
        };
    }

    kickMember(leader, targetId, clanId) {
        const clan = this.clans[clanId];
        if (!clan) throw new Error('❌ Clã não encontrado!');

        // Verifica permissão
        if (clan.leader !== leader.id && !clan.officers.includes(leader.id)) {
            throw new Error('❌ Apenas líder e oficiais podem expulsar membros!');
        }

        // Verifica se alvo é membro
        if (!clan.members.includes(targetId)) {
            throw new Error('❌ Jogador não é membro do clã!');
        }

        // Remove do clã
        clan.members = clan.members.filter(id => id !== targetId);

        return {
            success: true,
            message: `❌ Membro expulso do clã!`
        };
    }

    depositResource(player, resource, amount) {
        if (!player.clan) throw new Error('❌ Você não está em um clã!');

        const clan = this.clans[player.clan.id];
        if (!clan) throw new Error('❌ Clã não encontrado!');

        // Verifica capacidade do banco
        const currentTotal = Object.values(clan.bank.resources)
            .reduce((sum, amt) => sum + amt, 0);
        
        if (currentTotal + amount > clan.bank.capacity) {
            throw new Error('❌ Banco do clã está cheio!');
        }

        // Deposita recurso
        if (!clan.bank.resources[resource]) {
            clan.bank.resources[resource] = 0;
        }
        clan.bank.resources[resource] += amount;

        return {
            success: true,
            message: `✅ Depositado ${amount}x ${resource} no banco do clã!`
        };
    }

    withdrawResource(player, resource, amount) {
        if (!player.clan) throw new Error('❌ Você não está em um clã!');

        const clan = this.clans[player.clan.id];
        if (!clan) throw new Error('❌ Clã não encontrado!');

        // Verifica se tem o recurso
        if (!clan.bank.resources[resource] || clan.bank.resources[resource] < amount) {
            throw new Error('❌ Recursos insuficientes no banco!');
        }

        // Retira recurso
        clan.bank.resources[resource] -= amount;

        return {
            success: true,
            message: `✅ Retirado ${amount}x ${resource} do banco do clã!`
        };
    }

    upgradeBuilding(leader, buildingId, clanId) {
        const clan = this.clans[clanId];
        if (!clan) throw new Error('❌ Clã não encontrado!');

        // Verifica permissão
        if (clan.leader !== leader.id) {
            throw new Error('❌ Apenas o líder pode melhorar construções!');
        }

        const building = this.upgrades[buildingId];
        if (!building) throw new Error('❌ Construção não encontrada!');

        const currentLevel = clan.buildings[buildingId];
        if (currentLevel >= building.maxLevel) {
            throw new Error('❌ Construção já está no nível máximo!');
        }

        // Verifica custo
        const cost = building.cost(currentLevel + 1);
        if (clan.money < cost) {
            throw new Error(`❌ O clã precisa de R$ ${cost} para esta melhoria!`);
        }

        // Aplica upgrade
        clan.money -= cost;
        clan.buildings[buildingId]++;

        // Aplica efeitos
        const effect = building.effect(clan.buildings[buildingId]);
        if (buildingId === 'banco') {
            clan.bank.capacity = effect.capacity;
        }

        return {
            success: true,
            message: `🏗️ *CONSTRUÇÃO MELHORADA*\n\n` +
                    `${building.name} ➡️ Nível ${clan.buildings[buildingId]}\n` +
                    `Efeito: ${Object.entries(effect)
                        .map(([stat, value]) => `${stat} +${value * 100}%`)
                        .join(', ')}`
        };
    }

    formatClanList() {
        let text = `🛡️ *CLÃS* 🛡️\n\n`;

        Object.values(this.clans).forEach(clan => {
            text += `*${clan.name}* [${clan.tag}]\n`;
            text += `├ Nível: ${clan.level}\n`;
            text += `├ Membros: ${clan.members.length + clan.officers.length + 1}/${this.maxMembers[clan.level]}\n`;
            text += `├ Guerras: ${clan.wars.wins}V/${clan.wars.losses}D\n`;
            text += `└ Construções:\n`;
            Object.entries(clan.buildings).forEach(([id, level]) => {
                if (level > 0) {
                    text += `   └ ${this.upgrades[id].name}: ${level}\n`;
                }
            });
            text += '\n';
        });

        return text;
    }

    formatClanInfo(clan) {
        let text = `🛡️ *${clan.name}* [${clan.tag}]\n\n`;
        text += `Nível: ${clan.level}\n`;
        text += `XP: ${clan.xp}/${clan.level * 1000}\n`;
        text += `Dinheiro: R$ ${clan.money}\n\n`;

        text += `*Membros (${clan.members.length + clan.officers.length + 1}/${this.maxMembers[clan.level]})*\n`;
        text += `👑 Líder: ${clan.leader}\n`;
        if (clan.officers.length > 0) {
            text += `⭐ Oficiais:\n`;
            clan.officers.forEach(id => {
                text += `├ ${id}\n`;
            });
        }
        if (clan.members.length > 0) {
            text += `👥 Membros:\n`;
            clan.members.forEach(id => {
                text += `├ ${id}\n`;
            });
        }

        text += `\n*Construções*\n`;
        Object.entries(clan.buildings).forEach(([id, level]) => {
            const building = this.upgrades[id];
            text += `${building.name}\n`;
            text += `├ Nível: ${level}/${building.maxLevel}\n`;
            if (level > 0) {
                const effect = building.effect(level);
                text += `└ Bônus: ${Object.entries(effect)
                    .map(([stat, value]) => `${stat} +${value * 100}%`)
                    .join(', ')}\n`;
            }
            text += '\n';
        });

        text += `*Banco do Clã*\n`;
        text += `Capacidade: ${clan.bank.capacity}\n`;
        if (Object.keys(clan.bank.resources).length > 0) {
            text += `Recursos:\n`;
            Object.entries(clan.bank.resources).forEach(([resource, amount]) => {
                text += `└ ${resource}: ${amount}\n`;
            });
        }

        text += `\n*Guerras*\n`;
        text += `Vitórias: ${clan.wars.wins}\n`;
        text += `Derrotas: ${clan.wars.losses}\n`;
        text += `Taxa: ${((clan.wars.wins / (clan.wars.wins + clan.wars.losses)) * 100).toFixed(1)}%`;

        return text;
    }
}

module.exports = new ClanSystem();
