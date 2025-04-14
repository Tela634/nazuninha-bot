#!/bin/bash

# Nazuna Bot - Script de Inicialização
# Criado por Hiudy
# Mantenha os créditos, por favor! <3

# Configurações iniciais
set -e
CONFIG_FILE="./dados/src/config.json"
NODE_MODULES="./node_modules"
QR_CODE_DIR="./dados/database/qr-code/default"
CONNECT_FILE="./dados/src/connect.js"
VERSION=$(jq -r .version package.json 2>/dev/null || echo "Desconhecida")

# Funções utilitárias
print_message() {
    printf "\033[1;32m%s\033[0m\n" "$1"
}

print_warning() {
    printf "\033[1;31m%s\033[0m\n" "$1"
}

print_separator() {
    printf "\033[1;34m============================================\033[0m\n"
}

# Verifica pré-requisitos
check_requirements() {
    [ -f "$CONFIG_FILE" ] || {
        print_warning "⚠ Configuração não encontrada!"
        print_message "🔹 Execute: npm run config"
        exit 1
    }

    [ -d "$NODE_MODULES" ] || {
        print_warning "⚠ Módulos não instalados!"
        print_message "🔹 Execute: npm run config:install"
        exit 1
    }

    command -v node >/dev/null 2>&1 || {
        print_warning "❌ Node.js não encontrado. Instale o Node.js."
        exit 1
    }
}

# Verifica conexão existente
check_existing_connection() {
    if [ -d "$QR_CODE_DIR" ] && [ "$(find "$QR_CODE_DIR" -maxdepth 1 -type f | wc -l)" -gt 2 ]; then
        print_message "📡 Conexão existente detectada! Iniciando automaticamente..."
        run_bot
        return 0
    fi
    return 1
}

# Função para escolher método de conexão
choose_connection_method() {
    local choice
    print_message "🔗 Escolha o método de conexão:"
    printf "\033[1;33m1.\033[0m QR Code\n"
    printf "\033[1;33m2.\033[0m Código de Pareamento\n"
    printf "Opção (1/2): "
    
    read -r choice
    case "$choice" in
        1) return 1 ;;
        2) return 2 ;;
        *) 
            print_warning "❌ Opção inválida! Escolha 1 ou 2."
            exit 1
            ;;
    esac
}

# Executa o bot
run_bot() {
    local mode=$1
    local cmd="node --expose-gc $CONNECT_FILE"
    [ "$mode" = "code" ] && cmd="$cmd --code"

    print_message "🚀 Iniciando Nazuna Bot..."
    while true; do
        $cmd || {
            print_warning "⚠ Bot caiu! Reiniciando em 1 segundo..."
            sleep 1
        }
    done
}

# Main
main() {
    print_separator
    print_message "🚀 Inicializador da Nazuna - v$VERSION"
    print_message "🔧 Criado por Hiudy"
    print_separator
    echo

    check_requirements

    if check_existing_connection; then
        return
    fi

    choose_connection_method
    case $? in
        1) run_bot ;;
        2) run_bot "code" ;;
    esac
}

# Executa com tratamento de erros
main || {
    print_warning "❌ Erro ao iniciar o bot."
    exit 1
}