class TerritorySystem {
    constructor() {
        this.territories = {
            // Capitais
            'cidade_real': {
                name: 'Cidade Real',
                type: 'capital',
                description: 'A grandiosa capital do reino',
                resources: ['ouro', 'ferro', 'madeira', 'pedra'],
                buildings: ['castelo', 'mercado', 'forja', 'templo'],
                defense: 1000,
                income: 10000,
                maxGarrison: 100,
                controlPoints: 100
            },
            'torre_arcana': {
                name: 'Torre Arcana',
                type: 'capital',
                description: 'Centro do poder mágico',
                resources: ['cristal', 'essencia', 'pergaminho', 'gema'],
                buildings: ['biblioteca', 'laboratorio', 'portal', 'altar'],
                defense: 800,
                income: 12000,
                maxGarrison: 80,
                controlPoints: 100
            },

            // Cidades
            'porto_comercial': {
                name: 'Porto Comercial',
                type: 'city',
                description: 'Um movimentado porto mercante',
                resources: ['peixe', 'madeira', 'tecido', 'especiarias'],
                buildings: ['porto', 'mercado', 'armazem', 'estaleiro'],
                defense: 500,
                income: 5000,
                maxGarrison: 50,
                controlPoints: 50
            },
            'cidade_mineradora': {
                name: 'Cidade Mineradora',
                type: 'city',
                description: 'Centro de mineração do reino',
                resources: ['ferro', 'carvao', 'ouro', 'gema'],
                buildings: ['mina', 'forja', 'refinaria', 'joalheria'],
                defense: 600,
                income: 6000,
                maxGarrison: 60,
                controlPoints: 50
            },

            // Postos Avançados
            'posto_fronteira': {
                name: 'Posto de Fronteira',
                type: 'outpost',
                description: 'Defesa da fronteira do reino',
                resources: ['madeira', 'pedra'],
                buildings: ['torre', 'quartel', 'muralha'],
                defense: 300,
                income: 2000,
                maxGarrison: 30,
                controlPoints: 20
            },
            'acampamento_mineracao': {
                name: 'Acampamento de Mineração',
                type: 'outpost',
                description: 'Local de extração de recursos',
                resources: ['ferro', 'carvao'],
                buildings: ['mina', 'forja', 'alojamento'],
                defense: 200,
                income: 3000,
                maxGarrison: 20,
                controlPoints: 20
            }
        };

        // Construções
        this.buildings = {
            'castelo': {
                name: 'Castelo',
                cost: {
                    pedra: 1000,
                    madeira: 500,
                    ouro: 10000
                },
                effects: {
                    defense: 500,
                    garrison: 50
                },
                upgrades: [
                    {
                        level: 2,
                        cost: {
                            pedra: 2000,
                            madeira: 1000,
                            ouro: 20000
                        },
                        effects: {
                            defense: 1000,
                            garrison: 100
                        }
                    },
                    {
                        level: 3,
                        cost: {
                            pedra: 5000,
                            madeira: 2500,
                            ouro: 50000
                        },
                        effects: {
                            defense: 2000,
                            garrison: 200
                        }
                    }
                ]
            },
            'mercado': {
                name: 'Mercado',
                cost: {
                    madeira: 300,
                    ouro: 5000
                },
                effects: {
                    income: 1000,
                    trade: 1.2
                },
                upgrades: [
                    {
                        level: 2,
                        cost: {
                            madeira: 600,
                            ouro: 10000
                        },
                        effects: {
                            income: 2000,
                            trade: 1.4
                        }
                    },
                    {
                        level: 3,
                        cost: {
                            madeira: 1200,
                            ouro: 20000
                        },
                        effects: {
                            income: 4000,
                            trade: 1.6
                        }
                    }
                ]
            }
        };

        // Recursos
        this.resources = {
            'ouro': {
                name: 'Ouro',
                baseValue: 100,
                maxStorage: 10000
            },
            'madeira': {
                name: 'Madeira',
                baseValue: 50,
                maxStorage: 5000
            },
            'pedra': {
                name: 'Pedra',
                baseValue: 75,
                maxStorage: 5000
            },
            'ferro': {
                name: 'Ferro',
                baseValue: 150,
                maxStorage: 3000
            },
            'cristal': {
                name: 'Cristal',
                baseValue: 500,
                maxStorage: 1000
            }
        };

        // Sistema de Controle
        this.controlSystem = {
            captureTime: 300000, // 5 minutos
            minDefenders: 5,
            maxAttackers: 20,
            contestPeriod: 3600000 // 1 hora
        };
    }

