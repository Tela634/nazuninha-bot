/*
 SISTEMA DE RPG - V1
 CRIADOR: HIUDY
 
 AVISO, ESSE SCRIPT FOI CRIADO DO ZERO POR MIM (HIUDY), NÃO VAZE OU VENDA ESSE SCRIPT SEM A MINHA PERMISSÃO, CASO FOR MELHORAR/MODIFICAR O CODIGO NÃO TIRE OS MEUS CRÉDITOS.
*/

// IMPORTAÇÕES
const path = require('path');
const fs = require('fs').promises;

//TEMPORÁRIO PARA DELAY :)
let delay = {};

// DIRETÓRIO DO RPG
const RpgPath = path.join(__dirname, './../dados/database/rpg');

// CRIAR PASTA DE RPG (CASO NÃO EXISTA)
fs.mkdir(RpgPath, { recursive: true }).catch(console.error);

//EMPREGOS
const empregos = [
    { nome: 'lixeiro', salarioMin: 50, salarioMax: 150, xpNecessaria: 0, delay: 'Sua próxima rota de coleta de lixos so acontece daqui #segundos# segundos.' },
    { nome: 'faxineiro', salarioMin: 80, salarioMax: 200, xpNecessaria: 20, delay: 'O prédio esta limpo por agora, vá descansar um pouco, volte daqui #segundos# segundos.' },
    { nome: 'garcom', salarioMin: 100, salarioMax: 250, xpNecessaria: 40, delay: 'Esta na sua hora de descanso, outro garçom esta servindo os pratos, volte daqui #segundos# segundos para trabalhar novamente.' },
    { nome: 'motorista', salarioMin: 150, salarioMax: 300, xpNecessaria: 80, delay: 'Seu próximo horário de saída é so daqui #segundos# segundos.' },
    { nome: 'vendedor', salarioMin: 200, salarioMax: 400, xpNecessaria: 100, delay: 'Voce está sem peças disponíveis para venda, sua próxima entrega de produtos chega daqui #segundos# segundos.' },
    { nome: 'cozinheiro', salarioMin: 250, salarioMax: 500, xpNecessaria: 150, delay: 'Voce já esta cozinhando a muito tempo, vá descansar um pouco, volte daqui #segundos# segundos, o seu braço direito cuida da cozinha enquanto isso.' },
    { nome: 'professor', salarioMin: 300, salarioMax: 600, xpNecessaria: 180, delay: 'Sua próxima aula so começa daqui #segundos# segundos.' },
    { nome: 'engenheiro', salarioMin: 400, salarioMax: 800, xpNecessaria: 250, delay: 'Voce não tem nada para fazer no momento, volte daqui #segundos# segundos para mais trabalho.' },
    { nome: 'policial', salarioMin: 450, salarioMax: 900, xpNecessaria: 350, delay: 'Seu turno so começa daqui #segundos# segundos.' },
    { nome: 'advogado', salarioMin: 500, salarioMax: 1000, xpNecessaria: 450, delay: 'O caso de seu cliente so irá a julgamento daqui #segundos# segundos.' },
    { nome: 'medico', salarioMin: 600, salarioMax: 1200, xpNecessaria: 600, delay: 'Voce está no seu horário de descanso, apenas aproveite e volte daqui #segundos# segundos, e torça para não chegar nenhuma emergência' },
];

//ITEM DA LOJA || ITENS COM VENDA ACEITA
const itensLoja = [
    { nome: 'picareta', valor: 700, venda: 300 },
    { nome: 'isca', valor: 800, venda: 320 },
    { nome: 'faca', valor: 900, venda: 350 },
    { nome: 'arma', valor: 1100, venda: 480 },
    { nome: 'municao', valor: 300, venda: 80 },
    { nome: 'computador', valor: 1300, venda: 600 },
    { nome: 'racao', valor: 150, venda: 50 },
    { nome: 'escudo', valor: 1450, venda: 760 }
];
const itensVenda = [
    { nome: 'carvao', venda: 50 },
    { nome: 'prata', venda: 70 },
    { nome: 'ferro', venda: 80 },
    { nome: 'ouro', venda: 95 },
    { nome: 'diamante', venda: 115 },
    { nome: 'esmeralda', venda: 130 },
    { nome: 'peixe', venda: 40 },
    { nome: 'peixes', venda: 40 },
    { nome: 'carne', venda: 30 },
    { nome: 'carnes', venda: 30 }
];

//FUNÇÃO QUE RETORNA A LOJA
async function GerarLoja() {
 try {
 let textLoja = `- *🛒 NAZU MARKET 🛒*\n`;
 for(item of itensLoja) {
 textLoja += `\n- ${item.nome} (R$${item.valor})`;
 };
 textLoja += `\n\n> Para realizar a compra utilize o comando #prefix#comprar [Nome do item]\n> Exemplo: #prefix#comprar picareta`;
 return {message: textLoja};
 } catch (e) {
 console.error(e);
 return false;
}
};

