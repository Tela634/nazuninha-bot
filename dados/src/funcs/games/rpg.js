/*
 SISTEMA DE RPG - V2
 CRIADOR ORIGINAL: HIUDY
 FORJADO NA ETERNIDADE POR: Cognima Team
 
 RPG definitivo com um universo infinito, sistemas interligados e glória eterna.
*/

// IMPORTAÇÕES
const path = require('path');
const fs = require('fs').promises;

// DIRETÓRIO DO RPG
const RpgPath = path.join(__dirname, '/../../../database/rpg');
fs.mkdir(RpgPath, { recursive: true }).catch(console.error);

// UTILITÁRIOS
function normalizarTexto(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function chance(probabilidade) {
    return Math.random() < probabilidade;
}

// SISTEMAS GLOBAIS
let delays = {};
let eventosGlobais = {};
let mercadoNegro = {};
let guerrasAtivas = {};
let climaAtual = 'sol';
let horaAtual = new Date().getHours();
let mundo = { reinos: {}, portais: {}, cataclismas: 0 };

// MOEDAS
const MOEDAS = {
    dinheiro: '💰',
    gemas: '💎',
    prestigio: '⭐',
    almas: '👻',
    essencia: '✨',
    fragmentos: '🪙',
    reliquias: '🏺',
    ether: '🌌',
    runas: '🔮'
};

// CLIMA E CICLO DIA/NOITE
const CLIMAS = ['sol', 'chuva', 'neve', 'tempestade', 'nevoa', 'calor extremo', 'eclipse', 'aurora magica', 'trevas eternas', 'chuva de meteoros', 'ventos etereos', 'vortex dimensional'];
setInterval(() => {
    climaAtual = CLIMAS[Math.floor(Math.random() * CLIMAS.length)];
    console.log(`🌍 O clima mudou para: ${climaAtual}`);
    if (climaAtual === 'vortex dimensional' && chance(0.1)) mundo.cataclismas++;
}, 1000 * 60 * 8); // Muda a cada 8 minutos

setInterval(() => {
    horaAtual = new Date().getHours();
}, 1000 * 60);

// EMPREGOS EXPANDIDOS
const empregos = [
    { nome: 'lixeiro', salarioMin: 50, salarioMax: 250, xpNecessaria: 0, habilidades: { 'limpeza rapida': { nivel: 1, efeito: '+20% dinheiro' }, 'reciclagem eterea': { nivel: 20, efeito: '+20 ether' } }, delay: 120 },
    { nome: 'ferreiro', salarioMin: 300, salarioMax: 1000, xpNecessaria: 50, habilidades: { 'forja basica': { nivel: 1, efeito: 'Cria armas simples' }, 'metal divino': { nivel: 30, efeito: '+100% dano armas' } }, delay: 180 },
    { nome: 'mago', salarioMin: 700, salarioMax: 2500, xpNecessaria: 200, habilidades: { 'magia elemental': { nivel: 1, efeito: 'Feitiços básicos' }, 'arcano infinito': { nivel: 35, efeito: 'Feitiços +150% dano' } }, delay: 300 },
    { nome: 'cacador de recompensas', salarioMin: 800, salarioMax: 3000, xpNecessaria: 300, habilidades: { 'rastreio': { nivel: 1, efeito: '+25% chance sucesso' }, 'corte eterno': { nivel: 30, efeito: '+250% dano critico' } }, delay: 240 },
    { nome: 'alquimista', salarioMin: 600, salarioMax: 2000, xpNecessaria: 150, habilidades: { 'pocoes basicas': { nivel: 1, efeito: 'Cria poções simples' }, 'elixir transcendente': { nivel: 25, efeito: 'Poções +200% efeito' } }, delay: 200 },
    { nome: 'mercador', salarioMin: 500, salarioMax: 1500, xpNecessaria: 100, habilidades: { 'negociacao': { nivel: 1, efeito: '+25% lucro vendas' }, 'rotas do ether': { nivel: 25, efeito: 'Acesso mercado negro +50% lucro' } }, delay: 150 },
    { nome: 'guardiao', salarioMin: 900, salarioMax: 2500, xpNecessaria: 400, habilidades: { 'defesa basica': { nivel: 1, efeito: '+20 defesa' }, 'escudo eterno': { nivel: 30, efeito: '+100 defesa em combate' } }, delay: 300 },
    { nome: 'explorador', salarioMin: 650, salarioMax: 1800, xpNecessaria: 250, habilidades: { 'mapa mental': { nivel: 1, efeito: '+20% chance achados' }, 'caminho do vazio': { nivel: 25, efeito: '+100% recompensas masmorras' } }, delay: 240 },
    { nome: 'bardo', salarioMin: 550, salarioMax: 1600, xpNecessaria: 120, habilidades: { 'cancao inspiradora': { nivel: 1, efeito: '+15% XP todos' }, 'hino da eternidade': { nivel: 25, efeito: '+50% XP todos' } }, delay: 180 },
    { nome: 'necromante', salarioMin: 1000, salarioMax: 3500, xpNecessaria: 500, habilidades: { 'invocacao basica': { nivel: 1, efeito: 'Invoca 1 esqueleto' }, 'exercito das trevas': { nivel: 35, efeito: 'Invoca 10 esqueletos +75% dano' } }, delay: 360 },
    { nome: 'engenheiro', salarioMin: 700, salarioMax: 2000, xpNecessaria: 300, habilidades: { 'maquinas basicas': { nivel: 1, efeito: 'Cria armadilhas simples' }, 'tecnologia arcana': { nivel: 30, efeito: 'Armadilhas +150% dano' } }, delay: 240 },
    { nome: 'ladrao', salarioMin: 600, salarioMax: 2500, xpNecessaria: 200, habilidades: { 'furtividade': { nivel: 1, efeito: '+30% chance assalto' }, 'mestre do caos': { nivel: 25, efeito: '+150% chance assalto' } }, delay: 200 },
    { nome: 'sacerdote', salarioMin: 800, salarioMax: 2200, xpNecessaria: 350, habilidades: { 'oracao basica': { nivel: 1, efeito: '+10 favor divino' }, 'milagre divino': { nivel: 30, efeito: '+50 favor divino' } }, delay: 300 },
    { nome: 'arqueiro', salarioMin: 650, salarioMax: 1900, xpNecessaria: 250, habilidades: { 'tiro preciso': { nivel: 1, efeito: '+20% dano critico' }, 'chuva de flechas': { nivel: 25, efeito: '+100% dano em área' } }, delay: 240 },
    { nome: 'cavaleiro', salarioMin: 900, salarioMax: 2700, xpNecessaria: 400, habilidades: { 'carga basica': { nivel: 1, efeito: '+25 ataque' }, 'lanca da ordem': { nivel: 30, efeito: '+100 ataque em combate' } }, delay: 300 },
];

// ITENS DA LOJA E MERCADO NEGRO
const itensLoja = [
    { nome: 'espada de ferro', valor: 1200, venda: 500, tipo: 'arma', atributos: { ataque: 25 } },
    { nome: 'potion de vida', valor: 400, venda: 150, tipo: 'consumivel', efeito: 'Recupera 75 vida' },
    { nome: 'grimorio basico', valor: 2500, venda: 1000, tipo: 'magia', atributos: { inteligencia: 15 } },
    { nome: 'armadura de couro', valor: 1800, venda: 700, tipo: 'armadura', atributos: { defesa: 20 } },
    { nome: 'anel de agilidade', valor: 3000, venda: 1200, tipo: 'acessorio', atributos: { agilidade: 15 } },
    { nome: 'cajado elemental', valor: 3500, venda: 1400, tipo: 'arma', atributos: { ataque: 20, inteligencia: 20 } },
    { nome: 'lanterna mistica', valor: 4500, venda: 1800, tipo: 'acessorio', atributos: { sorte: 20 } },
    { nome: 'arco simples', valor: 2000, venda: 800, tipo: 'arma', atributos: { ataque: 30 } },
    { nome: 'escudo de madeira', valor: 1500, venda: 600, tipo: 'armadura', atributos: { defesa: 15 } },
];

const itensMercadoNegro = [
    { nome: 'adaga das sombras', valor: 12000, almas: 30, tipo: 'arma', atributos: { ataque: 90, veneno: 25 } },
    { nome: 'elixir proibido', valor: 18000, almas: 50, tipo: 'consumivel', efeito: 'Dobra atributos por 4h' },
    { nome: 'manto do vazio', valor: 30000, almas: 60, tipo: 'armadura', atributos: { defesa: 80, agilidade: 35 } },
    { nome: 'orbe das almas', valor: 25000, almas: 75, tipo: 'acessorio', atributos: { inteligencia: 50, almasPorInimigo: 3 } },
    { nome: 'reliquia do caos', valor: 40000, reliquias: 15, tipo: 'acessorio', atributos: { forca: 60, sorte: 25 } },
    { nome: 'grimorio proibido', valor: 35000, ether: 20, tipo: 'magia', atributos: { inteligencia: 70 } },
    { nome: 'espada eterea', valor: 50000, runas: 10, tipo: 'arma', atributos: { ataque: 120 } },
];

// INIMIGOS EXPANDIDOS
const inimigos = {
    'goblin': { vida: 75, ataque: 15, defesa: 10, recompensa: { dinheiro: 75, xp: 25 } },
    'ogro': { vida: 300, ataque: 40, defesa: 25, recompensa: { dinheiro: 300, xp: 120 } },
    'dragao': { vida: 2500, ataque: 120, defesa: 80, recompensa: { dinheiro: 4000, gemas: 30, xp: 1000 } },
    'lich': { vida: 1500, ataque: 100, defesa: 70, recompensa: { dinheiro: 2000, almas: 20, xp: 750 } },
    'hidra': { vida: 3000, ataque: 90, defesa: 60, recompensa: { dinheiro: 4500, essencia: 15, xp: 1200 } },
    'espirito amaldicoado': { vida: 1200, ataque: 80, defesa: 40, recompensa: { almas: 20, xp: 500 } },
    'golem de pedra': { vida: 1800, ataque: 70, defesa: 100, recompensa: { dinheiro: 2500, fragmentos: 10, xp: 800 } },
    'sereia assassina': { vida: 1400, ataque: 85, defesa: 45, recompensa: { gemas: 25, xp: 550 } },
    'tita ancestral': { vida: 5000, ataque: 140, defesa: 90, recompensa: { dinheiro: 10000, essencia: 20, xp: 2500 } },
    'fenix das cinzas': { vida: 2200, ataque: 110, defesa: 65, recompensa: { dinheiro: 3500, reliquias: 7, xp: 1100 } },
    'cavaleiro negro': { vida: 2600, ataque: 95, defesa: 75, recompensa: { dinheiro: 4000, fragmentos: 15, xp: 950 } },
    'devorador de mundos': { vida: 7000, ataque: 180, defesa: 120, recompensa: { dinheiro: 15000, essencia: 30, reliquias: 15, xp: 4000 } },
    'espectro do vazio': { vida: 1600, ataque: 90, defesa: 50, recompensa: { almas: 25, xp: 600 } },
    'guardião celestial': { vida: 3500, ataque: 130, defesa: 85, recompensa: { dinheiro: 6000, ether: 10, xp: 1500 } },
    'abominação eterea': { vida: 4000, ataque: 150, defesa: 70, recompensa: { dinheiro: 8000, runas: 5, xp: 2000 } },
    'senhor das runas': { vida: 6000, ataque: 160, defesa: 100, recompensa: { dinheiro: 12000, runas: 10, reliquias: 10, xp: 3500 } },
    'kraken abissal': { vida: 4500, ataque: 140, defesa: 80, recompensa: { dinheiro: 7000, essencia: 25, xp: 1800 } },
};

// MASMORRAS EXPANDIDAS
const masmorras = {
    'caverna sombria': { nivelMin: 5, inimigos: ['goblin', 'ogro'], recompensa: { gemas: 50, itens: ['espada de ferro'] } },
    'templo perdido': { nivelMin: 15, inimigos: ['dragao', 'lich'], recompensa: { almas: 30, itens: ['grimorio basico'] } },
    'abismo infernal': { nivelMin: 25, inimigos: ['hidra', 'espirito amaldicoado'], recompensa: { essencia: 25, itens: ['manto do vazio'] } },
    'fortaleza de pedra': { nivelMin: 20, inimigos: ['golem de pedra', 'sereia assassina'], recompensa: { fragmentos: 20, itens: ['armadura de couro'] } },
    'ruinas titanicas': { nivelMin: 35, inimigos: ['tita ancestral', 'lich'], recompensa: { dinheiro: 20000, essencia: 30, itens: ['orbe das almas'] } },
    'ninho da fenix': { nivelMin: 30, inimigos: ['fenix das cinzas', 'cavaleiro negro'], recompensa: { reliquias: 15, itens: ['lanterna mistica'] } },
    'abismo do devorador': { nivelMin: 50, inimigos: ['devorador de mundos', 'espectro do vazio'], recompensa: { dinheiro: 25000, essencia: 40, reliquias: 20, itens: ['reliquia do caos'] } },
    'santuário celestial': { nivelMin: 40, inimigos: ['guardião celestial', 'abominação eterea'], recompensa: { ether: 15, itens: ['cajado elemental'] } },
    'coração rúnico': { nivelMin: 60, inimigos: ['senhor das runas', 'kraken abissal'], recompensa: { dinheiro: 30000, runas: 15, reliquias: 25, itens: ['espada eterea'] } },
};

// CONQUISTAS EXPANDIDAS
const conquistas = {
    'matador de goblins': { requisito: { 'goblin': 20 }, recompensa: { dinheiro: 1500, titulos: 'matador de goblins' }, bonus: { forca: 15 } },
    'caca dragoes': { requisito: { 'dragao': 15 }, recompensa: { gemas: 100, titulos: 'caca dragoes' }, bonus: { ataque: 30 } },
    'mestre das masmorras': { requisito: { masmorras: 20 }, recompensa: { essencia: 30, titulos: 'mestre das masmorras' }, bonus: { vitalidade: 25 } },
    'alquimista supremo': { requisito: { craft: 50 }, recompensa: { fragmentos: 25, titulos: 'alquimista supremo' }, bonus: { inteligencia: 20 } },
    'lenda viva': { requisito: { nivel: 100 }, recompensa: { prestigio: 200, titulos: 'lenda viva' }, bonus: { todos: 20 } },
    'destruidor de titas': { requisito: { 'tita ancestral': 10 }, recompensa: { reliquias: 15, titulos: 'destruidor de titas' }, bonus: { forca: 25, defesa: 15 } },
    'senhor das sombras': { requisito: { 'espectro do vazio': 30 }, recompensa: { almas: 75, titulos: 'senhor das sombras' }, bonus: { sorte: 20 } },
    'conquistador do caos': { requisito: { 'devorador de mundos': 3 }, recompensa: { dinheiro: 75000, essencia: 75, titulos: 'conquistador do caos' }, bonus: { todos: 30 } },
    'guardião do ether': { requisito: { 'guardião celestial': 10 }, recompensa: { ether: 20, titulos: 'guardião do ether' }, bonus: { inteligencia: 25 } },
    'mestre das runas': { requisito: { 'senhor das runas': 5 }, recompensa: { runas: 15, titulos: 'mestre das runas' }, bonus: { todos: 25 } },
    'vencedor de guerras': { requisito: { guerras: 5 }, recompensa: { prestigio: 150, titulos: 'vencedor de guerras' }, bonus: { carisma: 20 } },
};

// FUNÇÃO BASE DO USUÁRIO
async function getUser(sender) {
    const userPath = path.join(RpgPath, `${sender}.json`);
    if (await fs.access(userPath).then(() => true).catch(() => false)) {
        return JSON.parse(await fs.readFile(userPath, 'utf-8'));
    }
    return false;
}

async function saveUser(sender, dados) {
    const userPath = path.join(RpgPath, `${sender}.json`);
    await fs.writeFile(userPath, JSON.stringify(dados, null, '\t'));
    return true;
}

// REGISTRO INICIAL
async function registrar(sender, nome) {
    const dados = {
        id: sender,
        nome,
        nivel: 1,
        experiencia: 0,
        atributos: { forca: 15, agilidade: 15, inteligencia: 15, vitalidade: 20, sorte: 15, carisma: 10, resistencia: 10 },
        moedas: { dinheiro: 1500, gemas: 25, prestigio: 0, almas: 0, essencia: 0, fragmentos: 0, reliquias: 0, ether: 0, runas: 0 },
        saldo: { banco: 0, carteira: 1500 },
        inventario: { 'potion de vida': 15 },
        emprego: 'desempregado',
        habilidades: {},
        propriedades: [],
        guilda: null,
        pet: null,
        magia: { nivel: 0, mana: 250, feitiços: [] },
        reputacao: 0,
        equipamento: { arma: null, armadura: null, acessorio: null, anel: null },
        missões: [],
        facção: null,
        titulos: [],
        conquistas: { inimigosMortos: {}, masmorrasCompletadas: 0, itensCraftados: 0, guerrasVencidas: 0, caravanasCompletadas: 0, portaisExplorados: 0, reinosFundados: 0 },
        batalhas: { vitorias: {}, derrotas: 0 },
        religiao: { deus: null, favor: 0 },
        caravana: null,
        arena: { vitorias: 0, derrotas: 0 },
        reino: null,
        portal: null,
        forja: { nivel: 1, bonus: 0 },
        alquimia: { nivel: 1, bonus: 0 },
    };
    await saveUser(sender, dados);
    return `🌌 *Bem-vindo à Eternidade Forjada, ${nome}!* 🌌\nSua saga começa com 1500 ${MOEDAS.dinheiro}, 25 ${MOEDAS.gemas} e 15 poções de vida. O cosmos inteiro é seu para conquistar!`;
}

// SISTEMA DE NÍVEL E ATRIBUTOS
async function ganharXP(sender, quantidade) {
    const user = await getUser(sender);
    user.experiencia += quantidade;
    const xpNecessario = user.nivel * 400 + Math.pow(user.nivel, 2) * 200;
    if (user.experiencia >= xpNecessario) {
        user.nivel++;
        user.experiencia -= xpNecessario;
        user.atributos.forca += 6;
        user.atributos.agilidade += 6;
        user.atributos.inteligencia += 6;
        user.atributos.vitalidade += 15;
        user.atributos.sorte += 5;
        user.atributos.carisma += 4;
        user.atributos.resistencia += 5;
        user.magia.mana += 100;
        await verificarConquistas(sender);
        await saveUser(sender, user);
        return `🌠 *Ascensão Cósmica!* ${user.nome}, você alcançou o nível ${user.nivel}! Seu nome ecoa pelas eras infinitas!`;
    }
    await saveUser(sender, user);
    return `⚡ *Poder Conquistado!* Você ganhou ${quantidade} XP! Progresso: ${user.experiencia}/${xpNecessario}.`;
}

async function distribuirPontos(sender, atributo, pontos) {
    const user = await getUser(sender);
    const attrs = ['forca', 'agilidade', 'inteligencia', 'vitalidade', 'sorte', 'carisma', 'resistencia'];
    if (!attrs.includes(atributo)) return '⚠️ Atributo inválido. Escolha: força, agilidade, inteligência, vitalidade, sorte, carisma, resistência.';
    if (pontos > user.nivel - Object.values(user.atributos).reduce((a, b) => a + b, 0) + 50) return '⚠️ Pontos insuficientes!';
    user.atributos[atributo] += pontos;
    await saveUser(sender, user);
    return `✅ *Poder Forjado!* Você investiu ${pontos} pontos em ${atributo}. Novo valor: ${user.atributos[atributo]}.`;
}

// SISTEMA DE COMBATE
async function batalhar(sender, inimigoNome) {
    const user = await getUser(sender);
    const inimigo = inimigos[inimigoNome];
    if (!inimigo) return '⚠️ Essa entidade não existe nas crônicas eternas!';
    
    let vidaJogador = user.atributos.vitalidade * 25 + user.atributos.resistencia * 10;
    let ataqueJogador = user.atributos.forca + (user.equipamento.arma?.atributos?.ataque || 0) + (user.atributos.sorte * 1);
    let defesaJogador = user.atributos.agilidade + (user.equipamento.armadura?.atributos?.defesa || 0) + user.atributos.resistencia * 0.5;
    
    let log = `⚔️ *Confronto Eterno contra ${inimigoNome}!* ⚔️\n`;
    while (vidaJogador > 0 && inimigo.vida > 0) {
        const critico = chance(user.atributos.sorte / 100);
        const danoJogador = Math.max(0, ataqueJogador - inimigo.defesa) + (critico ? ataqueJogador * 1 : 0);
        inimigo.vida -= danoJogador;
        log += `🗡️ Você ataca com fúria cósmica${critico ? ' (CRÍTICO DIVINO!)' : ''}, causando ${danoJogador} de dano! Vida do ${inimigoNome}: ${inimigo.vida <= 0 ? 'Obliterado' : inimigo.vida}\n`;
        
        if (inimigo.vida > 0) {
            const danoInimigo = Math.max(0, inimigo.ataque - defesaJogador);
            vidaJogador -= danoInimigo;
            log += `💥 O ${inimigoNome} responde com poder ancestral, causando ${danoInimigo} de dano! Sua vida: ${vidaJogador <= 0 ? 'Aniquilado' : vidaJogador}\n`;
        }
    }
    
    if (vidaJogador > 0) {
        Object.entries(inimigo.recompensa).forEach(([moeda, valor]) => user.moedas[moeda] += valor);
        user.batalhas.vitorias[inimigoNome] = (user.batalhas.vitorias[inimigoNome] || 0) + 1;
        user.conquistas.inimigosMortos[inimigoNome] = (user.conquistas.inimigosMortos[inimigoNome] || 0) + 1;
        await ganharXP(sender, inimigo.recompensa.xp);
        await verificarConquistas(sender);
        await saveUser(sender, user);
        return `${log}🏆 *Triunfo Imortal!* Você destruiu o ${inimigoNome}! Recompensas: ${Object.entries(inimigo.recompensa).map(([k, v]) => `${v} ${MOEDAS[k]}`).join(', ')}.`;
    }
    user.batalhas.derrotas++;
    await saveUser(sender, user);
    return `${log}☠️ *Queda nas Eras!* O ${inimigoNome} apagou sua luz. Retorne com a chama da vingança!`;
}

// SISTEMA DE MASMORRAS
async function explorarMasmorra(sender, masmorraNome) {
    const user = await getUser(sender);
    const masmorra = masmorras[masmorraNome];
    if (!masmorra) return '⚠️ Esse abismo não foi registrado nas eras!';
    if (user.nivel < masmorra.nivelMin) return `⚠️ Apenas lendas de nível ${masmorra.nivelMin} podem desafiar este domínio!`;
    
    let log = `🏰 *Expedição à ${masmorraNome}!* 🏰\n`;
    for (let inimigo of masmorra.inimigos) {
        const resultado = await batalhar(sender, inimigo);
        log += resultado + '\n';
        if (resultado.includes('Queda')) return log;
    }
    
    Object.entries(masmorra.recompensa).forEach(([moeda, valor]) => {
        if (moeda !== 'itens') user.moedas[moeda] += valor * (1 + user.atributos.sorte * 0.01);
    });
    masmorra.recompensa.itens.forEach(item => user.inventario[item] = (user.inventario[item] || 0) + 1);
    user.conquistas.masmorrasCompletadas++;
    await verificarConquistas(sender);
    await saveUser(sender, user);
    return `${log}🌟 *Conquista das Profundezas!* Você dominou a ${masmorraNome}! Recompensas: ${Object.entries(masmorra.recompensa).map(([k, v]) => k === 'itens' ? v.join(', ') : `${v} ${MOEDAS[k]}`).join(', ')}.`;
}

// SISTEMA DE CRAFTING
const receitas = {
    'espada longa': { materiais: { ferro: 6, madeira: 3 }, resultado: { nome: 'espada longa', atributos: { ataque: 70 } }, tipo: 'arma' },
    'potion maior': { materiais: { ervas: 4, agua: 2 }, resultado: { nome: 'potion maior', efeito: 'Recupera 300 vida' }, tipo: 'consumivel' },
    'cajado arcano': { materiais: { madeira: 12, cristal: 6 }, resultado: { nome: 'cajado arcano', atributos: { inteligencia: 35 } }, tipo: 'arma' },
    'armadura de escamas': { materiais: { couro: 12, ferro: 8 }, resultado: { nome: 'armadura de escamas', atributos: { defesa: 60 } }, tipo: 'armadura' },
    'reliquia da luz': { materiais: { essencia: 15, reliquias: 7 }, resultado: { nome: 'reliquia da luz', atributos: { vitalidade: 25, sorte: 20 } }, tipo: 'acessorio' },
    'anel do ether': { materiais: { ether: 10, gemas: 5 }, resultado: { nome: 'anel do ether', atributos: { resistencia: 20, inteligencia: 15 } }, tipo: 'anel' },
};

async function craftar(sender, receitaNome) {
    const user = await getUser(sender);
    const receita = receitas[receitaNome];
    if (!receita) return '⚠️ Essa receita não foi escrita nos tomos eternos!';
    
    for (let [item, qtd] of Object.entries(receita.materiais)) {
        if ((user.inventario[item] || 0) < qtd) return `⚠️ Faltam ${qtd - (user.inventario[item] || 0)} ${item} para essa criação!`;
    }
    
    for (let [item, qtd] of Object.entries(receita.materiais)) {
        user.inventario[item] -= qtd;
        if (user.inventario[item] === 0) delete user.inventario[item];
    }
    const bonusForja = user.forja.bonus * 0.05;
    user.inventario[receita.resultado.nome] = (user.inventario[receita.resultado.nome] || 0) + 1;
    user.conquistas.itensCraftados++;
    await verificarConquistas(sender);
    await saveUser(sender, user);
    return `🔨 *Obra Eterna Forjada!* Você criou ${receita.resultado.nome} com ${bonusForja * 100}% de bônus da forja!`;
}

// SISTEMA DE FORJA E ALQUIMIA
async function melhorarForja(sender) {
    const user = await getUser(sender);
    if (user.moedas.fragmentos < user.forja.nivel * 50) return `⚠️ Faltam ${user.forja.nivel * 50 - user.moedas.fragmentos} ${MOEDAS.fragmentos} para aprimorar a forja!`;
    
    user.moedas.fragmentos -= user.forja.nivel * 50;
    user.forja.nivel++;
    user.forja.bonus += 5;
    await saveUser(sender, user);
    return `🔧 *Forja Aprimorada!* Nível ${user.forja.nivel} - Bônus de criação: +${user.forja.bonus}%.`;
}

async function melhorarAlquimia(sender) {
    const user = await getUser(sender);
    if (user.moedas.essencia < user.alquimia.nivel * 30) return `⚠️ Faltam ${user.alquimia.nivel * 30 - user.moedas.essencia} ${MOEDAS.essencia} para aprimorar a alquimia!`;
    
    user.moedas.essencia -= user.alquimia.nivel * 30;
    user.alquimia.nivel++;
    user.alquimia.bonus += 5;
    await saveUser(sender, user);
    return `⚗️ *Alquimia Elevada!* Nível ${user.alquimia.nivel} - Bônus de poções: +${user.alquimia.bonus}%.`;
}

// SISTEMA DE PROPRIEDADES
const propriedades = {
    'casa': { custo: 8000, producao: { dinheiro: 100 }, delay: 24 * 60 * 60, upgrades: { 'jardim': 3000, 'torre': 6000, 'fontes': 10000, 'sala do trono': 15000 } },
    'fazenda': { custo: 20000, producao: { comida: 25 }, delay: 12 * 60 * 60, upgrades: { 'celeiro': 8000, 'irrigacao': 12000, 'trator': 16000, 'moinho': 20000 } },
    'castelo': { custo: 100000, producao: { prestigio: 25 }, delay: 48 * 60 * 60, upgrades: { 'muralha': 40000, 'salao': 50000, 'torre de mago': 60000, 'cripta': 80000 } },
    'torre arcana': { custo: 150000, producao: { essencia: 20 }, delay: 72 * 60 * 60, upgrades: { 'cristal': 70000, 'biblioteca': 90000, 'observatorio': 120000 } },
    'santuário': { custo: 120000, producao: { ether: 15 }, delay: 96 * 60 * 60, upgrades: { 'altar': 60000, 'jardins sagrados': 80000 } },
};

// SISTEMA DE GUILDAS
async function criarGuilda(sender, nome) {
    const user = await getUser(sender);
    if (user.guilda) return '⚠️ Você já é parte de uma aliança!';
    if (user.moedas.gemas < 300 || user.atributos.carisma < 20) return `⚠️ São necessárias 300 ${MOEDAS.gemas} e 20 de carisma para fundar uma guilda!`;
    
    user.moedas.gemas -= 300;
    user.guilda = { nome, lider: sender, membros: [sender], nivel: 1, recursos: { ouro: 0, madeira: 0, pedra: 0, reliquias: 0, runas: 0 }, missões: [], fortaleza: { nivel: 1, defesas: 15, torres: 0 } };
    await saveUser(sender, user);
    return `⚜️ *Guilda ${nome} Erguida!* Você é o soberano supremo desta irmandade eterna!`;
}

async function guildaMissão(sender, tipo) {
    const user = await getUser(sender);
    if (!user.guilda) return '⚠️ Você não pertence a uma guilda!';
    const missões = {
        'caca ao dragao': { custo: { ouro: 5000 }, recompensa: { prestigio: 150, gemas: 75 }, dificuldade: 25 },
        'defesa da fortaleza': { custo: { pedra: 3000 }, recompensa: { dinheiro: 12000, fragmentos: 30 }, dificuldade: 20 },
        'busca por reliquias': { custo: { madeira: 2000 }, recompensa: { reliquias: 15, essencia: 20 }, dificuldade: 30 },
        'ritual etereo': { custo: { runas: 10 }, recompensa: { ether: 20, runas: 5 }, dificuldade: 35 },
    };
    const missão = missões[tipo];
    if (!missão) return '⚠️ Missão desconhecida!';
    for (let [recurso, qtd] of Object.entries(missão.custo)) {
        if (user.guilda.recursos[recurso] < qtd) return `⚠️ Faltam ${qtd - user.guilda.recursos[recurso]} ${recurso}!`;
    }
    
    Object.entries(missão.custo).forEach(([recurso, qtd]) => user.guilda.recursos[recurso] -= qtd);
    const sucesso = chance((user.guilda.nivel + user.guilda.fortaleza.nivel) / missão.dificuldade);
    if (sucesso) {
        Object.entries(missão.recompensa).forEach(([moeda, valor]) => user.guilda.recursos[moeda] = (user.guilda.recursos[moeda] || 0) + valor);
        user.guilda.nivel++;
        return `🌟 *Triunfo da Guilda!* "${tipo}" concluído! Recompensas: ${Object.entries(missão.recompensa).map(([k, v]) => `${v} ${MOEDAS[k]}`).join(', ')}. Guilda subiu para nível ${user.guilda.nivel}!`;
    }
    return '💥 *Fracasso da Guilda!* A missão foi perdida nas sombras...';
}

// SISTEMA DE GUERRA ENTRE GUILDAS
async function declararGuerra(sender, guildaAlvoNome) {
    const user = await getUser(sender);
    const alvo = Object.values(await Promise.all(fs.readdir(RpgPath).map(f => getUser(f.split('.json')[0])))).find(u => u.guilda?.nome === guildaAlvoNome);
    if (!user.guilda || user.guilda.lider !== sender) return '⚠️ Apenas o líder pode clamar guerra!';
    if (!alvo || !alvo.guilda) return '⚠️ Essa guilda não existe nas eras!';
    if (guerrasAtivas[user.guilda.nome]) return '⚠️ Sua guilda já está em conflito!';
    
    guerrasAtivas[user.guilda.nome] = { inimigo: alvo.guilda.nome, inicio: Date.now() / 1000, fim: Date.now() / 1000 + 72 * 60 * 60, pontos: { [user.guilda.nome]: 0, [alvo.guilda.nome]: 0 } };
    return `⚔️ *Guerra Cósmica Declarada!* A ${user.guilda.nome} desafiou a ${alvo.guilda.nome}! 72 horas de caos se iniciam!`;
}

async function guerrear(sender, inimigoNome) {
    const user = await getUser(sender);
    if (!user.guilda || !guerrasAtivas[user.guilda.nome]) return '⚠️ Sua guilda não está em guerra!';
    const guerra = guerrasAtivas[user.guilda.nome];
    const resultado = await batalhar(sender, inimigoNome);
    if (resultado.includes('Triunfo')) {
        guerra.pontos[user.guilda.nome] += 15;
        return `${resultado}\n⚔️ *Glória para a ${user.guilda.nome}!* Pontos: ${guerra.pontos[user.guilda.nome]}.`;
    }
    guerra.pontos[guerra.inimigo] += 10;
    return `${resultado}\n⚔️ *Vantagem para a ${guerra.inimigo}!* Pontos: ${guerra.pontos[guerra.inimigo]}.`;
}

// SISTEMA DE ARENA PVP
async function desafiarArena(sender, alvo) {
    const user = await getUser(sender);
    const alvoUser = await getUser(alvo);
    if (!alvoUser) return '⚠️ Esse guerreiro não existe!';
    if (delays[sender]?.arena > Date.now()) return `⏳ Aguarde ${Math.ceil((delays[sender].arena - Date.now()) / 60000)} minutos para duelar novamente!`;
    
    let vidaUser = user.atributos.vitalidade * 25 + user.atributos.resistencia * 10;
    let ataqueUser = user.atributos.forca + (user.equipamento.arma?.atributos?.ataque || 0);
    let defesaUser = user.atributos.agilidade + (user.equipamento.armadura?.atributos?.defesa || 0);
    
    let vidaAlvo = alvoUser.atributos.vitalidade * 25 + alvoUser.atributos.resistencia * 10;
    let ataqueAlvo = alvoUser.atributos.forca + (alvoUser.equipamento.arma?.atributos?.ataque || 0);
    let defesaAlvo = alvoUser.atributos.agilidade + (alvoUser.equipamento.armadura?.atributos?.defesa || 0);
    
    let log = `⚔️ *Duelo na Arena Eterna: ${user.nome} vs ${alvoUser.nome}!* ⚔️\n`;
    while (vidaUser > 0 && vidaAlvo > 0) {
        const danoUser = Math.max(0, ataqueUser - defesaAlvo);
        vidaAlvo -= danoUser;
        log += `🗡️ ${user.nome} ataca, causando ${danoUser} de dano! Vida de ${alvoUser.nome}: ${vidaAlvo <= 0 ? 'Derrotado' : vidaAlvo}\n`;
        
        if (vidaAlvo > 0) {
            const danoAlvo = Math.max(0, ataqueAlvo - defesaUser);
            vidaUser -= danoAlvo;
            log += `🗡️ ${alvoUser.nome} revida, causando ${danoAlvo} de dano! Vida de ${user.nome}: ${vidaUser <= 0 ? 'Derrotado' : vidaUser}\n`;
        }
    }
    
    delays[sender] = delays[sender] || {};
    delays[sender].arena = Date.now() + 30 * 60 * 1000; // 30min cooldown
    if (vidaUser > 0) {
        user.arena.vitorias++;
        alvoUser.arena.derrotas++;
        user.moedas.dinheiro += 3000;
        user.moedas.prestigio += 10;
        await saveUser(sender, user);
        await saveUser(alvo, alvoUser);
        return `${log}🏆 *${user.nome} Reina Supremo!* Ganhou 3000 ${MOEDAS.dinheiro} e 10 ${MOEDAS.prestigio}!`;
    }
    user.arena.derrotas++;
    alvoUser.arena.vitorias++;
    alvoUser.moedas.dinheiro += 3000;
    alvoUser.moedas.prestigio += 10;
    await saveUser(sender, user);
    await saveUser(alvo, alvoUser);
    return `${log}🏆 *${alvoUser.nome} Reina Supremo!* Ganhou 3000 ${MOEDAS.dinheiro} e 10 ${MOEDAS.prestigio}!`;
}

// SISTEMA DE REINOS
async function fundarReino(sender, nome) {
    const user = await getUser(sender);
    if (user.reino) return '⚠️ Você já governa um reino!';
    if (user.moedas.prestigio < 500 || user.atributos.carisma < 50) return `⚠️ São necessários 500 ${MOEDAS.prestigio} e 50 de carisma para fundar um reino!`;
    
    user.moedas.prestigio -= 500;
    user.reino = { nome, lider: sender, nivel: 1, recursos: { ouro: 0, pedra: 0, madeira: 0, comida: 0 }, populacao: 100, defesas: 50 };
    user.conquistas.reinosFundados++;
    mundo.reinos[nome] = user.reino;
    await verificarConquistas(sender);
    await saveUser(sender, user);
    return `👑 *Reino ${nome} Fundado!* Você é o soberano deste novo império! População inicial: 100, Defesas: 50.`;
}

async function coletarImpostos(sender) {
    const user = await getUser(sender);
    if (!user.reino) return '⚠️ Você não governa um reino!';
    if (delays[sender]?.impostos > Date.now()) return `⏳ Aguarde ${Math.ceil((delays[sender].impostos - Date.now()) / 3600000)} horas para coletar novamente!`;
    
    const impostos = user.reino.populacao * 10 * (1 + user.atributos.carisma * 0.01);
    user.moedas.dinheiro += impostos;
    delays[sender] = delays[sender] || {};
    delays[sender].impostos = Date.now() + 24 * 60 * 60 * 1000; // 24h cooldown
    await saveUser(sender, user);
    return `💰 *Impostos Coletados!* Seu reino rendeu ${impostos} ${MOEDAS.dinheiro}!`;
}

async function melhorarReino(sender, upgrade) {
    const user = await getUser(sender);
    if (!user.reino) return '⚠️ Você não governa um reino!';
    const upgrades = {
        'muralhas': { custo: { pedra: 5000 }, bonus: { defesas: 50 } },
        'mercado': { custo: { ouro: 3000 }, bonus: { dinheiro: 200 } },
        'fazendas': { custo: { madeira: 4000 }, bonus: { populacao: 50 } },
    };
    const up = upgrades[upgrade];
    if (!up) return '⚠️ Upgrade inválido! Opções: muralhas, mercado, fazendas.';
    for (let [recurso, qtd] of Object.entries(up.custo)) {
        if (user.reino.recursos[recurso] < qtd) return `⚠️ Faltam ${qtd - user.reino.recursos[recurso]} ${recurso}!`;
    }
    
    Object.entries(up.custo).forEach(([recurso, qtd]) => user.reino.recursos[recurso] -= qtd);
    Object.entries(up.bonus).forEach(([key, val]) => user.reino[key] += val);
    user.reino.nivel++;
    await saveUser(sender, user);
    return `🏰 *Reino Aprimorado!* ${upgrade} adicionado! Nível ${user.reino.nivel}, ${Object.entries(up.bonus).map(([k, v]) => `${k} +${v}`).join(', ')}.`;
}

// SISTEMA DE PORTAIS
async function abrirPortal(sender, destino) {
    const user = await getUser(sender);
    if (user.portal) return '⚠️ Você já abriu um portal!';
    const portais = {
        'reino das sombras': { custo: { almas: 50 }, recompensa: { ether: 20, runas: 10 }, inimigos: ['espectro do vazio', 'abominação eterea'] },
        'plano celestial': { custo: { ether: 30 }, recompensa: { reliquias: 15, essencia: 25 }, inimigos: ['guardião celestial'] },
    };
    const portal = portais[destino];
    if (!portal) return '⚠️ Esse destino não está nos mapas etéreos!';
    for (let [moeda, qtd] of Object.entries(portal.custo)) {
        if (user.moedas[moeda] < qtd) return `⚠️ Faltam ${qtd - user.moedas[moeda]} ${MOEDAS[moeda]}!`;
    }
    
    Object.entries(portal.custo).forEach(([moeda, qtd]) => user.moedas[moeda] -= qtd);
    user.portal = { destino, aberto: Date.now() / 1000, fim: Date.now() / 1000 + 24 * 60 * 60 };
    mundo.portais[destino] = user.portal;
    await saveUser(sender, user);
    return `🌌 *Portal Aberto para ${destino}!* Duração: 24h. Prepare-se para o desconhecido!`;
}

async function explorarPortal(sender) {
    const user = await getUser(sender);
    if (!user.portal) return '⚠️ Você não abriu um portal!';
    if (Date.now() / 1000 > user.portal.fim) return '⚠️ O portal se fechou!';
    
    const portal = mundo.portais[user.portal.destino];
    let log = `🌌 *Exploração do ${user.portal.destino}!* 🌌\n`;
    for (let inimigo of portais[user.portal.destino].inimigos) {
        const resultado = await batalhar(sender, inimigo);
        log += resultado + '\n';
        if (resultado.includes('Queda')) return log;
    }
    
    Object.entries(portais[user.portal.destino].recompensa).forEach(([moeda, valor]) => user.moedas[moeda] += valor);
    user.conquistas.portaisExplorados++;
    user.portal = null;
    delete mundo.portais[user.portal.destino];
    await verificarConquistas(sender);
    await saveUser(sender, user);
    return `${log}🌟 *Portal Conquistado!* Recompensas: ${Object.entries(portais[user.portal.destino].recompensa).map(([k, v]) => `${v} ${MOEDAS[k]}`).join(', ')}.`;
}

// SISTEMA DE EVENTOS GLOBAIS
const eventos = [
    { nome: 'invasão demoníaca', duracao: 48 * 60 * 60, recompensa: { almas: 100, gemas: 75 }, inimigos: ['lich', 'hidra', 'devorador de mundos'] },
    { nome: 'festival das estrelas', duracao: 24 * 60 * 60, recompensa: { dinheiro: 20000, prestigio: 50 }, buff: 'XP +75%' },
    { nome: 'guerra dos titãs', duracao: 72 * 60 * 60, recompensa: { essencia: 50, fragmentos: 30 }, inimigos: ['tita ancestral', 'kraken abissal'] },
    { nome: 'despertar etéreo', duracao: 36 * 60 * 60, recompensa: { ether: 25, runas: 15 }, inimigos: ['guardião celestial', 'abominação eterea'] },
];

async function iniciarEventoGlobal() {
    const evento = eventos[Math.floor(Math.random() * eventos.length)];
    eventosGlobais[evento.nome] = { fim: Date.now() / 1000 + evento.duracao, participantes: [], inimigosDerrotados: 0 };
    return `🌍 *Evento Cósmico: ${evento.nome}!* Duração: ${evento.duracao / 3600}h. Recompensas: ${Object.entries(evento.recompensa).map(([k, v]) => `${v} ${MOEDAS[k]}`).join(', ')}. ${evento.inimigos ? 'Derrote os inimigos!' : 'Aproveite o buff!'}`;
}

async function participarEvento(sender, inimigoNome) {
    const user = await getUser(sender);
    const evento = Object.values(eventosGlobais).find(e => e.fim > Date.now() / 1000);
    if (!evento) return '⚠️ Nenhum evento está ativo!';
    if (!evento.participantes.includes(sender)) evento.participantes.push(sender);
    
    if (evento.inimigos && inimigoNome) {
        const resultado = await batalhar(sender, inimigoNome);
        if (resultado.includes('Triunfo')) evento.inimigosDerrotados++;
        if (evento.inimigosDerrotados >= evento.participantes.length * 5) {
            evento.participantes.forEach(async p => {
                const u = await getUser(p);
                Object.entries(eventos.find(e => e.nome === Object.keys(eventosGlobais).find(k => eventosGlobais[k] === evento)).recompensa).forEach(([moeda, valor]) => u.moedas[moeda] += valor);
                await saveUser(p, u);
            });
            delete eventosGlobais[Object.keys(eventosGlobais).find(k => eventosGlobais[k] === evento)];
            return `${resultado}\n🌟 *Evento Concluído!* Todos os participantes receberam: ${Object.entries(eventos.find(e => e.nome === Object.keys(eventosGlobais).find(k => eventosGlobais[k] === evento)).recompensa).map(([k, v]) => `${v} ${MOEDAS[k]}`).join(', ')}.`;
        }
        return resultado;
    }
    return `🌟 *Você entrou no ${Object.keys(eventosGlobais).find(k => eventosGlobais[k] === evento)}!* ${evento.inimigos ? 'Derrote inimigos para vencer!' : 'Aproveite o buff enquanto durar!'}`;
}

// SISTEMA DE PETS
const petTipos = {
    'lobo': { atributos: { ataque: 20, defesa: 15 }, evoluções: ['lobo alfa', 'lobo espectral', 'lobo do vazio'] },
    'falcão': { atributos: { agilidade: 25 }, evoluções: ['falcão flamejante', 'falcão celestial', 'falcão estelar'] },
    'dragãozinho': { atributos: { ataque: 30, inteligencia: 20 }, evoluções: ['dragão jovem', 'dragão ancião', 'dragão cósmico'] },
    'golem': { atributos: { defesa: 40 }, evoluções: ['golem de ferro', 'golem rúnico', 'golem eterno'] },
};

async function adotarPet(sender, tipo, nome) {
    const user = await getUser(sender);
    if (user.pet) return '⚠️ Você já possui um companheiro!';
    if (!petTipos[tipo]) return '⚠️ Esse tipo de pet não existe nas eras!';
    
    user.pet = { tipo, nome, nivel: 1, experiencia: 0, atributos: { ...petTipos[tipo].atributos }, felicidade: 70, saude: 100, lealdade: 50 };
    await saveUser(sender, user);
    return `🐾 *Companheiro Adotado!* Você agora tem um ${tipo} chamado ${nome}!`;
}

async function evoluirPet(sender) {
    const user = await getUser(sender);
    if (!user.pet) return '⚠️ Você não tem um pet!';
    if (user.pet.nivel >= petTipos[user.pet.tipo].evoluções.length + 1) return '⚠️ Seu pet alcançou o ápice da existência!';
    
    const xpNecessario = user.pet.nivel * 500;
    if (user.pet.experiencia < xpNecessario) return `⚠️ Faltam ${xpNecessario - user.pet.experiencia} XP para evoluir!`;
    
    user.pet.nivel++;
    user.pet.experiencia -= xpNecessario;
    user.pet.tipo = petTipos[user.pet.tipo].evoluções[user.pet.nivel - 2] || user.pet.tipo;
    Object.keys(user.pet.atributos).forEach(attr => user.pet.atributos[attr] += 15);
    user.pet.lealdade += 10;
    await saveUser(sender, user);
    return `🐾 *Evolução Cósmica!* Seu ${user.pet.nome} tornou-se um ${user.pet.tipo} de nível ${user.pet.nivel}! Lealdade: ${user.pet.lealdade}.`;
}

async function treinarPet(sender) {
    const user = await getUser(sender);
    if (!user.pet) return '⚠️ Você não tem um pet!';
    if (delays[sender]?.treinarPet > Date.now()) return `⏳ Aguarde ${Math.ceil((delays[sender].treinarPet - Date.now()) / 60000)} minutos para treinar novamente!`;
    
    user.pet.experiencia += 100 + user.atributos.carisma * 2;
    user.pet.felicidade += 10;
    user.pet.lealdade += 5;
    delays[sender] = delays[sender] || {};
    delays[sender].treinarPet = Date.now() + 60 * 60 * 1000; // 1h cooldown
    await saveUser(sender, user);
    return `🐾 *Treinamento Concluído!* Seu ${user.pet.nome} ganhou 100 + ${user.atributos.carisma * 2} XP! Felicidade: ${user.pet.felicidade}, Lealdade: ${user.pet.lealdade}.`;
}

// SISTEMA DE MAGIA
const feitiços = {
    'bola de fogo': { custo: 800, nivelMin: 1, mana: 30, efeito: 'Dano 80' },
    'cura divina': { custo: 1000, nivelMin: 3, mana: 50, efeito: 'Cura 200 vida' },
    'escudo arcano': { custo: 1500, nivelMin: 5, mana: 75, efeito: 'Defesa +40 por 20min' },
    'tempestade elemental': { custo: 3000, nivelMin: 10, mana: 120, efeito: 'Dano 200 em área' },
    'toque etereo': { custo: 5000, nivelMin: 15, mana: 150, efeito: 'Dano 300 + rouba 10 ether' },
};

// TRABALHAR NO EMPREGO
async function trabalhar(sender) {
    const user = await getUser(sender);
    if (user.emprego === 'desempregado') return '⚠️ Você não tem emprego! Use !job [nome] pra escolher um.';
    const emprego = empregos.find(e => e.nome === user.emprego);
    if (delays[sender]?.trabalhar > Date.now()) return `⏳ Aguarde ${Math.ceil((delays[sender].trabalhar - Date.now()) / 60000)} minutos pra trabalhar novamente!`;
    
    const salario = Math.floor(Math.random() * (emprego.salarioMax - emprego.salarioMin + 1)) + emprego.salarioMin;
    user.moedas.dinheiro += salario;
    delays[sender] = delays[sender] || {};
    delays[sender].trabalhar = Date.now() + emprego.delay * 1000;
    await ganharXP(sender, salario / 10);
    await saveUser(sender, user);
    return `💼 *Trabalho Concluído!* Você ganhou ${salario} ${MOEDAS.dinheiro} como ${emprego.nome}!`;
}

// ESCOLHER EMPREGO
async function escolherEmprego(sender, empregoNome) {
    const user = await getUser(sender);
    const emprego = empregos.find(e => normalizarTexto(e.nome) === normalizarTexto(empregoNome));
    if (!emprego) return '⚠️ Emprego inválido! Veja opções com !jobs.';
    if (user.experiencia < emprego.xpNecessaria) return `⚠️ Você precisa de ${emprego.xpNecessaria} XP pra esse emprego! Seu XP: ${user.experiencia}.`;
    
    user.emprego = emprego.nome;
    user.habilidades = { ...user.habilidades, ...emprego.habilidades };
    await saveUser(sender, user);
    return `⚒️ *Emprego Escolhido!* Você agora é um ${emprego.nome}.`;
}

// LISTA DE EMPREGOS
async function listarEmpregos() {
    return `⚒️ *Empregos Disponíveis* ⚒️\n${empregos.map(e => `${e.nome} (XP: ${e.xpNecessaria}, Salário: ${e.salarioMin}-${e.salarioMax} ${MOEDAS.dinheiro})`).join('\n')}`;
}

// COMPRAR NA LOJA
async function comprarLoja(sender, itemNome) {
    const user = await getUser(sender);
    const item = itensLoja.find(i => normalizarTexto(i.nome) === normalizarTexto(itemNome));
    if (!item) return '⚠️ Item não encontrado na loja! Veja com !shop.';
    if (user.moedas.dinheiro < item.valor) return `⚠️ Faltam ${item.valor - user.moedas.dinheiro} ${MOEDAS.dinheiro} pra comprar isso!`;
    
    user.moedas.dinheiro -= item.valor;
    user.inventario[item.nome] = (user.inventario[item.nome] || 0) + 1;
    await saveUser(sender, user);
    return `🛒 *Compra Feita!* Você adquiriu ${item.nome} por ${item.valor} ${MOEDAS.dinheiro}.`;
}

// VENDER ITEM
async function venderItem(sender, itemNome) {
    const user = await getUser(sender);
    const itemLoja = itensLoja.find(i => normalizarTexto(i.nome) === normalizarTexto(itemNome));
    const itemMercado = itensMercadoNegro.find(i => normalizarTexto(i.nome) === normalizarTexto(itemNome));
    const item = itemLoja || itemMercado;
    if (!item || !user.inventario[item.nome]) return '⚠️ Você não tem esse item pra vender!';
    
    const valorVenda = item.venda || Math.floor(item.valor * 0.4);
    user.moedas.dinheiro += valorVenda;
    user.inventario[item.nome]--;
    if (user.inventario[item.nome] === 0) delete user.inventario[item.nome];
    await saveUser(sender, user);
    return `💰 *Vendido!* Você ganhou ${valorVenda} ${MOEDAS.dinheiro} por ${item.nome}.`;
}

// EQUIPAR ITEM
async function equiparItem(sender, itemNome) {
    const user = await getUser(sender);
    const item = [...itensLoja, ...itensMercadoNegro].find(i => normalizarTexto(i.nome) === normalizarTexto(itemNome));
    if (!item || !user.inventario[item.nome]) return '⚠️ Você não tem esse item pra equipar!';
    
    const slot = item.tipo === 'arma' ? 'arma' : item.tipo === 'armadura' ? 'armadura' : item.tipo === 'acessorio' ? 'acessorio' : 'anel';
    if (user.equipamento[slot]) {
        user.inventario[user.equipamento[slot].nome] = (user.inventario[user.equipamento[slot].nome] || 0) + 1;
    }
    user.equipamento[slot] = item;
    user.inventario[item.nome]--;
    if (user.inventario[item.nome] === 0) delete user.inventario[item.nome];
    await saveUser(sender, user);
    return `🗡️ *Equipado!* ${item.nome} agora está no slot de ${slot}.`;
}

// DEPOSITAR NO BANCO
async function depositarBanco(sender, quantia) {
    const user = await getUser(sender);
    if (!quantia || isNaN(quantia) || quantia <= 0) return '⚠️ Quantia inválida! Use !dep 500, por exemplo.';
    if (user.saldo.carteira < quantia) return `⚠️ Faltam ${quantia - user.saldo.carteira} ${MOEDAS.dinheiro} na carteira!`;
    
    user.saldo.carteira -= quantia;
    user.saldo.banco += quantia;
    await saveUser(sender, user);
    return `🏦 *Depositado!* ${quantia} ${MOEDAS.dinheiro} foi pro banco. Saldo: ${user.saldo.banco} ${MOEDAS.dinheiro}.`;
}

// SACAR DO BANCO
async function sacarBanco(sender, quantia) {
    const user = await getUser(sender);
    if (!quantia || isNaN(quantia) || quantia <= 0) return '⚠️ Quantia inválida! Use !sacar 500, por exemplo.';
    if (user.saldo.banco < quantia) return `⚠️ Faltam ${quantia - user.saldo.banco} ${MOEDAS.dinheiro} no banco!`;
    
    user.saldo.banco -= quantia;
    user.saldo.carteira += quantia;
    await saveUser(sender, user);
    return `🏦 *Sacado!* ${quantia} ${MOEDAS.dinheiro} foi pra carteira. Saldo: ${user.saldo.banco} ${MOEDAS.dinheiro}.`;
}

// TRANSFERIR DINHEIRO
async function transferirDinheiro(sender, alvo, quantia) {
    const user = await getUser(sender);
    const alvoUser = await getUser(alvo);
    if (!alvoUser) return '⚠️ Esse jogador não existe!';
    if (!quantia || isNaN(quantia) || quantia <= 0) return '⚠️ Quantia inválida! Use !send @user 1000, por exemplo.';
    if (user.saldo.carteira < quantia) return `⚠️ Faltam ${quantia - user.saldo.carteira} ${MOEDAS.dinheiro} na carteira!`;
    
    user.saldo.carteira -= quantia;
    alvoUser.saldo.carteira += quantia;
    await saveUser(sender, user);
    await saveUser(alvo, alvoUser);
    return `💸 *Transferido!* Você enviou ${quantia} ${MOEDAS.dinheiro} pra ${alvoUser.nome}.`;
}

// RANKING GLOBAL
async function rankingGlobal() {
    const users = await Promise.all((await fs.readdir(RpgPath)).map(f => getUser(f.split('.json')[0])));
    const top = users.sort((a, b) => b.nivel - a.nivel).slice(0, 10);
    return `🏆 *Ranking Global* 🏆\n${top.map((u, i) => `${i + 1}. ${u.nome} - Nv.${u.nivel} (${u.moedas.dinheiro} ${MOEDAS.dinheiro})`).join('\n')}`;
}

// APRENDER MAGIA
async function aprenderMagia(sender, feitiçoNome) {
    const user = await getUser(sender);
    const feitiço = feitiços[normalizarTexto(feitiçoNome)];
    if (!feitiço) return '⚠️ Feitiço inválido! Veja com !spells.';
    if (user.moedas.dinheiro < feitiço.custo) return `⚠️ Faltam ${feitiço.custo - user.moedas.dinheiro} ${MOEDAS.dinheiro} pra aprender isso!`;
    if (user.magia.nivel < feitiço.nivelMin) return `⚠️ Você precisa de nível ${feitiço.nivelMin} de magia! Seu nível: ${user.magia.nivel}.`;
    if (user.magia.feitiços.includes(feitiçoNome)) return '⚠️ Você já sabe esse feitiço!';
    
    user.moedas.dinheiro -= feitiço.custo;
    user.magia.feitiços.push(feitiçoNome);
    await saveUser(sender, user);
    return `✨ *Magia Aprendida!* ${feitiçoNome} agora é seu por ${feitiço.custo} ${MOEDAS.dinheiro}.`;
}

// USAR MAGIA
async function usarMagia(sender, feitiçoNome) {
    const user = await getUser(sender);
    const feitiço = feitiços[normalizarTexto(feitiçoNome)];
    if (!feitiço || !user.magia.feitiços.includes(feitiçoNome)) return '⚠️ Você não sabe esse feitiço!';
    if (user.magia.mana < feitiço.mana) return `⚠️ Faltam ${feitiço.mana - user.magia.mana} de mana!`;
    
    user.magia.mana -= feitiço.mana;
    await saveUser(sender, user);
    return `🔮 *Magia Lançada!* ${feitiçoNome} usado! Efeito: ${feitiço.efeito}. Mana restante: ${user.magia.mana}.`;
}

// LISTA DE FEITIÇOS
async function listarFeitiços() {
    return `🔮 *Feitiços Disponíveis* 🔮\n${Object.entries(feitiços).map(([nome, f]) => `${nome} (Custo: ${f.custo} ${MOEDAS.dinheiro}, Mana: ${f.mana}, Nv.${f.nivelMin}) - ${f.efeito}`).join('\n')}`;
}

// ENTRAR EM FACÇÃO
async function entrarFacção(sender, facçãoNome) {
    const user = await getUser(sender);
    const facções = ['ordem', 'caos', 'luz', 'trevas'];
    if (!facções.includes(normalizarTexto(facçãoNome))) return '⚠️ Facção inválida! Opções: ordem, caos, luz, trevas.';
    if (user.facção) return '⚠️ Você já pertence a uma facção!';
    
    user.facção = facçãoNome;
    user.reputacao += 50;
    await saveUser(sender, user);
    return `⚔️ *Facção Escolhida!* Você agora serve à ${facçãoNome}. Reputação: +50.`;
}

// COMPRAR NO MERCADO NEGRO
async function comprarMercadoNegro(sender, itemNome) {
    const user = await getUser(sender);
    const item = itensMercadoNegro.find(i => normalizarTexto(i.nome) === normalizarTexto(itemNome));
    if (!item) return '⚠️ Item não encontrado no mercado negro! Veja com !blackmarket.';
    const custo = Object.entries(item).find(([k]) => ['valor', 'almas', 'ether', 'runas', 'reliquias'].includes(k));
    if (user.moedas[custo[0]] < custo[1]) return `⚠️ Faltam ${custo[1] - user.moedas[custo[0]]} ${MOEDAS[custo[0]]} pra comprar isso!`;
    
    user.moedas[custo[0]] -= custo[1];
    user.inventario[item.nome] = (user.inventario[item.nome] || 0) + 1;
    await saveUser(sender, user);
    return `🌚 *Negócio Fechado!* Você adquiriu ${item.nome} por ${custo[1]} ${MOEDAS[custo[0]]}.`;
}

// LISTA DO MERCADO NEGRO
async function listarMercadoNegro() {
    return `🌚 *Mercado Negro* 🌚\n${itensMercadoNegro.map(i => `${i.nome} - ${i.valor ? `${i.valor} ${MOEDAS.dinheiro}` : Object.entries(i).find(([k]) => ['almas', 'ether', 'runas', 'reliquias'].includes(k)).map(([k, v]) => `${v} ${MOEDAS[k]}`).join('')}`).join('\n')}`;
}

// ORAR A UM DEUS
async function orar(sender, deus) {
    const user = await getUser(sender);
    if (delays[sender]?.orar > Date.now()) return `⏳ Aguarde ${Math.ceil((delays[sender].orar - Date.now()) / 3600000)} horas pra orar novamente!`;
    
    const deuses = {
        'zeus': { favor: 20, recompensa: { dinheiro: 1000 } },
        'hades': { favor: 15, recompensa: { almas: 10 } },
        'atena': { favor: 25, recompensa: { gemas: 15 } },
        'poseidon': { favor: 20, recompensa: { essencia: 10 } },
    };
    const deusEscolhido = deuses[normalizarTexto(deus)];
    if (!deusEscolhido) return '⚠️ Deus inválido! Opções: zeus, hades, atena, poseidon.';
    
    user.religiao.deus = deus;
    user.religiao.favor += deusEscolhido.favor;
    Object.entries(deusEscolhido.recompensa).forEach(([moeda, valor]) => user.moedas[moeda] += valor);
    delays[sender] = delays[sender] || {};
    delays[sender].orar = Date.now() + 24 * 60 * 60 * 1000; // 24h cooldown
    await saveUser(sender, user);
    return `🙏 *Oração Aceita!* ${deus} te abençoou com ${Object.entries(deusEscolhido.recompensa).map(([k, v]) => `${v} ${MOEDAS[k]}`).join(', ')} e +${deusEscolhido.favor} favor divino.`;
}

// CRIAR CARAVANA
async function criarCaravana(sender, destino) {
    const user = await getUser(sender);
    if (user.caravana) return '⚠️ Você já tem uma caravana ativa!';
    const caravanas = {
        'montanhas': { custo: 5000, tempo: 24 * 60 * 60, recompensa: { gemas: 30, fragmentos: 15 } },
        'deserto': { custo: 7000, tempo: 36 * 60 * 60, recompensa: { dinheiro: 10000, essencia: 20 } },
        'floresta': { custo: 6000, tempo: 30 * 60 * 60, recompensa: { reliquias: 10, ether: 15 } },
    };
    const caravana = caravanas[normalizarTexto(destino)];
    if (!caravana) return '⚠️ Destino inválido! Opções: montanhas, deserto, floresta.';
    if (user.moedas.dinheiro < caravana.custo) return `⚠️ Faltam ${caravana.custo - user.moedas.dinheiro} ${MOEDAS.dinheiro} pra enviar a caravana!`;
    
    user.moedas.dinheiro -= caravana.custo;
    user.caravana = { destino, inicio: Date.now() / 1000, fim: Date.now() / 1000 + caravana.tempo };
    await saveUser(sender, user);
    return `🚛 *Caravana Enviada!* Destino: ${destino}. Retorna em ${caravana.tempo / 3600}h.`;
}

// COLETAR CARAVANA
async function coletarCaravana(sender) {
    const user = await getUser(sender);
    if (!user.caravana) return '⚠️ Você não tem uma caravana ativa!';
    if (Date.now() / 1000 < user.caravana.fim) return `⏳ A caravana volta em ${Math.ceil((user.caravana.fim - Date.now() / 1000) / 3600)} horas!`;
    
    const caravanas = {
        'montanhas': { recompensa: { gemas: 30, fragmentos: 15 } },
        'deserto': { recompensa: { dinheiro: 10000, essencia: 20 } },
        'floresta': { recompensa: { reliquias: 10, ether: 15 } },
    };
    const recompensa = caravanas[user.caravana.destino].recompensa;
    Object.entries(recompensa).forEach(([moeda, valor]) => user.moedas[moeda] += valor);
    user.conquistas.caravanasCompletadas++;
    user.caravana = null;
    await verificarConquistas(sender);
    await saveUser(sender, user);
    return `🚛 *Caravana Retornou!* Recompensas: ${Object.entries(recompensa).map(([k, v]) => `${v} ${MOEDAS[k]}`).join(', ')}.`;
}

// LISTA DA LOJA
async function listarLoja() {
    return `🛒 *Loja* 🛒\n${itensLoja.map(i => `${i.nome} - ${i.valor} ${MOEDAS.dinheiro}`).join('\n')}`;
}

// SISTEMA DE PROPRIEDADES (IMPLEMENTAÇÃO COMPLETA)
async function comprarPropriedade(sender, propriedadeNome) {
    const user = await getUser(sender);
    const propriedade = propriedades[normalizarTexto(propriedadeNome)];
    if (!propriedade) return '⚠️ Essa propriedade não existe nos registros eternos! Opções: casa, fazenda, castelo, torre arcana, santuário.';
    if (user.moedas.dinheiro < propriedade.custo) return `⚠️ Faltam ${propriedade.custo - user.moedas.dinheiro} ${MOEDAS.dinheiro} para adquirir essa propriedade!`;
    if (user.propriedades.some(p => p.nome === propriedadeNome)) return '⚠️ Você já possui essa propriedade!';

    user.moedas.dinheiro -= propriedade.custo;
    user.propriedades.push({ nome: propriedadeNome, nivel: 1, ultimaColeta: 0, upgrades: [] });
    await saveUser(sender, user);
    return `🏡 *Propriedade Adquirida!* Você agora é dono de uma ${propriedadeNome} por ${propriedade.custo} ${MOEDAS.dinheiro}. Produção a cada ${propriedade.delay / 3600}h!`;
}

async function coletarProducao(sender) {
    const user = await getUser(sender);
    if (user.propriedades.length === 0) return '⚠️ Você não possui propriedades para coletar!';

    let log = `🌾 *Coleta das Propriedades* 🌾\n`;
    let totalRecompensa = {};
    for (let prop of user.propriedades) {
        const propriedade = propriedades[prop.nome];
        const tempoPassado = Date.now() / 1000 - prop.ultimaColeta;
        if (tempoPassado < propriedade.delay) {
            log += `⏳ ${prop.nome}: Aguarde ${Math.ceil((propriedade.delay - tempoPassado) / 3600)} horas!\n`;
            continue;
        }

        const ciclos = Math.floor(tempoPassado / propriedade.delay);
        Object.entries(propriedade.producao).forEach(([recurso, valor]) => {
            totalRecompensa[recurso] = (totalRecompensa[recurso] || 0) + valor * ciclos * prop.nivel;
            user.moedas[recurso] += valor * ciclos * prop.nivel;
        });
        prop.ultimaColeta = Date.now() / 1000;
        log += `🏡 ${prop.nome} (Nv.${prop.nivel}): +${Object.entries(propriedade.producao).map(([k, v]) => `${v * ciclos * prop.nivel} ${MOEDAS[k]}`).join(', ')}\n`;
    }

    await saveUser(sender, user);
    return log.length > 30 ? log : '⚠️ Nenhuma produção pronta para coleta!';
}

async function melhorarPropriedade(sender, propriedadeNome, upgradeNome) {
    const user = await getUser(sender);
    const propriedade = user.propriedades.find(p => normalizarTexto(p.nome) === normalizarTexto(propriedadeNome));
    if (!propriedade) return '⚠️ Você não possui essa propriedade!';
    const upgradesDisponiveis = propriedades[propriedade.nome].upgrades;
    const custoUpgrade = upgradesDisponiveis[upgradeNome];
    if (!custoUpgrade) return `⚠️ Upgrade inválido para ${propriedade.nome}! Opções: ${Object.keys(upgradesDisponiveis).join(', ')}.`;
    if (propriedade.upgrades.includes(upgradeNome)) return '⚠️ Esse upgrade já foi aplicado!';
    if (user.moedas.dinheiro < custoUpgrade) return `⚠️ Faltam ${custoUpgrade - user.moedas.dinheiro} ${MOEDAS.dinheiro} para esse aprimoramento!`;

    user.moedas.dinheiro -= custoUpgrade;
    propriedade.upgrades.push(upgradeNome);
    propriedade.nivel++;
    await saveUser(sender, user);
    return `🏠 *Propriedade Aprimorada!* ${propriedade.nome} agora tem ${upgradeNome} e subiu para nível ${propriedade.nivel}! Custo: ${custoUpgrade} ${MOEDAS.dinheiro}.`;
}

// SISTEMA DE GUILDAS (FUNÇÕES FALTANTES)
async function guildaConvidar(sender, alvo) {
    const user = await getUser(sender);
    const alvoUser = await getUser(alvo);
    if (!user.guilda || user.guilda.lider !== sender) return '⚠️ Apenas o líder pode convidar!';
    if (!alvoUser) return '⚠️ Esse guerreiro não existe!';
    if (alvoUser.guilda) return '⚠️ Esse jogador já pertence a uma guilda!';
    if (user.guilda.membros.length >= 50) return '⚠️ Sua guilda atingiu o limite de 50 membros!';

    alvoUser.missões.push({ tipo: 'convite guilda', origem: sender, guilda: user.guilda.nome, expira: Date.now() / 1000 + 24 * 60 * 60 });
    await saveUser(alvo, alvoUser);
    return `📜 *Convite Enviado!* ${alvoUser.nome} foi convidado para a ${user.guilda.nome}. Ele tem 24h para aceitar!`;
}

async function guildaAceitar(sender, guildaNome) {
    const user = await getUser(sender);
    const convite = user.missões.find(m => m.tipo === 'convite guilda' && normalizarTexto(m.guilda) === normalizarTexto(guildaNome));
    if (!convite) return '⚠️ Você não tem um convite para essa guilda!';
    if (Date.now() / 1000 > convite.expira) return '⚠️ Esse convite expirou!';

    const lider = await getUser(convite.origem);
    if (!lider.guilda || lider.guilda.nome !== guildaNome) return '⚠️ A guilda não existe mais ou o líder mudou!';
    
    user.guilda = { nome: guildaNome, lider: convite.origem, membros: lider.guilda.membros, nivel: lider.guilda.nivel, recursos: lider.guilda.recursos, missões: lider.guilda.missões, fortaleza: lider.guilda.fortaleza };
    lider.guilda.membros.push(sender);
    user.missões = user.missões.filter(m => m !== convite);
    await saveUser(sender, user);
    await saveUser(convite.origem, lider);
    return `⚜️ *Bem-vindo à ${guildaNome}!* Você agora faz parte desta irmandade eterna!`;
}

// SISTEMA DE CONQUISTAS
async function verificarConquistas(sender) {
    const user = await getUser(sender);
    let log = '';
    for (let [nome, conquista] of Object.entries(conquistas)) {
        if (user.titulos.includes(nome)) continue;

        let conquistou = true;
        if (conquista.requisito.inimigos) {
            for (let [inimigo, qtd] of Object.entries(conquista.requisito.inimigos)) {
                if ((user.conquistas.inimigosMortos[inimigo] || 0) < qtd) conquistou = false;
            }
        } else if (conquista.requisito.masmorras && user.conquistas.masmorrasCompletadas < conquista.requisito.masmorras) {
            conquistou = false;
        } else if (conquista.requisito.craft && user.conquistas.itensCraftados < conquista.requisito.craft) {
            conquistou = false;
        } else if (conquista.requisito.nivel && user.nivel < conquista.requisito.nivel) {
            conquistou = false;
        } else if (conquista.requisito.guerras && user.conquistas.guerrasVencidas < conquista.requisito.guerras) {
            conquistou = false;
        }

        if (conquistou) {
            Object.entries(conquista.recompensa).forEach(([key, value]) => {
                if (key === 'titulos') user.titulos.push(value);
                else user.moedas[key] += value;
            });
            if (conquista.bonus) {
                if (conquista.bonus.todos) {
                    Object.keys(user.atributos).forEach(attr => user.atributos[attr] += conquista.bonus.todos);
                } else {
                    Object.entries(conquista.bonus).forEach(([attr, val]) => user.atributos[attr] += val);
                }
            }
            log += `🏅 *Conquista Desbloqueada: ${nome}!* Recompensas: ${Object.entries(conquista.recompensa).map(([k, v]) => k === 'titulos' ? v : `${v} ${MOEDAS[k]}`).join(', ')}. Bônus: ${conquista.bonus ? Object.entries(conquista.bonus).map(([k, v]) => `${k} +${v}`).join(', ') : 'Nenhum'}.\n`;
        }
    }

    if (log) {
        await saveUser(sender, user);
        return log;
    }
    return null;
}

// ATUALIZAÇÃO DO EXPORT
module.exports = Object.assign(getUser, {
    rg: registrar,
    batalhar,
    explorarMasmorra,
    craftar,
    melhorarForja,
    melhorarAlquimia,
    comprarPropriedade,
    coletarProducao,
    melhorarPropriedade,
    criarGuilda,
    guildaConvidar,
    guildaAceitar,
    guildaMissão,
    declararGuerra,
    guerrear,
    desafiarArena,
    fundarReino,
    coletarImpostos,
    melhorarReino,
    abrirPortal,
    explorarPortal,
    eventos: { iniciarEventoGlobal, participarEvento },
    adotarPet,
    evoluirPet,
    treinarPet,
    aprenderMagia,
    usarMagia,
    entrarFacção,
    comprarMercadoNegro,
    orar,
    criarCaravana,
    coletarCaravana,
    ganharXP,
    distribuirPontos,
    verificarConquistas,
    trabalhar,
    escolherEmprego,
    listarEmpregos,
    comprarLoja,
    venderItem,
    equiparItem,
    depositarBanco,
    sacarBanco,
    transferirDinheiro,
    rankingGlobal,
    listarFeitiços,
    listarMercadoNegro,
    listarLoja,
});