    captureTerritory(territory, faction, attackers) {
        const terr = this.territories[territory];
        if (!terr) throw new Error('❌ Território não encontrado!');

        // Verifica número de atacantes
        if (attackers.length > this.controlSystem.maxAttackers) {
            throw new Error(`❌ Máximo de ${this.controlSystem.maxAttackers} atacantes!`);
        }

        // Inicia captura
        return {
            id: `capture_${Date.now()}`,
            territory: territory,
            faction: faction,
            attackers: attackers,
            startTime: Date.now(),
            endTime: Date.now() + this.controlSystem.captureTime,
            status: 'capturing' // capturing, contested, completed
        };
    }

    contestCapture(capture, defenders) {
        if (capture.status !== 'capturing') {
            throw new Error('❌ Captura não está em andamento!');
        }

        // Verifica número de defensores
        if (defenders.length < this.controlSystem.minDefenders) {
            throw new Error(`❌ Mínimo de ${this.controlSystem.minDefenders} defensores!`);
        }

        capture.status = 'contested';
        capture.defenders = defenders;
        capture.contestTime = Date.now();

        return {
            success: true,
            message: `⚔️ *TERRITÓRIO CONTESTADO*\n\n` +
                    `${this.territories[capture.territory].name}\n` +
                    `Atacantes: ${capture.attackers.length}\n` +
                    `Defensores: ${defenders.length}\n\n` +
                    `A batalha começará em breve!`
        };
    }

    resolveCapture(capture, battleResult) {
        const territory = this.territories[capture.territory];

        if (battleResult.winner === 'attackers') {
            // Território capturado
            return {
                success: true,
                captured: true,
                message: `🏰 *TERRITÓRIO CAPTURADO*\n\n` +
                        `${territory.name} foi conquistado por ${capture.faction}!\n\n` +
                        `Recursos obtidos:\n` +
                        territory.resources.map(r => 
                            `└ ${this.resources[r].name}: ${this.resources[r].baseValue}`
                        ).join('\n')
            };
        } else {
            // Defesa bem sucedida
            return {
                success: true,
                captured: false,
                message: `🛡️ *TERRITÓRIO DEFENDIDO*\n\n` +
                        `${territory.name} resistiu ao ataque!`
            };
        }
    }

    collectResources(territory, faction) {
        const terr = this.territories[territory];
        if (!terr) throw new Error('❌ Território não encontrado!');

        // Calcula recursos
        const resources = {};
        terr.resources.forEach(resource => {
            resources[resource] = Math.floor(
                this.resources[resource].baseValue * 
                (Math.random() * 0.4 + 0.8) // 80-120% do valor base
            );
        });

        return {
            success: true,
            resources: resources,
            message: `📦 *RECURSOS COLETADOS*\n\n` +
                    `${terr.name}\n\n` +
                    Object.entries(resources)
                        .map(([r, amount]) => `${this.resources[r].name}: ${amount}`)
                        .join('\n')
        };
    }

