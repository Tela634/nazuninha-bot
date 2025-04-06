case 'pix':case 'reg':case 'registrar':case 'delrg':case 'saldo':case 'banco':case 'depositar':case 'deposito':case 'sacar':case 'saque':case 'depoall':case 'saqueall':case 'trabalhar':case 'empregos':case 'trabalhos':case 'addemprego':case 'demissao':case 'delemprego':case 'loja':case 'comprar':case 'vender':case 'me':case 'inventario':case 'pescar':case 'minerar':case 'mina':case 'cacar':case 'assaltar':case 'namorar':case 'aceitar':case 'recusar':case 'divorcio':case 'casar':case 'minhadupla':case 'adotar':case 'soltar':case 'alimentar':case 'banho':case 'tosar':case 'veterinario':case 'meupet':case 'cassino':case 'apostar':case 'brincar':case 'passear':case 'carinho':
    try {
        if (!isGroup) return reply('Este comando só pode ser utilizado em grupos.');
        if (!isModoRPG) return reply('Este comando só pode ser utilizado com o modo RPG ativo.');
        if (!DadosRp && !['registrar', 'reg'].includes(command)) return reply('Você não está registrado.');

        switch (command) {
        
        case 'rgtinder':
    try {
        const RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const boij2 = RSM?.imageMessage || 
                      info.message?.imageMessage || 
                      RSM?.viewOnceMessageV2?.message?.imageMessage || 
                      info.message?.viewOnceMessageV2?.message?.imageMessage || 
                      info.message?.viewOnceMessage?.message?.imageMessage || 
                      RSM?.viewOnceMessage?.message?.imageMessage;

        if (!q || !boij2) return reply("⚠️ Use o formato: !rgtinder Nome (envie a foto junto).");

        const bufferFotoRegistro = await getFileBuffer(boij2, 'image');
        const resultadoRegistro = await rpg.tinder.registrar(sender, q, bufferFotoRegistro);
        return reply(resultadoRegistro.message);
    } catch (error) {
        console.error(error);
        return reply("❌ Erro ao registrar no Tinder. Verifique se enviou a foto corretamente.");
    }

case 'alterarfoto':
    try {
        const RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const boij2 = RSM?.imageMessage || 
                      info.message?.imageMessage || 
                      RSM?.viewOnceMessageV2?.message?.imageMessage || 
                      info.message?.viewOnceMessageV2?.message?.imageMessage || 
                      info.message?.viewOnceMessage?.message?.imageMessage || 
                      RSM?.viewOnceMessage?.message?.imageMessage;

        if (!boij2) return reply("⚠️ Envie a nova foto junto com o comando.");

        const bufferFotoAtualizar = await getFileBuffer(boij2, 'image');
        const resultadoAlterarFoto = await rpg.tinder.alterarFoto(sender, bufferFotoAtualizar);
        return reply(resultadoAlterarFoto.message);
    } catch (error) {
        console.error(error);
        return reply("❌ Erro ao alterar a foto do perfil do Tinder.");
    };

case 'meutinder':
    if (!await rpg.tinder.verificar(sender)) return reply("⚠️ Você não está registrado no Tinder.");
    const resultadoMeuPerfil = await rpg.tinder.meuPerfil(sender);
    return akame.sendMessage(from, {image: {url: resultadoMeuPerfil.foto}, caption: resultadoMeuPerfil.message}, {quoted: info});

case 'tinder':
    if (!await rpg.tinder.verificar(sender)) return reply("⚠️ Você não está registrado no Tinder.");
    const resultadoPerfil = await rpg.tinder.perfilAleatorio(sender);
    return akame.sendMessage(from, {image: {url: resultadoPerfil.foto}, caption: resultadoPerfil.message}, {quoted: info});

case 'editar':
    if (!await rpg.tinder.verificar(sender)) return reply("⚠️ Você não está registrado no Tinder.");
    if (!q.includes('/')) return reply("⚠️ Use o formato: !editar campo/valor.");
    const [campo, valorzz] = q.split('/');
    const resultadoEdicao = await rpg.tinder.editar(sender, campo, valorzz);
    return reply(resultadoEdicao.message);
    
    
        case 'cassino':
        case 'apostar':
    if (!q || isNaN(q)) {
        return reply("⚠️ Use o comando no formato: !cassino [valor]. Exemplo: !cassino 150");
    }
    const aposta = Number(q);
    const resultadoCassino = await rpg.cassino(sender, aposta);
    return reply(resultadoCassino.message);
    
        
        case 'adotar':
    if (!q || q.split('/').length < 2) {
        return reply("⚠️ Use o formato: !adotar Nome/Tipo (Ex: !adotar Rex/cachorro)");
    }
    const [nome, tipo] = q.split('/');
    const resultadoAdocao = await rpg.pet.adotar(sender, nome, tipo);
    return reply(resultadoAdocao.message);

case 'soltar':
    const resultadoSoltar = await rpg.pet.soltar(sender);
    return reply(resultadoSoltar.message);

case 'alimentar':
    await rpg.pet.atualizar(sender);
    const resultadoAlimentar = await rpg.pet.alimentar(sender);
    return reply(resultadoAlimentar.message);

case 'banho':
    await rpg.pet.atualizar(sender);
    const resultadoBanho = await rpg.pet.banho(sender);
    return reply(resultadoBanho.message);

case 'tosar':
    await rpg.pet.atualizar(sender);
    const resultadoTosa = await rpg.pet.tosar(sender);
    return reply(resultadoTosa.message);

case 'veterinario':
    await rpg.pet.atualizar(sender);
    const resultadoVeterinario = await rpg.pet.veterinario(sender);
    return reply(resultadoVeterinario.message);

case 'meupet':
    await rpg.pet.atualizar(sender);
    const statusPet = await rpg.pet.status(sender);
    return reply(statusPet.message);
    
    case 'brincar':
    await rpg.pet.atualizar(sender);
    const resultadoBrincar = await rpg.pet.brincar(sender);
    return reply(resultadoBrincar.message);

case 'passear':
    await rpg.pet.atualizar(sender);
    const resultadoPassear = await rpg.pet.passear(sender);
    return reply(resultadoPassear.message);

case 'carinho':
    await rpg.pet.atualizar(sender);
    const resultadoCarinho = await rpg.pet.carinho(sender);
    return reply(resultadoCarinho.message);
    
           case 'namorar':
    if (!isGroup) return reply('💌 Este comando só pode ser utilizado em grupos.');
    if (!menc_os2) return reply('💌 Marque a pessoa que deseja pedir em namoro.\nExemplo: !namorar @pessoa');
    
    const pedidoNamoro = await rpg.relacionamento.namorar(sender, menc_os2);
    if (!pedidoNamoro) return reply('💔 Ocorreu um erro ao enviar o pedido de namoro.');
    return reply(pedidoNamoro.message);

    case 'aceitar':
    const aceitar = await rpg.relacionamento.aceitar(sender);
    if (!aceitar) return reply('💔 Ocorreu um erro ao aceitar o pedido.');
    return reply(aceitar.message);

    case 'recusar':
    const recusar = await rpg.relacionamento.recusar(sender);
    if (!recusar) return reply('💔 Ocorreu um erro ao recusar o pedido.');
    return reply(recusar.message);

    case 'divorcio':
    if (!q || q !== '1') return reply('💔 Confirme o divórcio digitando: !divorcio 1');
    const divorcio = await rpg.relacionamento.divorciar(sender, q);
    if (!divorcio) return reply('💔 Ocorreu um erro ao realizar o divórcio.');
    return reply(divorcio.message);

    case 'casar':
    const casar = await rpg.relacionamento.casar(sender);
    if (!casar) return reply('💍 Ocorreu um erro ao fazer o pedido de casamento.');
    return reply(casar.message);

    case 'minhadupla':
    const dupla = await rpg.relacionamento.minhaDupla(sender);
    if (!dupla) return reply('💔 Ocorreu um erro ao buscar informações da sua dupla.');
    return reply(dupla.message);
    
            case 'registrar':
            case 'reg':
                if (DadosRp) return reply(`Você já está registrado como ${DadosRp.nome}.`);
                if (!q) return reply(`Digite seu nome.\nExemplo: ${prefix}${command} João.`);
                if (q.length > 15) return reply('O nome não pode ter mais de 15 caracteres.');
                const registrar = await rpg.rg(sender, q);
                if (!registrar) return reply('Erro ao registrar.');
                return reply(`Bem-vindo(a), ${q}! Você foi registrado no RPG.`);

            case 'delrg':
                if (!q || q !== '1') return reply(`Confirme a exclusão do registro digitando: ${prefix}${command} 1`);
                const deletarRegistro = await rpg.del(sender);
                if (!deletarRegistro) return reply('Erro ao deletar registro.');
                return reply('Seu registro foi deletado com sucesso.');

            case 'saldo':
            case 'banco':
                const saldoMsg = `🏦 _*INFORMAÇÕES BANCÁRIAS*_ 🏦\n\nBanco: NazuBank\nNome: ${DadosRp.nome}\nSaldo no Banco: R$ ${DadosRp.saldo.banco}\nSaldo na Carteira: R$ ${DadosRp.saldo.carteira}`;
                return reply(saldoMsg);

            case 'depositar':
            case 'deposito':
                if (!q || !Number(q)) return reply(`Digite um valor válido.\nExemplo: ${prefix}${command} 50`);
                if (DadosRp.saldo.carteira < Number(q)) return reply('Saldo insuficiente.');
                if (!await rpg.saldo.del(sender, Number(q)) || !await rpg.banco.add(sender, Number(q))) 
                    return reply('Erro ao depositar.');
                return reply(`Você depositou R$${q}.`);

            case 'sacar':
            case 'saque':
                if (!q || !Number(q)) return reply(`Digite um valor válido.\nExemplo: ${prefix}${command} 50`);
                if (DadosRp.saldo.banco < Number(q)) return reply('Saldo insuficiente no banco.');
                if (!await rpg.banco.del(sender, Number(q)) || !await rpg.saldo.add(sender, Number(q)))
                    return reply('Erro ao sacar.');
                return reply(`Você sacou R$${q}.`);

            case 'depoall':
                if (!await rpg.banco.add(sender, DadosRp.saldo.carteira) || !await rpg.saldo.del(sender, DadosRp.saldo.carteira))
                    return reply('Erro ao depositar tudo.');
                return reply(`Você depositou todo o saldo da carteira no banco.`);

            case 'saqueall':
                if (!await rpg.saldo.add(sender, DadosRp.saldo.banco) || !await rpg.banco.del(sender, DadosRp.saldo.banco))
                    return reply('Erro ao sacar tudo.');
                return reply(`Você sacou todo o saldo do banco para a carteira.`);

            case 'pix':
            case 'transferir':
                if (!q) return reply(`Digite o usuário e valor no formato: ${prefix}${command} @usuario/valor.`);
                let destinatario, valor;
                if (q.includes("@")) {
                   [destinatario, valor] = q.replace(/ /g, '').split('/');
                   destinatario = destinatario.split("@")[1] + "@s.whatsapp.net"; // Converte para JID
                } else {
                   if (!menc_os2) return reply('Marque quem deseja enviar o pix.');
                   destinatario = menc_os2;
                   valor = q;
                };
                if (!destinatario) return reply('Está faltando o destinatário para a transferência.');
                if (!valor || isNaN(valor)) return reply(`O valor informado é inválido.\nExemplo: ${prefix}${command} @usuario/200.`);
                if (DadosRp.saldo.banco < Number(valor)) return reply('Saldo insuficiente para transferência.');
                const userDestino = await rpg(destinatario);
                if (!userDestino) return reply('Usuário não registrado no RPG.');
                const addSaldo = await rpg.banco.add(destinatario, Number(valor));
                const debitarSaldo = await rpg.banco.del(sender, Number(valor));
                if (!addSaldo || !debitarSaldo) return reply('Erro ao realizar transferência.');
                return reply(`*🚀 TRANSFERÊNCIA REALIZADA 🚀*\n\nDe: ${DadosRp.nome}\nPara: ${userDestino.nome}\nValor: R$${valor}\n\nObrigado por utilizar nossos serviços.`);

            
            case 'assaltar':
                if (!menc_os2) return reply(`Marque quem deseja assaltar.\nExemplo: ${prefix}${command} @usuario`);
                const alvo = menc_os2;
                if (alvo === sender) return reply('Você não pode se assaltar.');
                const resultadoAssalto = await rpg.acao.assaltar(sender, alvo);
                if (!resultadoAssalto) return reply('Erro ao realizar o assalto.');
                return reply(resultadoAssalto.message);

            case 'trabalhar':
                if (!DadosRp.emprego || DadosRp.emprego === 'desempregado') return reply('Você precisa ter um emprego.');
                const trabalho = await rpg.trabalhar(sender);
                if (!trabalho) return reply('Erro ao trabalhar.');
                return reply(trabalho.message);

            case 'empregos':
                const empregos = await rpg.empregos(sender);
                if (!empregos) return reply('Erro ao listar empregos.');
                textEmpregos = `✨ _*EMPREGOS DA NAZUCITY*_ ✨\n- ✅ Empregos que você pode entrar\n- ❌ Empregos que você precisa de mais experiência de trabalho para entrar\n`;
                for(emprego of empregos.disponiveis) {
                textEmpregos += `\n- ✅ ${emprego}`;
                };
                textEmpregos += '\n';
                for(emprego of empregos.bloqueados) {
                textEmpregos += `\n- ❌ ${emprego}`;
                };
                textEmpregos += `\n\n> Para entrar nos empregos digite ${prefix}addemprego [Nome do emprego]\n> Exemplo: ${prefix}addemprego policial`;
                return reply(textEmpregos);

            case 'addemprego':
                if (DadosRp.emprego && DadosRp.emprego !== 'desempregado') 
                    return reply('Você já tem um emprego. Demita-se primeiro.');
                const addEmprego = await rpg.emprego.add(sender, q.toLowerCase());
                if (!addEmprego) return reply('Erro ao entrar no emprego.');
                return reply(addEmprego.message);

            case 'demissao':
                if (!DadosRp.emprego || DadosRp.emprego === 'desempregado') 
                    return reply('Você não tem emprego para se demitir.');
                const demissao = await rpg.emprego.del(sender);
                if (!demissao) return reply('Erro ao se demitir.');
                return reply(demissao.message);

            case 'loja':
                const loja = await rpg.loja();
                if (!loja) return reply('Erro ao acessar a loja.');
                return reply(loja.message.replaceAll('#prefix#', prefix));

            case 'comprar':
  if (!q) return reply('Digite o nome do item que deseja comprar.');
  const [itemz, quantidadez] = q.split('/');
  const compra = quantidadez ? await rpg.comprar(sender, itemz, Number(quantidadez)) : await rpg.comprar(sender, itemz);
  if (!compra) return reply('Erro ao comprar item.');
  return reply(compra.message.replaceAll('#prefix#', prefix));

            case 'vender':
                if (!q) return reply(`Digite o item e a quantidade no formato: item/quantidade.`);
                const [item, quantidade] = q.split('/').map(v => v.trim());
                if (!item || !quantidade || isNaN(quantidade)) return reply('Formato inválido. Exemplo: item/1');
                const venda = await rpg.vender(sender, item, parseInt(quantidade));
                if (!venda) return reply('Erro ao vender item.');
                return reply(venda.message);

            case 'me':
                const informacoes = await rpg.me(sender);
                if (!informacoes) return reply('Erro ao buscar informações.');
                return reply(informacoes.message);

            case 'inventario':
                const inventario = await rpg.itens(sender);
                if (!inventario) return reply('Erro ao buscar inventário.');
                return reply(inventario.message);

            case 'pescar':
                const pesca = await rpg.acao.pescar(sender);
                if (!pesca) return reply('Erro ao pescar.');
                return reply(pesca.message);

            case 'minerar':
                const mineracao = await rpg.acao.minerar(sender);
                if (!mineracao) return reply('Erro ao minerar.');
                return reply(mineracao.message);

            case 'cacar':
                const caca = await rpg.acao.cacar(sender);
                if (!caca) return reply('Erro ao caçar.');
                return reply(caca.message);

            default:
                return reply('Comando inválido ou não implementado no RPG.');
        }
    } catch (e) {
        console.error(e);
        return reply('Ocorreu um erro ao executar o comando RPG.');
    }
break;