class QuestSystem {
    constructor() {
        this.quests = {
            // Missões Diárias
            'daily': {
                // Missões de Combate
                'derrotar_monstros': {
                    name: 'Caçador de Monstros',
                    description: 'Derrote {amount} monstros',
                    type: 'combat',
                    amount: 20,
                    rewards: {
                        money: 2000,
                        xp: 1000
                    },
                    chance: 0.5
                },
                'vencer_pvp': {
                    name: 'Guerreiro PvP',
                    description: 'Vença {amount} batalhas PvP',
                    type: 'pvp',
                    amount: 5,
                    rewards: {
                        money: 3000,
                        xp: 1500
                    },
                    chance: 0.3
                },

                // Missões de Mineração
                'minerar_recursos': {
                    name: 'Minerador Dedicado',
                    description: 'Minere {amount} recursos',
                    type: 'mining',
                    amount: 50,
                    rewards: {
                        money: 1500,
                        xp: 800
                    },
                    chance: 0.5
                },
                'encontrar_gemas': {
                    name: 'Caçador de Gemas',
                    description: 'Encontre {amount} gemas',
                    type: 'mining_rare',
                    amount: 3,
                    rewards: {
                        money: 5000,
                        xp: 2000
                    },
                    chance: 0.2
                },

                // Missões de Pesca
                'pescar_peixes': {
                    name: 'Pescador do Dia',
                    description: 'Pesque {amount} peixes',
                    type: 'fishing',
                    amount: 30,
                    rewards: {
                        money: 1000,
                        xp: 500
                    },
                    chance: 0.5
                },
                'pescar_raros': {
                    name: 'Pescador de Elite',
                    description: 'Pesque {amount} peixes raros',
                    type: 'fishing_rare',
                    amount: 2,
                    rewards: {
                        money: 4000,
                        xp: 1500
                    },
                    chance: 0.2
                },

                // Missões de Fazenda
                'colher_plantas': {
                    name: 'Fazendeiro Ativo',
                    description: 'Colha {amount} plantas',
                    type: 'farming',
                    amount: 20,
                    rewards: {
                        money: 1000,
                        xp: 500
                    },
                    chance: 0.5
                },
                'plantar_especiais': {
                    name: 'Agricultor Especial',
                    description: 'Plante {amount} cultivos especiais',
                    type: 'farming_special',
                    amount: 5,
                    rewards: {
                        money: 3000,
                        xp: 1200
                    },
                    chance: 0.3
                },

                // Missões de Culinária
                'cozinhar_refeicoes': {
                    name: 'Chef do Dia',
                    description: 'Prepare {amount} refeições',
                    type: 'cooking',
                    amount: 15,
                    rewards: {
                        money: 1000,
                        xp: 500
                    },
                    chance: 0.5
                },
                'pratos_perfeitos': {
                    name: 'Chef Perfeito',
                    description: 'Prepare {amount} pratos perfeitos',
                    type: 'cooking_perfect',
                    amount: 3,
                    rewards: {
                        money: 3000,
                        xp: 1200
                    },
                    chance: 0.2
                },

                // Missões de Pet
                'treinar_pet': {
                    name: 'Treinador Dedicado',
                    description: 'Treine seu pet {amount} vezes',
                    type: 'pet_training',
                    amount: 10,
                    rewards: {
                        money: 1000,
                        xp: 500
                    },
                    chance: 0.4
                },
                'evoluir_pet': {
                    name: 'Evolução Pet',
                    description: 'Evolua {amount} pets',
                    type: 'pet_evolution',
                    amount: 1,
                    rewards: {
                        money: 5000,
                        xp: 2000
                    },
                    chance: 0.1
                }
            },

            // Missões Semanais
            'weekly': {
                // Missões de Território
                'dominar_territorio': {
                    name: 'Conquistador',
                    description: 'Conquiste {amount} territórios',
                    type: 'territory',
                    amount: 5,
                    rewards: {
                        money: 10000,
                        xp: 5000,
                        items: ['amuleto_poder']
                    },
                    chance: 0.3
                },
                'defender_territorio': {
                    name: 'Defensor',
                    description: 'Defenda territórios {amount} vezes',
                    type: 'territory_defense',
                    amount: 10,
                    rewards: {
                        money: 15000,
                        xp: 6000,
                        items: ['escudo_lendario']
                    },
                    chance: 0.3
                },

                // Missões de Dungeon
                'vencer_raids': {
                    name: 'Caçador de Raids',
                    description: 'Vença {amount} raids',
                    type: 'raid',
                    amount: 10,
                    rewards: {
                        money: 20000,
                        xp: 8000,
                        items: ['arma_rara']
                    },
                    chance: 0.3
                },
                'derrotar_boss': {
                    name: 'Matador de Chefes',
                    description: 'Derrote {amount} chefes',
                    type: 'boss',
                    amount: 3,
                    rewards: {
                        money: 30000,
                        xp: 10000,
                        items: ['armadura_boss']
                    },
                    chance: 0.2
                },

                // Missões de Facção
                'guerra_faccao': {
                    name: 'Guerreiro de Facção',
                    description: 'Vença {amount} batalhas de facção',
                    type: 'faction_war',
                    amount: 20,
                    rewards: {
                        money: 25000,
                        xp: 9000,
                        faction_points: 1000
                    },
                    chance: 0.3
                },
                'missoes_faccao': {
                    name: 'Agente de Facção',
                    description: 'Complete {amount} missões de facção',
                    type: 'faction_quest',
                    amount: 15,
                    rewards: {
                        money: 20000,
                        xp: 7000,
                        faction_points: 800
                    },
                    chance: 0.3
                }
            },

            // História Principal
            'story': {
                // Capítulo 1: O Despertar
                'chapter1': {
                    name: 'Capítulo 1: O Despertar',
                    description: 'Seus primeiros passos no mundo',
                    tasks: [
                        {
                            description: 'Registre-se no RPG',
                            type: 'register',
                            amount: 1
                        },
                        {
                            description: 'Escolha uma classe',
                            type: 'select_class',
                            amount: 1
                        },
                        {
                            description: 'Complete 5 missões diárias',
                            type: 'daily_quest',
                            amount: 5
                        }
                    ],
                    rewards: {
                        money: 5000,
                        xp: 2000,
                        items: ['kit_iniciante']
                    }
                },

                // Capítulo 2: Treinamento
                'chapter2': {
                    name: 'Capítulo 2: Treinamento',
                    description: 'Aprimore suas habilidades',
                    tasks: [
                        {
                            description: 'Alcance nível 10',
                            type: 'level',
                            amount: 10
                        },
                        {
                            description: 'Aprenda 3 habilidades',
                            type: 'learn_skill',
                            amount: 3
                        },
                        {
                            description: 'Derrote 50 monstros',
                            type: 'kill_monster',
                            amount: 50
                        }
                    ],
                    rewards: {
                        money: 10000,
                        xp: 5000,
                        items: ['arma_rara', 'armadura_rara']
                    }
                },

                // Capítulo 3: Vida em Sociedade
                'chapter3': {
                    name: 'Capítulo 3: Vida em Sociedade',
                    description: 'Integre-se à comunidade',
                    tasks: [
                        {
                            description: 'Entre em uma gangue',
                            type: 'join_gang',
                            amount: 1
                        },
                        {
                            description: 'Complete 10 trabalhos',
                            type: 'work',
                            amount: 10
                        },
                        {
                            description: 'Faça 5 amigos',
                            type: 'make_friend',
                            amount: 5
                        }
                    ],
                    rewards: {
                        money: 15000,
                        xp: 7000,
                        items: ['titulo_social']
                    }
                },

                // Capítulo 4: Recursos e Crafting
                'chapter4': {
                    name: 'Capítulo 4: Recursos e Crafting',
                    description: 'Aprenda a coletar e criar',
                    tasks: [
                        {
                            description: 'Minere 100 recursos',
                            type: 'mine',
                            amount: 100
                        },
                        {
                            description: 'Pesque 50 peixes',
                            type: 'fish',
                            amount: 50
                        },
                        {
                            description: 'Crie 20 itens',
                            type: 'craft',
                            amount: 20
                        }
                    ],
                    rewards: {
                        money: 20000,
                        xp: 8000,
                        items: ['kit_crafting']
                    }
                },

                // Capítulo 5: Agricultura e Culinária
                'chapter5': {
                    name: 'Capítulo 5: Agricultura e Culinária',
                    description: 'Torne-se um mestre da fazenda',
                    tasks: [
                        {
                            description: 'Plante 50 cultivos',
                            type: 'plant',
                            amount: 50
                        },
                        {
                            description: 'Prepare 30 refeições',
                            type: 'cook',
                            amount: 30
                        },
                        {
                            description: 'Venda 1000 de produtos',
                            type: 'sell_products',
                            amount: 1000
                        }
                    ],
                    rewards: {
                        money: 25000,
                        xp: 9000,
                        items: ['kit_fazenda']
                    }
                },

                // Capítulo 6: Exploração
                'chapter6': {
                    name: 'Capítulo 6: Exploração',
                    description: 'Explore o mundo perigoso',
                    tasks: [
                        {
                            description: 'Complete 5 dungeons',
                            type: 'dungeon',
                            amount: 5
                        },
                        {
                            description: 'Derrote 3 chefes',
                            type: 'boss',
                            amount: 3
                        },
                        {
                            description: 'Encontre 10 tesouros',
                            type: 'treasure',
                            amount: 10
                        }
                    ],
                    rewards: {
                        money: 30000,
                        xp: 10000,
                        items: ['mapa_tesouros']
                    }
                },

                // Capítulo 7: Guerra de Facções
                'chapter7': {
                    name: 'Capítulo 7: Guerra de Facções',
                    description: 'Entre na guerra das facções',
                    tasks: [
                        {
                            description: 'Entre em uma facção',
                            type: 'join_faction',
                            amount: 1
                        },
                        {
                            description: 'Vença 20 batalhas de facção',
                            type: 'faction_battle',
                            amount: 20
                        },
                        {
                            description: 'Conquiste 3 territórios',
                            type: 'conquer',
                            amount: 3
                        }
                    ],
                    rewards: {
                        money: 40000,
                        xp: 15000,
                        items: ['bandeira_faccao']
                    }
                },

                // Capítulo 8: Ascensão
                'chapter8': {
                    name: 'Capítulo 8: Ascensão',
                    description: 'Alcance o poder máximo',
                    tasks: [
                        {
                            description: 'Alcance nível 50',
                            type: 'level',
                            amount: 50
                        },
                        {
                            description: 'Evolua sua classe',
                            type: 'evolve_class',
                            amount: 1
                        },
                        {
                            description: 'Derrote o boss final',
                            type: 'final_boss',
                            amount: 1
                        }
                    ],
                    rewards: {
                        money: 100000,
                        xp: 50000,
                        items: ['titulo_lendario', 'arma_mitica', 'armadura_mitica']
                    }
                }
            }
        };
    }

    // ... resto dos métodos do sistema de quests ...
}

module.exports = new QuestSystem();