    buildStructure(territory, building) {
        const terr = this.territories[territory];
        if (!terr) throw new Error('❌ Território não encontrado!');

        const struct = this.buildings[building];
        if (!struct) throw new Error('❌ Construção não encontrada!');

        // Verifica se pode construir
        if (!terr.buildings.includes(building)) {
            throw new Error('❌ Esta construção não é permitida neste território!');
        }

        return {
            success: true,
            building: struct,
            message: `🏗️ *CONSTRUÇÃO INICIADA*\n\n` +
                    `${struct.name} em ${terr.name}\n\n` +
                    `Custos:\n` +
                    Object.entries(struct.cost)
                        .map(([r, amount]) => `└ ${this.resources[r].name}: ${amount}`)
                        .join('\n') +
                    `\n\nEfeitos:\n` +
                    Object.entries(struct.effects)
                        .map(([effect, value]) => `└ ${effect}: +${value}`)
                        .join('\n')
        };
    }

    upgradeStructure(territory, building) {
        const terr = this.territories[territory];
        if (!terr) throw new Error('❌ Território não encontrado!');

        const struct = this.buildings[building];
        if (!struct) throw new Error('❌ Construção não encontrada!');

        // Encontra próximo nível
        const currentLevel = terr.buildingLevels?.[building] || 1;
        const upgrade = struct.upgrades.find(u => u.level === currentLevel + 1);

        if (!upgrade) {
            throw new Error('❌ Nível máximo atingido!');
        }

        return {
            success: true,
            upgrade: upgrade,
            message: `🏗️ *MELHORIA INICIADA*\n\n` +
                    `${struct.name} nível ${upgrade.level}\n\n` +
                    `Custos:\n` +
                    Object.entries(upgrade.cost)
                        .map(([r, amount]) => `└ ${this.resources[r].name}: ${amount}`)
                        .join('\n') +
                    `\n\nNovos efeitos:\n` +
                    Object.entries(upgrade.effects)
                        .map(([effect, value]) => `└ ${effect}: +${value}`)
                        .join('\n')
        };
    }

    formatTerritoryList() {
        let text = `🗺️ *TERRITÓRIOS* 🗺️\n\n`;

        Object.entries(this.territories).forEach(([id, terr]) => {
            text += `*${terr.name}*\n`;
            text += `├ ${terr.description}\n`;
            text += `├ Tipo: ${terr.type}\n`;
            text += `├ Defesa: ${terr.defense}\n`;
            text += `├ Renda: R$ ${terr.income}\n`;
            text += `├ Guarnição: ${terr.maxGarrison}\n`;
            text += `├ Pontos de Controle: ${terr.controlPoints}\n`;
            text += `├ Recursos:\n`;
            terr.resources.forEach(r => {
                text += `│ └ ${this.resources[r].name}\n`;
            });
            text += `└ Construções:\n`;
            terr.buildings.forEach(b => {
                text += `  └ ${this.buildings[b].name}\n`;
            });
            text += '\n';
        });

        return text;
    }

    formatTerritoryInfo(territory) {
        const terr = this.territories[territory];
        if (!terr) throw new Error('❌ Território não encontrado!');

        let text = `🏰 *${terr.name}* 🏰\n\n`;
        text += `${terr.description}\n\n`;
        
        text += `📊 *INFORMAÇÕES*\n`;
        text += `├ Tipo: ${terr.type}\n`;
        text += `├ Defesa: ${terr.defense}\n`;
        text += `├ Renda: R$ ${terr.income}\n`;
        text += `└ Guarnição: ${terr.maxGarrison}\n\n`;
        
        text += `📦 *RECURSOS*\n`;
        terr.resources.forEach(r => {
            const resource = this.resources[r];
            text += `├ ${resource.name}\n`;
            text += `└ Valor base: ${resource.baseValue}\n`;
        });
        text += '\n';
        
        text += `🏗️ *CONSTRUÇÕES*\n`;
        terr.buildings.forEach(b => {
            const building = this.buildings[b];
            text += `├ ${building.name}\n`;
            text += `└ Efeitos:\n`;
            Object.entries(building.effects).forEach(([effect, value]) => {
                text += `  └ ${effect}: +${value}\n`;
            });
        });

        return text;
    }
}

module.exports = new TerritorySystem();