// FUNÇÃO DE REGISTRAR USUÁRIO
async function rgUser(sender, name = "") {
    try {
        const userPath = path.join(RpgPath, `${sender}.json`);
        const saldo = { banco: 0, carteira: 0 };
        const object = {
            id: sender,
            nome: name,
            saldo: saldo,
            inventario: {}
        };
        await fs.writeFile(userPath, JSON.stringify(object, null, '\t'));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

// FUNÇÃO DE PEGAR INFORMAÇÕES DO USUÁRIO
async function getUser(sender) {
    try {
        const userPath = path.join(RpgPath, `${sender}.json`);
        if (await fs.access(userPath).then(() => true).catch(() => false)) {
            const userDados = JSON.parse(await fs.readFile(userPath, 'utf-8'));
            return userDados;
        } else {
            return false;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}

// FUNÇÃO UTILITÁRIA: SALVAR USUÁRIO
async function saveUser(sender, dadosUser) {
    try {
        const userPath = path.join(RpgPath, `${sender}.json`);
        await fs.writeFile(userPath, JSON.stringify(dadosUser, null, '\t'));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

// ADICIONAR SALDO NA CARTEIRA
async function addSaldo(sender, value) {
    if (typeof sender === "undefined" || typeof value === "undefined") {
        return "Uso: saldo.add(<sender>, <valor>) - Adiciona saldo à carteira do usuário.";
    }
    try {
        const dadosUser = await getUser(sender);
        if (!dadosUser || !Number(value)) return false;
        dadosUser.saldo.carteira += Number(value);
        return await saveUser(sender, dadosUser);
    } catch (e) {
        console.error(e);
        return false;
    }
}

// DELETAR SALDO DA CARTEIRA
async function delSaldo(sender, value) {
    return addSaldo(sender, -value);
}

// ADICIONAR SALDO NO BANCO
async function addSaldoBank(sender, value) {
    if (typeof sender === "undefined" || typeof value === "undefined") {
        return "Uso: banco.add(<sender>, <valor>) - Adiciona saldo ao banco do usuário.";
    }
    try {
        const dadosUser = await getUser(sender);
        if (!dadosUser || !Number(value)) return false;
        dadosUser.saldo.banco += Number(value);
        return await saveUser(sender, dadosUser);
    } catch (e) {
        console.error(e);
        return false;
    }
}

// DELETAR SALDO NO BANCO
async function delSaldoBank(sender, value) {
    return addSaldoBank(sender, -value);
}

// ADICIONAR ITEM NO INVENTARIO
async function addItem(sender, itemName, quantity = 1) {
    if (!itemName || !quantity) {
        return "Uso: inventario.add(<sender>, <item>, <quantidade>) - Adiciona itens ao inventário.";
    }
    try {
        const dadosUser = await getUser(sender);
        if (!dadosUser) return false;
        if (!dadosUser.inventario[itemName]) dadosUser.inventario[itemName] = 0;
        dadosUser.inventario[itemName] += quantity;
        await saveUser(sender, dadosUser);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

//REMOVER ITEM DO INVENTÁRIO
async function removeItem(sender, itemName, quantity = 1) {
    if (!itemName || !quantity) {
        return "Uso: inventario.remove(<sender>, <item>, <quantidade>) - Remove itens do inventário.";
    }
    try {
        const dadosUser = await getUser(sender);
        if (!dadosUser || !dadosUser.inventario[itemName]) return false;
        dadosUser.inventario[itemName] -= quantity;
        if (dadosUser.inventario[itemName] <= 0) {
            delete dadosUser.inventario[itemName];
        }
        await saveUser(sender, dadosUser);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

//EXCLUIR REGISTRO DE USUÁRIO
async function delUser(sender) {
try {
 const userPath = path.join(RpgPath, `${sender}.json`);
 if(require('fs').existsSync(userPath)) {
  await require('fs').unlinkSync(userPath);
  return true
 } else {
  return true;
 };
} catch (e) {
 console.error(e);
 return false;
}};

//PEGAR LISTA DE EMPREGOS
async function listarEmpregos(sender) {
    try {
    const dadosUser = await getUser(sender);
    if (!dadosUser) return false;
    if (!dadosUser.xpEmprego) dadosUser.xpEmprego = 0;
    const disponiveis = empregos.filter(e => dadosUser.xpEmprego >= e.xpNecessaria).map(e => e.nome);
    const bloqueados = empregos.filter(e => dadosUser.xpEmprego < e.xpNecessaria).map(e => e.nome);
    return { disponiveis, bloqueados };
    } catch (e) {
 console.error(e);
 return false;
}
};

//SE DEMITIR DO EMPREGO
async function sairEmprego(sender) {
try {
    const dadosUser = await getUser(sender);
    if (!dadosUser) return false;
    if (!dadosUser.emprego || dadosUser.emprego === "desempregado") return {message: 'Voce ja esta desempregado vagabundo.'};
    dadosUser.emprego = "desempregado";
    await saveUser(sender, dadosUser);
    return {message: "Prontinho você saiu do seu emprego, agora voltou a ser um vagabundo."};
    } catch (e) {
 console.error(e);
 return false;
}
};

//ENTRAR EM UM EMPREGO
async function entrarEmprego(sender, emprego) {
try {
    const dadosUser = await getUser(sender);
    if (!dadosUser) return false;
    const empregoData = empregos.find(e => e.nome === emprego);
    if (!empregoData) return {message: `Emprego inválido, utilize o comando empregos para ver os empregos disponíveis`};
    if(!dadosUser.xpEmprego) dadosUser.xpEmprego = 0;
    if (dadosUser.xpEmprego < empregoData.xpNecessaria) {
        return {message: `Infelizmente eles não quiseram lhe contratar, disseram que você nao tem experiência o suficiente para um cargo deste nível.`};
    };
    dadosUser.emprego = emprego;
    await saveUser(sender, dadosUser);
    return {message: `Parabéns! Você agora está trabalhando como ${emprego}, Você nao é mais um vagabundo fudido 🥳.`};
    } catch (e) {
 console.error(e);
 return false;
}
};

//FUNÇÃO DE TRABALHAR (ALGUEM ME MATA PFV 😭)
async function trabalhar(sender) {
const dadosUser = await getUser(sender);
if (!dadosUser) return false;
if (dadosUser.emprego === "desempregado") return {message: 'Desde quando desempregado trabalha? vai procurar um emprego vagabundo'};
const empregoData = empregos.find(e => e.nome === dadosUser.emprego);
if (!empregoData) return false;

let now = Date.now();

if (delay[sender] && delay[sender]['trabalhar']) {
let remainingTime = delay[sender]['trabalhar'] - now;
if (remainingTime > 0) return {message: empregoData.delay.replaceAll("#segundos#", String(Math.ceil(remainingTime / 1000)))};
};

try {
let salario = 0;
let textoTrabalho = "";
const chance = Math.random() * 100;

switch (dadosUser.emprego) {
case "lixeiro":
if (chance > 30) {
salario = Math.floor(Math.random() * (empregoData.salarioMax - empregoData.salarioMin)) + empregoData.salarioMin;
textoTrabalho = `Você recolheu toneladas de lixo e manteve as ruas limpas. Recebeu R$${salario}!`;
} else if (chance > 7) {
textoTrabalho = "O caminhão de lixo quebrou hoje, e você não conseguiu trabalhar.";
} else {
salario = Math.floor(Math.random() * 140) + 100;
textoTrabalho = `Sorte grande! Enquanto vasculhava o lixo, encontrou uma joia e vendeu por R$${salario}.`;
}
break;
            
case "faxineiro":
if (chance > 30) {
salario = Math.floor(Math.random() * (empregoData.salarioMax - empregoData.salarioMin)) + empregoData.salarioMin;
textoTrabalho = `Você deixou tudo brilhando enquanto limpava o prédio. Ganhou R$${salario} pelo excelente trabalho!`;
} else if (chance > 7) {
textoTrabalho = "Você escorregou no sabão teve que ir para o hospital e acabou não conseguindo limpar nada hoje.";
} else {
salario = Math.floor(Math.random() * 150) + 100;
textoTrabalho = `Você encontrou dinheiro escondido enquanto limpava um armário e ganhou R$${salario} extras!`;
}
break;

case "garcom":
if (chance > 30) {
salario = Math.floor(Math.random() * (empregoData.salarioMax - empregoData.salarioMin)) + empregoData.salarioMin;
textoTrabalho = `Você atendeu vários clientes e recebeu muitas gorjetas. Salário do dia: R$${salario}.`;
} else if (chance > 7) {
textoTrabalho = "Um cliente reclamou do serviço, e você não ganhou nada hoje.";
} else {
salario = Math.floor(Math.random() * 180) + 200;
textoTrabalho = `Sorte grande! Um cliente rico deixou uma gorjeta enorme, e você ganhou R$${salario}!`;
}
break;

case "motorista":
if (chance > 30) {
salario = Math.floor(Math.random() * (empregoData.salarioMax - empregoData.salarioMin)) + empregoData.salarioMin;
textoTrabalho = `Você transportou várias pessoas com segurança e recebeu R$${salario} pelo serviço.`;
} else if (chance > 7) {
textoTrabalho = "Voce teve um pneu furado no meio do caminho e perdeu o dia de trabalho.";
} else {
salario = Math.floor(Math.random() * 200) + 200;
textoTrabalho = `Sorte grande! Você foi contratado para uma viagem especial e ganhou R$${salario}!`;
}
break;

case "vendedor":
if (chance > 30) {
salario = Math.floor(Math.random() * (empregoData.salarioMax - empregoData.salarioMin)) + empregoData.salarioMin;
textoTrabalho = `Você vendeu muitos produtos e bateu a meta! Recebeu R$${salario}.`;
} else if (chance > 7) {
textoTrabalho = "Foi um dia difícil, nenhum cliente quis comprar nada.";
} else {
salario = Math.floor(Math.random() * 250) + 300;
textoTrabalho = `Sorte grande! Você fechou uma venda enorme e ganhou R$${salario}!`;
}
break;
            
case "cozinheiro":
if (chance > 30) {
salario = Math.floor(Math.random() * (empregoData.salarioMax - empregoData.salarioMin)) + empregoData.salarioMin;
textoTrabalho = `O restaurante estava muito movimentado hoje, você cozinhou vários pratos e recebeu R$${salario}.`;
} else if (chance > 7) {
textoTrabalho = "Seu chefe esta treinando um chefe substituto por isso você não foi trabalhar hoje e não recebeu nada.";
} else {
salario = Math.floor(Math.random() * 280) + 300;
textoTrabalho = `Sorte grande! Um dos clientes do restaurante te contratou para um evento privado e você recebeu R$${salario}!`;
}
break;
            
case "professor":
if (chance > 30) {
salario = Math.floor(Math.random() * (empregoData.salarioMax - empregoData.salarioMin)) + empregoData.salarioMin;
textoTrabalho = `Voce passou o dia inteiro aguentando um monte de crianças chatas e recebeu apenas R$${salario} por isso.`;
} else if (chance > 7) {
textoTrabalho = "Sua escola estava de paralisação hoje então você não foi trabalhar (escola pública né).";
} else {
salario = Math.floor(Math.random() * 300) + 350;
textoTrabalho = `Um de seus alunos precisou de uma aula de reforço particular e te pagou R$${salario} por isso!`;
}
break;
            
case "engenheiro":
if (chance > 30) {
salario = Math.floor(Math.random() * (empregoData.salarioMax - empregoData.salarioMin)) + empregoData.salarioMin;
textoTrabalho = `Voce trabalhou bastante e recebeu R$${salario}.`;
} else {
textoTrabalho = "Você cometeu um erro nos seus cálculos e por isso não ira receber nada.";
}
break;
            
case "policial":
if (chance > 30) {
salario = Math.floor(Math.random() * (empregoData.salarioMax - empregoData.salarioMin)) + empregoData.salarioMin;
textoTrabalho = `Voce prendeu mais de 10 pessoas hoje e juntando seu salário e as comissões você recebeu R$${salario} por isso.`;
} else if (chance > 7) {
textoTrabalho = "Hoje era seu dia de folga.";
} else {
salario = Math.floor(Math.random() * 350) + 390;
textoTrabalho = `Voce recebeu R$${salario} para deixar um caminhão passar sem parar ele, você não sabia do que se tratava mas aceitou.`;
}
break
            
case "advogado":
if (chance > 30) {
salario = Math.floor(Math.random() * (empregoData.salarioMax - empregoData.salarioMin)) + empregoData.salarioMin;
textoTrabalho = `Voce trabalhou duro e recebeu R$${salario} de seu cliente por isso.`;
} else if (chance > 7) {
textoTrabalho = "Você perdeu o caso, seu cliente te processou e você teve que devolver todo o valor recebido dele.";
} else {
salario = Math.floor(Math.random() * 500) + 500;
textoTrabalho = `Um presidente te contratou, e você recebeu R$${salario} por isso!`;
}
break
            
case "medico":
if (chance > 30) {
salario = Math.floor(Math.random() * (empregoData.salarioMax - empregoData.salarioMin)) + empregoData.salarioMin;
textoTrabalho = `Hoje foi um dia bem movimentado do hospital, você trabalhou muito e recebeu R$${salario} por isso.`;
} else if (chance > 7) {
textoTrabalho = "Você passou mal hoje e quem precisou ser atendido foi você.";
} else {
salario = Math.floor(Math.random() * 650) + 600;
textoTrabalho = `Voce foi contratado para fazer um atendimento particular e recebeu R$${salario} por isso!`;
}
break

default:
textoTrabalho = "Esse emprego ainda não teve as mensagens e os valores configurados, avise meu dono sobre isso.";
break;
}
    
if (!delay[sender]) delay[sender] = {};
delay[sender]['trabalhar'] = now + (2 * 60 * 1000);

if(!dadosUser.xpEmprego) dadosUser.xpEmprego = 0;
const xpGanho = salario > 0 ? 1 : 0.5;
dadosUser.xpEmprego += xpGanho;
    
const proximoEmprego = empregos.find(e => e.xpNecessaria > empregoData.xpNecessaria && e.xpNecessaria <= dadosUser.xpEmprego);
if (proximoEmprego) {
textoTrabalho += `\n\nQuando estava saindo do seu turno você recebeu uma ligação, era uma proposta de emprego, agora você pode trabalhar de ${proximoEmprego.nome} 🥳🥳.`;
};

await saveUser(sender, dadosUser);
if (salario > 0) await addSaldo(sender, salario);
return {message: textoTrabalho};
//DEMOREI UMA HORA PRA FAZER ESSA MERDA DE SISTEMA DE TRABALHO, SE ESSA PORRA VAZAR NUNCA PERDOAREI VOCÊ.
} catch (e) {
 console.error(e);
 return false;
}
};

//FUNÇÃO DE COMPRAR ITENS
async function comprarItem(sender, itemName) {
try { 
const item = itensLoja.find(i => i.nome === itemName); 
if (!item) return { message: "Este item não esta disponível na loja, digite #prefix#loja para ver os itens disponíveis." };
const dadosUser = await getUser(sender);
if (!dadosUser) return false;
if (dadosUser.saldo.carteira < item.valor) return { message: "Você não tem dinheiro suficiente para comprar este item.\n\n> Talvez seu dinheiro esteja no banco, para realizar uma compra é preciso sacar o dinheiro." };
await delSaldo(sender, item.valor);
await addItem(sender, itemName);
return { message: `Você comprou um(a) ${itemName} por R$${item.valor}, o item ja esta no seu inventario.` };
} catch (e) {
console.error(e);
return false;
}};

//FUNÇÃO DE VENDER ITENS 
async function venderItem(sender, itemName, quantidade = 1) { 
try { 
const item = itensVenda.find(i => i.nome === itemName) || itensLoja.find(i => i.nome === itemName); 
if (!item) return { message: "Este item não pode ser vendido." };
const dadosUser = await getUser(sender);
if (!dadosUser) return false;
if (!dadosUser.inventario[itemName] || dadosUser.inventario[itemName] < quantidade) return { message: `Voce nao tem ${quantidade} ${itemName}, é impossível realizar esta venda\n\n> Quantidade de ${itemName} no seu inventario: ${dadosUser.inventario[itemName] ? dadosUser.inventario[itemName] : 0}.` };
const ganho = item.venda * quantidade;
await addSaldo(sender, ganho);
await removeItem(sender, itemName, quantidade);
return { message: `Você vendeu ${quantidade}x ${itemName} por R$${ganho}.` };
} catch (e) {
console.error(e);
return false;
}};

//FUNÇÃO PARA REALIZAR PESCARIA 
async function pescar(sender) {
    try {
        const dadosUser = await getUser(sender);
        if (!dadosUser) return { message: "Usuário não encontrado." };

        if (!dadosUser.inventario["isca"] || dadosUser.inventario["isca"] <= 0) {
            return { message: "Você não tem iscas suficientes para pescar." };
        }

        const agora = Date.now();
        if (!dadosUser.delay) dadosUser.delay = {};
        if (dadosUser.delay.pescar && agora < dadosUser.delay.pescar) {
            const restante = Math.ceil((dadosUser.delay.pescar - agora) / 1000);
            return { message: `O lago está muito agitado! Espere ${restante} segundos antes de pescar novamente.` };
        }

        const peixes = Math.floor(Math.random() * 11) + 5;
        
        if (!dadosUser.delay) dadosUser.delay = {};
        
        dadosUser.delay.pescar = agora + 2 * 60 * 1000; // 2 minutos de delay
        await saveUser(sender, dadosUser);
       
        await removeItem(sender, "isca", 1);
        await addItem(sender, "peixe", peixes);
        
        return { message: `🎣 Você pescou ${peixes} peixes! Parabéns pela pescaria!` };
    } catch (e) {
        console.error(e);
        return { message: "Ocorreu um erro durante a pescaria." };
    }
}

//FUNÇÃO PARA REALIZAR UMA CAÇA
async function realizarCaca(sender) {
    try {
        dadosUser = await getUser(sender);
        if (!dadosUser) return { message: "Usuário não encontrado." };

        if ((!dadosUser.inventario["arma"] || dadosUser.inventario["arma"] <= 0) ||
            (!dadosUser.inventario["municao"] || dadosUser.inventario["municao"] <= 0)) {
            return { message: "Você precisa de uma arma e munição para caçar." };
        }

        const agora = Date.now();
        if (!dadosUser.delay) dadosUser.delay = {};
        if (dadosUser.delay.cacar && agora < dadosUser.delay.cacar) {
            const restante = Math.ceil((dadosUser.delay.cacar - agora) / 1000);
            return { message: `Os animais estão escondidos! Espere ${restante} segundos antes de tentar caçar novamente.` };
        }

        const chanceDeQuebra = Math.random() < 0.2;
        const carnes = Math.floor(Math.random() * 11) + 10;

        if (chanceDeQuebra) {
            await removeItem(sender, "arma", 1);
            return { message: `Sua arma quebrou após a caça, mas você conseguiu ${carnes} carnes!` };
        }
        
        dadosUser = await getUser(sender);
        
        if (!dadosUser.delay) dadosUser.delay = {};
                
        dadosUser.delay.cacar = agora + 4 * 60 * 1000;
        await saveUser(sender, dadosUser);
        
        await removeItem(sender, "municao", 1);
        await addItem(sender, "carne", carnes);

        return { message: `🐗 Você caçou e conseguiu ${carnes} carnes!` };
    } catch (e) {
        console.error(e);
        return { message: "Ocorreu um erro durante a caça." };
    }
}

//FUNÇÃO PARA REALIZAR UMA MINERAÇÃO
async function minerar(sender) {
    try {
        dadosUser = await getUser(sender);
        if (!dadosUser) return { message: "Usuário não encontrado." };

        if (!dadosUser.inventario.picareta || dadosUser.inventario.picareta <= 0) {
            return { message: "Você precisa de uma picareta para minerar." };
        }

        const agora = Date.now();
        if (!dadosUser.delay) dadosUser.delay = {};
        if (dadosUser.delay.minerar && agora < dadosUser.delay.minerar) {
            const restante = Math.ceil((dadosUser.delay.minerar - agora) / 1000);
            return { message: `A mina está fechada para manutenção! Espere ${restante} segundos antes de tentar minerar novamente.` };
        }

        const minerios = [
            { nome: "carvao", chance: 50 },
            { nome: "ferro", chance: 30 },
            { nome: "prata", chance: 20 },
            { nome: "ouro", chance: 15 },
            { nome: "diamante", chance: 5 },
            { nome: "esmeralda", chance: 3 }
        ];
        const ganhos = [];

        for (const minerio of minerios) {
            if (Math.random() * 100 < minerio.chance) {
                const quantidade = Math.floor(Math.random() * 3) + 1;
                ganhos.push({ nome: minerio.nome, quantidade });
                await addItem(sender, minerio.nome, quantidade);
            }
        }

        if (Math.random() < 0.25) {
            await removeItem(sender, "picareta", 1);
            ganhos.push({ nome: "picareta quebrada", quantidade: 1 });
        }
        
        dadosUser = await getUser(sender);
        
        if (!dadosUser.delay) dadosUser.delay = {};
        
        dadosUser.delay.minerar = agora + 3 * 60 * 1000; // 3 minutos de delay
        await saveUser(sender, dadosUser);

        const ganhoTexto = ganhos.length
            ? ganhos.map(g => `${g.quantidade}x ${g.nome}`).join(", ")
            : "nada";
        return { message: `⛏️ Você minerou e encontrou: ${ganhoTexto}.` };
    } catch (e) {
        console.error(e);
        return { message: "Ocorreu um erro durante a mineração." };
    }
}

//FUNÇÃO PARA RENDERIZAR O INVENTÁRIO
async function renderizarInventario(sender) {
try {
const dadosUser = await getUser(sender);
if (!dadosUser) return false
const inventario = dadosUser.inventario;
if (!inventario || Object.keys(inventario).length === 0) return {message: "🛒 *Seu inventário está vazio.*"};
let resposta = "📦 *Inventário* 📦\n\n";
Object.keys(inventario).forEach(item => {
resposta += `- *${item}*: ${inventario[item]}\n`;
});
return {message: resposta.trim()};
} catch (e) {
console.error(e);
return "Erro ao renderizar o inventário.";
}};

//FUNÇÃO PARA RENDERIZAR TODAS AS INFORMAÇÕES DO USUÁRIO
async function renderizarInformacoesUsuario(sender) {
try {
const dadosUser = await getUser(sender);
if (!dadosUser) return false;
const { nome, saldo, emprego, xpEmprego, inventario } = dadosUser;
const inventarioTexto = inventario && Object.keys(inventario).length > 0 ? Object.keys(inventario).map(item => `- *${item}*: ${inventario[item]}`).join("\n") : "- Nenhum item";
const resposta = `👤 *Informações do Usuário*\n---------------------------------\n- *Nome*: ${nome || "Desconhecido"}\n- *Emprego*: ${emprego || "Desempregado"}\n\n- *Saldo No Banco*: ${saldo?.banco || 0} 🏦\n- *Saldo Na Carteira*: ${saldo?.carteira || 0} 💵\n\n📦 *Inventário*:\n${inventarioTexto}\n---------------------------------`.trim();
return {message: resposta};
} catch (e) {
console.error(e);
return false;
}};

// FUNÇÃO PARA REALIZAR UM ASSALTO
async function assaltar(sender, alvo) {
    try {
        const dadosUser = await getUser(sender);
        const dadosAlvo = await getUser(alvo);

        if (!dadosUser || !dadosAlvo) return { message: "Um dos usuários não está registrado no RPG." };

        if (!dadosUser.inventario.faca || dadosUser.inventario.faca < 1) {
            return { message: "Você precisa de uma faca para realizar um assalto." };
        }

        const agora = Date.now();
        if (!dadosUser.delay) dadosUser.delay = {};
        if (dadosUser.delay.assaltar && agora < dadosUser.delay.assaltar) {
            const restante = Math.ceil((dadosUser.delay.assaltar - agora) / 1000);
            return { message: `Você está sendo procurado pela polícia! Espere ${restante} segundos antes de tentar outro assalto.` };
        }

        if (dadosAlvo.inventario.escudo && dadosAlvo.inventario.escudo > 0) {
            if (Math.random() * 100 < 20) {
            dadosUser.delay.assaltar = agora + 5 * 60 * 1000;
            await saveUser(sender, dadosUser);
                await removeItem(alvo, "escudo", 1);
                return { message: `Seu alvo estava protegido por um escudo! O escudo quebrou, mas você não conseguiu realizar o assalto.` };
            }
            dadosUser.delay.assaltar = agora + 5 * 60 * 1000;
            await saveUser(sender, dadosUser);
            return { message: "Seu alvo estava protegido por um escudo! Você não conseguiu realizar o assalto." };
        }

        const chanceSucesso = Math.random() * 100;
        const dinheiroAlvo = dadosAlvo.saldo.carteira;

        if (chanceSucesso > 30) {
            const valorRoubado = Math.floor(dinheiroAlvo > 500 ? 500 : dinheiroAlvo * (Math.random() * 0.5 + 0.1));
            dadosUser.delay.assaltar = agora + 5 * 60 * 1000;
            await saveUser(sender, dadosUser);
            await addSaldo(sender, valorRoubado);
            await delSaldo(alvo, valorRoubado);
            return { message: `💰 Assalto bem-sucedido! Você roubou R$${valorRoubado} de ${dadosAlvo.nome}. Corra antes que a polícia chegue!` };
        } else if (chanceSucesso > 40) {
            return { message: "O alvo percebeu o assalto e conseguiu escapar! Você não roubou nada desta vez." };
        } else {
            await removeItem(sender, 'faca', 1);
            return { message: "O alvo reagiu ao assalto e conseguiu tomar sua faca! Você perdeu a arma e não conseguiu nada." };
        }
    } catch (e) {
        console.error(e);
        return { message: "Ocorreu um erro durante o assalto." };
    }
}

// PEDIR EM CASAMENTO
async function pedirCasamento(sender) {
    const dadosUser = await getUser(sender);

    if (!dadosUser.relacionamento) dadosUser.relacionamento = {};

    if (dadosUser.relacionamento.tipo !== "namoro") return { message: "💍 Você precisa estar em um namoro para fazer o pedido de casamento." };

    const parceiroId = dadosUser.relacionamento.parceiro;
    const dadosParceiro = await getUser(parceiroId);

    if (!dadosParceiro || !dadosParceiro.relacionamento) return { message: "Parece que houve um problema ao encontrar sua dupla. Tente novamente mais tarde." };

    const tempoNamoro = (Date.now() - dadosUser.relacionamento.inicio) / (1000 * 60 * 60 * 24);
    if (tempoNamoro < 5) return { message: "⏳ Você precisa estar namorando há pelo menos 5 dias antes de fazer o pedido de casamento." };

    dadosParceiro.relacionamento.pedido = sender;
    dadosParceiro.relacionamento.tipo = "casamento";
    await saveUser(parceiroId, dadosParceiro);

    return { message: `💍 Pedido de casamento enviado para ${dadosParceiro.nome}! Será que vocês darão o próximo grande passo? 💕\n\n> Digite !aceitar para aceitar e !recusar para recusar` };
}

//RECUSAR PEDIDO
async function recusarPedido(sender) {
    const dadosUser = await getUser(sender);

    if (!dadosUser.relacionamento) dadosUser.relacionamento = {};

    if (!dadosUser.relacionamento.pedido) return { message: "📭 Você não tem pedidos pendentes para recusar." };

    const parceiroId = dadosUser.relacionamento.pedido;
    const dadosParceiro = await getUser(parceiroId);

    if (dadosParceiro && dadosParceiro.relacionamento) {
        dadosParceiro.relacionamento.pedido = null;
        await saveUser(parceiroId, dadosParceiro);
    }

    dadosUser.relacionamento.pedido = null;
    await saveUser(sender, dadosUser);

    return { message: `💔 Sinto muito, ${dadosParceiro ? dadosParceiro.nome : "alguém"}! ${dadosUser.nome} decidiu recusar o pedido. O amor pode ser complicado às vezes...` };
}

// ACEITAR PEDIDO
async function aceitarPedido(sender) {
    const dadosUser = await getUser(sender);

    if (!dadosUser.relacionamento) dadosUser.relacionamento = {};

    if (!dadosUser.relacionamento.pedido) return { message: "📭 Você não tem pedidos pendentes." };

    const parceiroId = dadosUser.relacionamento.pedido;
    const dadosParceiro = await getUser(parceiroId);

    if (!dadosParceiro) return { message: "Erro ao encontrar o remetente do pedido. Parece que ele(a) desapareceu! 😢" };

    if (!dadosParceiro.relacionamento) dadosParceiro.relacionamento = {};

    // Verifica se o pedido é de namoro ou casamento
    if (dadosUser.relacionamento.tipo === "casamento" && dadosParceiro.relacionamento.tipo === "namoro") {
        // Promover para casamento
        dadosUser.relacionamento.tipo = "casamento";
        dadosParceiro.relacionamento.tipo = "casamento";

        dadosUser.relacionamento.pedido = null;
        dadosParceiro.relacionamento.pedido = null;

        await saveUser(sender, dadosUser);
        await saveUser(parceiroId, dadosParceiro);

        return { message: `💍 Parabéns! Agora vocês estão oficialmente casados. Que a felicidade seja infinita! 🎉` };
    } else if (!dadosUser.relacionamento.parceiro) {
        // Caso seja um pedido de namoro
        dadosUser.relacionamento.parceiro = parceiroId;
        dadosUser.relacionamento.tipo = "namoro";
        dadosUser.relacionamento.inicio = Date.now();
        dadosUser.relacionamento.pedido = null;

        dadosParceiro.relacionamento.parceiro = sender;
        dadosParceiro.relacionamento.tipo = "namoro";
        dadosParceiro.relacionamento.inicio = Date.now();
        dadosParceiro.relacionamento.pedido = null;

        await saveUser(sender, dadosUser);
        await saveUser(parceiroId, dadosParceiro);

        return { message: `🌹 Parabéns! ${dadosParceiro.nome} aceitou seu pedido de namoro. Que vocês vivam muitas aventuras juntos! 🥰` };
    }

    return { message: "Algo deu errado! Verifique o status do relacionamento e tente novamente." };
}

//VER INFORMAÇÕES DA DUPLA
async function mostrarDupla(sender) {
    const dadosUser = await getUser(sender);

    if (!dadosUser.relacionamento || !dadosUser.relacionamento.parceiro) {
        return { message: "📭 Você não está em um relacionamento no momento. Talvez seja a hora de buscar sua outra metade!" };
    }

    const parceiroId = dadosUser.relacionamento.parceiro;
    const dadosParceiro = await getUser(parceiroId);

    const inicio = new Date(dadosUser.relacionamento.inicio);
    const inicioFormatado = inicio.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    const tempoTotal = Date.now() - dadosUser.relacionamento.inicio;

    const dias = Math.floor(tempoTotal / (1000 * 60 * 60 * 24));
    const horas = Math.floor((tempoTotal % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((tempoTotal % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((tempoTotal % (1000 * 60)) / 1000);

    return {
        message: `💑 *Informações do Relacionamento* 💑\n\n👤 *Parceiro*: ${dadosParceiro.nome}\n📅 *Início do Namoro*: ${inicioFormatado}\n⏳ *Tempo Juntos*: ${dias} dias, ${horas} horas, ${minutos} minutos e ${segundos} segundos.\n\n💍 *Status*: ${dadosUser.relacionamento.tipo === "casamento" ? "Casados" : "Namorando"}`
    };
}
// REALIZAR PEDIDO DE NAMORO
async function pedirNamoro(sender, alvo) {
    const dadosUser = await getUser(sender);
    const dadosAlvo = await getUser(alvo);

    if (!dadosUser || !dadosAlvo) return { message: "Um dos usuários não está registrado no RPG." };

    if (!dadosUser.relacionamento) dadosUser.relacionamento = {};
    if (!dadosAlvo.relacionamento) dadosAlvo.relacionamento = {};

    if (dadosUser.relacionamento.parceiro) return { message: "💔 Você já está em um relacionamento! Não pode pedir outra pessoa em namoro." };
    if (dadosAlvo.relacionamento.parceiro) return { message: "💔 Infelizmente, essa pessoa já está em um relacionamento." };

    dadosAlvo.relacionamento.pedido = sender;
    await saveUser(alvo, dadosAlvo);

    return { message: `💌 Pedido enviado! Agora só resta esperar... Será que ${dadosAlvo.nome} aceitará ser sua dupla? O destino decidirá!\n\n> Digite !aceitar para aceitar e !recusar para recusar` };
}

//REALIZAR DIVORCIO
async function divorcio(sender, confirmacao) {
    if (confirmacao !== "1") return { message: "💔 Tem certeza que deseja se separar? Digite `!divorcio 1` para confirmar sua decisão." };

    const dadosUser = await getUser(sender);

    if (!dadosUser.relacionamento) dadosUser.relacionamento = {};

    if (!dadosUser.relacionamento.parceiro) return { message: "📭 Você não está em um relacionamento para se divorciar. Talvez seja um sinal para não desistir do amor! 💕" };

    const parceiroId = dadosUser.relacionamento.parceiro;
    const dadosParceiro = await getUser(parceiroId);

    if (dadosParceiro && dadosParceiro.relacionamento) {
        dadosParceiro.relacionamento = null;
        await saveUser(parceiroId, dadosParceiro);
    }

    dadosUser.relacionamento = null;
    await saveUser(sender, dadosUser);

    return { message: "💔 Que triste! O amor entre vocês chegou ao fim. Que vocês encontrem novos caminhos de felicidade." };
}

// CONSTANTES
const CUSTO_TOSA = 200;
const CUSTO_VETERINARIO = 500;

// ESTRUTURA INICIAL DO PET
const petInicial = {
    nome: "",
    tipo: "",
    fome: 50,
    felicidade: 50,
    limpeza: 50,
    saude: 50,
    ultimaAlimentacao: null,
    ultimoBanho: null,
    ultimaTosa: null,
    ultimaVisitaVeterinario: null,
    ultimaInteracao: null
};

// ATUALIZA OS ATRIBUTOS DO PET
async function atualizarAtributosPet(sender) {
    const dadosUser = await getUser(sender);
    if (!dadosUser.pet) return false;

    const pet = dadosUser.pet;
    const agora = Date.now();

    const tempoDesdeUltimaAlimentacao = pet.ultimaAlimentacao ? (agora - pet.ultimaAlimentacao) / (1000 * 60) : agora;
    const tempoDesdeUltimoBanho = pet.ultimoBanho ? (agora - pet.ultimoBanho) / (1000 * 60) : agora;
    const tempoDesdeUltimaInteracao = pet.ultimaInteracao ? (agora - pet.ultimaInteracao) / (1000 * 60) : agora;

    // Calcula deterioração
    const fomeDelta = tempoDesdeUltimaAlimentacao * 0.4; // Reduzida para desacelerar
    const limpezaDelta = tempoDesdeUltimoBanho * 0.2;
    const felicidadeDelta = tempoDesdeUltimaInteracao * 0.3 + pet.fome * 0.05; // Felicidade cai mais rápido se a fome for alta
    const saudeDelta = (100 - pet.limpeza) * 0.02 + (100 - pet.felicidade) * 0.02; // Saúde cai por falta de limpeza e felicidade

    // Atualiza estados
    pet.fome = Math.min(100, pet.fome + fomeDelta);
    pet.limpeza = Math.max(0, pet.limpeza - limpezaDelta);
    pet.felicidade = Math.max(0, Math.min(100, pet.felicidade - felicidadeDelta));
    pet.saude = Math.max(0, Math.min(100, pet.saude - saudeDelta));

    pet.ultimaInteracao = agora;

    await saveUser(sender, dadosUser);
    return true;
}

// ADOTAR UM PET
async function adotarPet(sender, nome, tipo) {
    const dadosUser = await getUser(sender);

    if (!dadosUser) return { message: "⚠️ Você precisa estar registrado no RPG para adotar um pet." };
    if (dadosUser.pet) return { message: "⚠️ Você já possui um pet! Solte o atual antes de adotar outro." };
    if (!nome || nome.length > 15) return { message: "⚠️ O nome deve ter no máximo 15 caracteres." };
    if (!["cachorro", "gato", "capivara"].includes(tipo.toLowerCase())) {
        return { message: "⚠️ Tipo de pet inválido. Escolha entre *cachorro*, *gato* ou *capivara*." };
    }

    dadosUser.pet = { ...petInicial, nome, tipo: tipo.toLowerCase() };
    await saveUser(sender, dadosUser);

    return { message: `🎉 *Parabéns!* Você adotou um(a) ${tipo} chamado(a) *${nome}*. Cuide bem dele(a) e aproveite a companhia!` };
}

// FAZER CARINHO NO PET
async function fazerCarinho(sender) {
    const dadosUser = await getUser(sender);
    if (!dadosUser.pet) return { message: "⚠️ Você não tem um pet. Adote um primeiro!" };

    const pet = dadosUser.pet;

    // Felicidade aumenta proporcionalmente
    pet.felicidade = Math.min(100, pet.felicidade + 15);
    pet.ultimaInteracao = Date.now();

    await saveUser(sender, dadosUser);

    return { message: `💖 Você fez carinho em *${pet.nome}*. Ele(a) parece mais feliz e satisfeito agora!` };
}

// BRINCAR COM O PET
async function brincarPet(sender) {
    const dadosUser = await getUser(sender);
    if (!dadosUser.pet) return { message: "⚠️ Você não tem um pet. Adote um primeiro!" };

    const pet = dadosUser.pet;

    // Reduz fome, aumenta felicidade
    pet.fome = Math.min(100, pet.fome + 15);
    pet.felicidade = Math.min(100, pet.felicidade + 20);
    pet.ultimaInteracao = Date.now();

    await saveUser(sender, dadosUser);

    return { message: `🎾 Você brincou com *${pet.nome}*. Ele(a) está cheio de energia, mas parece um pouco mais faminto agora!` };
}

// SOLTAR O PET
async function soltarPet(sender) {
    const dadosUser = await getUser(sender);
    if (!dadosUser.pet) return { message: "⚠️ Você não possui um pet para soltar." };

    const pet = dadosUser.pet;
    dadosUser.pet = null;

    await saveUser(sender, dadosUser);
    return { message: `💔 Você soltou seu pet *${pet.nome}*. Ele(a) sentirá saudades, mas está em boas mãos na natureza.` };
}

// ALIMENTAR O PET
async function alimentarPet(sender) {
    const dadosUser = await getUser(sender);
    if (!dadosUser.pet) return { message: "⚠️ Você não tem um pet. Adote um primeiro!" };

    const pet = dadosUser.pet;
    if (!dadosUser.inventario.racao || dadosUser.inventario.racao <= 0) {
        return { message: "🍽️ Você não possui *ração* no inventário. Compre na loja para alimentar seu pet." };
    }

    pet.fome = Math.max(0, pet.fome - 20);
    pet.felicidade = Math.min(100, pet.felicidade + 10);
    pet.ultimaAlimentacao = Date.now();

    await saveUser(sender, dadosUser);
    
    await removeItem(sender, "racao", 1);

    return { message: `🍖 Você alimentou *${pet.nome}*. Ele(a) parece satisfeito e está mais feliz agora!` };
}

// DAR BANHO
async function darBanho(sender) {
    const dadosUser = await getUser(sender);
    if (!dadosUser.pet) return { message: "⚠️ Você não tem um pet. Adote um primeiro!" };

    const pet = dadosUser.pet;
    pet.limpeza = 100;
    pet.ultimoBanho = Date.now();

    await saveUser(sender, dadosUser);

    return { message: `🚿 Você deu um banho em *${pet.nome}*. Ele(a) está limpinho e muito confortável agora!` };
}

// TOSAR O PET
async function tosarPet(sender) {
    const dadosUser = await getUser(sender);
    if (!dadosUser.pet) return { message: "⚠️ Você não tem um pet. Adote um primeiro!" };

    if (dadosUser.saldo.carteira < CUSTO_TOSA) {
        return { message: "⚠️ Você não possui saldo suficiente para pagar a tosa! (Custa R$200)." };
    }

    dadosUser.saldo.carteira -= CUSTO_TOSA;
    const pet = dadosUser.pet;

    pet.felicidade = 100;
    pet.ultimaTosa = Date.now();

    await saveUser(sender, dadosUser);

    return { message: `✂️ Você levou *${pet.nome}* para tosar. Ele(a) está mais bonito(a) e feliz agora!` };
}

// LEVAR AO VETERINÁRIO
async function levarAoVeterinario(sender) {
    const dadosUser = await getUser(sender);
    if (!dadosUser.pet) return { message: "⚠️ Você não tem um pet. Adote um primeiro!" };

    if (dadosUser.saldo.carteira < CUSTO_VETERINARIO) {
        return { message: "⚠️ Você não possui saldo suficiente para pagar o veterinário! (Custa R$500)." };
    }

    dadosUser.saldo.carteira -= CUSTO_VETERINARIO;
    const pet = dadosUser.pet;

    pet.saude = 100;
    pet.ultimaVisitaVeterinario = Date.now();

    await saveUser(sender, dadosUser);

    return { message: `🏥 Você levou *${pet.nome}* ao veterinário. Ele(a) está saudável e feliz agora!` };
}

// VER STATUS DO PET
async function verPet(sender) {
    const dadosUser = await getUser(sender);
    if (!dadosUser.pet) return { message: "⚠️ Você não tem um pet. Adote um primeiro!" };

    const pet = dadosUser.pet;

    return {
        message: `
🐾 *Status do Pet* 🐾
- Nome: *${pet.nome}*
- Tipo: *${pet.tipo}*
- Fome: *${pet.fome.toFixed(2)}%*
- Felicidade: *${pet.felicidade.toFixed(2)}%*
- Limpeza: *${pet.limpeza.toFixed(2)}%*
- Saúde: *${pet.saude.toFixed(2)}%*
        `.trim()
    };
}

// PASSEAR COM O PET
async function passearPet(sender) {
    const dadosUser = await getUser(sender);
    if (!dadosUser.pet) return { message: "⚠️ Você não tem um pet. Adote um primeiro!" };

    const pet = dadosUser.pet;

    // Passeios aumentam felicidade e saúde, mas também consomem energia (fome aumenta)
    const felicidadeGanho = Math.max(10, 30 - pet.fome * 0.2); // Ganha menos felicidade se o pet estiver com fome
    const saudeGanho = Math.max(5, 20 - (100 - pet.limpeza) * 0.1); // Ganha menos saúde se o pet estiver sujo
    const fomeGanho = 10; // Passear aumenta a fome

    pet.felicidade = Math.min(100, pet.felicidade + felicidadeGanho);
    pet.saude = Math.min(100, pet.saude + saudeGanho);
    pet.fome = Math.min(100, pet.fome + fomeGanho);
    pet.ultimaInteracao = Date.now();

    await saveUser(sender, dadosUser);

    // Mensagem personalizada
    return { 
        message: `
🏞️ Você passeou com *${pet.nome}*. 
Ele(a) está mais feliz (+${felicidadeGanho}%) e saudável (+${saudeGanho}%), mas parece um pouco mais faminto (+${fomeGanho}%).
        `.trim()
    };
}


// Lista de frutas disponíveis
const frutas = ["🍎", "🍌", "🍒", "🍇", "🍍", "🍉"];

// Função do cassino
async function cassino(sender, aposta) {
    if (!aposta || aposta < 150) {
        return { message: "⚠️ A aposta mínima é de R$150. Tente novamente com um valor maior ou igual." };
    }

    const dadosUser = await getUser(sender);

    if (dadosUser.saldo.carteira < aposta) {
        return { message: "⚠️ Você não tem saldo suficiente para essa aposta." };
    }

    await delSaldo(sender, aposta);

    const rodada = [
        frutas[Math.floor(Math.random() * frutas.length)],
        frutas[Math.floor(Math.random() * frutas.length)],
        frutas[Math.floor(Math.random() * frutas.length)]
    ];

    const [f1, f2, f3] = rodada;
    let resultado = "💔 *Você perdeu!* Melhor sorte na próxima.";
    let premio = 0;
    if (Math.random() <= 0.4) {
        if (f1 === f2 && f2 === f3) {
            premio = aposta * 5;
            resultado = `🎉 *Jackpot!* Três frutas iguais: ${f1} ${f2} ${f3}\nVocê ganhou R$${premio.toLocaleString()}!`;
        } else if (f1 === f2 || f2 === f3 || f1 === f3) {
            resultado = `😐 Duas frutas iguais: ${f1} ${f2} ${f3}\nVocê não ganhou nem perdeu nada. Tente novamente!`;
        } else {
            resultado = `💔 *Você perdeu!* As frutas foram: ${f1} ${f2} ${f3}`;
        }
    } else {
        resultado = `💔 *Você perdeu!* As frutas foram: ${f1} ${f2} ${f3}`;
    }

    if (premio > 0) {
        await addSaldo(sender, premio);
    }
    
    return { message: `${resultado}\n\n💰 *Saldo Atual*: R$${(dadosUser.saldo.carteira + premio)}` };
}


// Função para registrar o perfil do Tinder
async function registrarTinder(sender, name, bufferFoto) {
    try {
        if (!name || !bufferFoto) {
            return { message: "⚠️ Nome e foto são obrigatórios para o registro." };
        }

        const upload = await uploadFoto(bufferFoto, sender);
        if (upload.error) return { message: upload.error };

        const dadosUser = await getUser(sender);
        dadosUser.tinder = {
            nome: name,
            foto: upload.url,
            sexo: "Não especificado",
            bio: "Sem bio."
        };

        await saveUser(sender, dadosUser);
        return { message: `✅ Registro concluído com sucesso! Bem-vindo(a), ${name}.` };
    } catch (e) {
        console.error(e);
        return { message: "❌ Erro ao registrar o usuário." };
    }
}

// Função para editar as informações do perfil do Tinder
async function editarPerfil(sender, campo, valor) {
    try {
        const dadosUser = await getUser(sender);
        if (!dadosUser || !dadosUser.tinder) return { message: "⚠️ Você não está registrado no Tinder." };

        switch (campo.toLowerCase()) {
            case 'nome':
                if (!valor) return { message: "⚠️ Nome não pode ser vazio." };
                dadosUser.tinder.nome = valor;
                break;
            case 'sexo':
                dadosUser.tinder.sexo = valor || "Não especificado";
                break;
            case 'bio':
                dadosUser.tinder.bio = valor || "Sem bio.";
                break;
            default:
                return { message: "⚠️ Campo inválido. Use: nome, sexo ou bio." };
        }

        await saveUser(sender, dadosUser);
        return { message: `✅ ${campo.charAt(0).toUpperCase() + campo.slice(1)} atualizado com sucesso!` };
    } catch (e) {
        console.error(e);
        return { message: "❌ Erro ao atualizar o perfil." };
    }
}

// Função para exibir o perfil próprio do Tinder
async function exibirMeuPerfil(sender) {
    try {
        const dadosUser = await getUser(sender);
        if (!dadosUser || !dadosUser.tinder) return { message: "⚠️ Você não está registrado no Tinder." };

        return {
            foto: dadosUser.tinder.foto,
            message: `👤 *Seu Perfil Tinder*\n📄 *Bio*: ${dadosUser.tinder.bio}\n💬 *Sexo*: ${dadosUser.tinder.sexo}\n\n📱 *WhatsApp*: wa.me/${dadosUser.id.split('@')[0]}`
        };
    } catch (e) {
        console.error(e);
        return { message: "❌ Erro ao exibir seu perfil." };
    }
}

// Função para exibir um perfil aleatório com Tinder
async function exibirPerfilAleatorio(sender) {
    try {
        const dadosUser = await getUser(sender);
        if (!dadosUser || !dadosUser.tinder) return { message: "⚠️ Você precisa estar cadastrado no Tinder para usar este comando." };

        const arquivos = await fs.readdir(RpgPath);
        if (arquivos.length === 0) return { message: "⚠️ Nenhum perfil encontrado." };

        let perfilEncontrado = null;

        for (const arquivo of arquivos) {
            const userDados = JSON.parse(await fs.readFile(path.join(RpgPath, arquivo), 'utf-8'));
            if (userDados.tinder) {
                perfilEncontrado = userDados;
                break;
            }
        }

        if (!perfilEncontrado) return { message: "⚠️ Nenhum perfil com Tinder foi encontrado." };

        return {
            foto: perfilEncontrado.tinder.foto,
            message: `👤 *Perfil de ${perfilEncontrado.tinder.nome}*\n📄 *Bio*: ${perfilEncontrado.tinder.bio}\n💬 *Sexo*: ${perfilEncontrado.tinder.sexo}\n\n📱 *WhatsApp*: wa.me/${perfilEncontrado.id.split('@')[0]}`
        };
    } catch (e) {
        console.error(e);
        return { message: "❌ Erro ao buscar um perfil aleatório." };
    }
}

// Função para verificar se o usuário tem Tinder antes de usar comandos
async function verificarTinder(sender) {
    const dadosUser = await getUser(sender);
    return !!(dadosUser && dadosUser.tinder);
}

// Função para alterar a foto do perfil no Tinder
async function alterarFoto(sender, bufferFoto) {
    try {
        const dadosUser = await getUser(sender); // Busca os dados do usuário
        if (!dadosUser || !dadosUser.tinder) {
            return { message: "⚠️ Você não está registrado no Tinder." };
        }

        // Faz o upload da nova foto no GitHub
        const upload = await uploadFoto(bufferFoto, sender);
        if (upload.error) {
            return { message: upload.error };
        }

        // Atualiza a URL da foto no perfil do Tinder
        dadosUser.tinder.foto = upload.url;
        await saveUser(sender, dadosUser); // Salva as alterações no arquivo do usuário

        return { message: "✅ Foto de perfil atualizada com sucesso!" };
    } catch (error) {
        console.error(error);
        return { message: "❌ Erro ao atualizar a foto de perfil." };
    }
}


// EXPORTS
const objectExport = Object.assign(getUser, {
    rg: rgUser,
    del: delUser,
    trabalhar: trabalhar,
    empregos: listarEmpregos,
    loja: GerarLoja,
    comprar: comprarItem,
    vender: venderItem,
    itens: renderizarInventario,
    me: renderizarInformacoesUsuario,
    cassino: cassino,
    acao: {
        minerar: minerar,
        cacar: realizarCaca,
        assaltar: assaltar,
        pescar: pescar
    },
    emprego: {
        add: entrarEmprego,
        del: sairEmprego
    },
    saldo: {
        add: addSaldo,
        del: delSaldo
    },
    banco: {
        add: addSaldoBank,
        del: delSaldoBank
    },
    inventario: {
        add: addItem,
        remove: removeItem
    },
    relacionamento: {
        namorar: pedirNamoro,
        aceitar: aceitarPedido,
        recusar: recusarPedido,
        divorciar: divorcio,
        casar: pedirCasamento,
        minhaDupla: mostrarDupla
    },
    pet: {
        atualizar: atualizarAtributosPet,
        adotar: adotarPet,
        soltar: soltarPet,
        alimentar: alimentarPet,
        banho: darBanho,
        tosar: tosarPet,
        veterinario: levarAoVeterinario,
        status: verPet,
        brincar: brincarPet,
        passear: passearPet,
        carinho: fazerCarinho
    },
    tinder: {
        registrar: registrarTinder,
        editar: editarPerfil,
        alterarFoto: alterarFoto,
        meuPerfil: exibirMeuPerfil,
        perfilAleatorio: exibirPerfilAleatorio,
        verificar: verificarTinder
    }
});



module.exports = objectExport;