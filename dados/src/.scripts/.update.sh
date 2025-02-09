#!/bin/bash

# Funções para exibir mensagens formatadas
mensagem() {
    echo "\033[1;32m$1\033[0m"
}

aviso() {
    echo "\033[1;31m$1\033[0m"
}

separador() {
    echo "\033[1;34m============================================\033[0m"
}

# Verifica se o usuário quer realmente atualizar
separador
mensagem "🔄 Script de Atualização do Nazuninha Bot"
separador
echo "Tem certeza que deseja atualizar o bot?"
echo "Isso irá:"
echo "1. Fazer backup dos dados importantes."
echo "2. Baixar a versão mais recente do repositório."
echo "3. Restaurar os dados após a atualização."
echo ""
read -p "Deseja continuar? (s/n): " resposta

# Converte a resposta para minúsculas
resposta=$(echo "$resposta" | tr '[:upper:]' '[:lower:]')

# Verifica a resposta
if [ "$resposta" != "s" ]; then
    aviso "❌ Atualização cancelada."
    exit 0
fi

# Cria um diretório temporário para o backup
backup_dir="./backup_temp"
mkdir -p "$backup_dir"

# Faz o backup dos dados importantes
mensagem "📂 Fazendo backup dos dados..."
mkdir -p "$backup_dir/dados/database"
mkdir -p "$backup_dir/dados/src"
cp -r "./dados/database" "$backup_dir/dados/"
cp "./dados/src/config.json" "$backup_dir/dados/src/"
mensagem "✔ Backup concluído! Dados salvos em: $backup_dir"

# Baixa a versão mais recente do repositório
mensagem "⬇️ Baixando a versão mais recente do repositório..."
git clone https://github.com/hiudyy/nazuninha-bot.git ./temp_nazuninha
if [ $? -ne 0 ]; then
    aviso "❌ Falha ao baixar o repositório. Verifique sua conexão com a internet."
    exit 1
fi

# Remove todos os arquivos e diretórios, exceto o backup e o script de atualização
mensagem "🧹 Removendo arquivos antigos..."
shopt -s extglob
rm -rf !("backup_temp"|"dados")
shopt -u extglob

# Move os novos arquivos para o diretório atual
mensagem "🚚 Movendo novos arquivos..."
mv ./temp_nazuninha/* ./
mv ./temp_nazuninha/.git ./

# Remove a pasta temporária do repositório clonado
rm -rf ./temp_nazuninha

# Restaura os dados do backup
mensagem "🔄 Restaurando dados do backup..."
mkdir -p "./dados/database"
mkdir -p "./dados/src"
cp -r "$backup_dir/dados/database" "./dados/"
cp "$backup_dir/dados/src/config.json" "./dados/src/"
mensagem "✔ Dados restaurados com sucesso!"

# Remove a pasta de backup temporária
rm -rf "$backup_dir"

# Instala as dependências do Node.js
mensagem "📦 Instalando dependências do Node.js..."
npm install
if [ $? -ne 0 ]; then
    aviso "❌ Falha ao instalar as dependências. Verifique o arquivo package.json."
    exit 1
fi
mensagem "✔ Dependências instaladas com sucesso!"

# Mensagem final
separador
mensagem "🎉 Atualização concluída com sucesso!"
mensagem "🚀 Inicie o bot com: npm start"
separador