# **Nazuninha Bot 🤖🚀**

[![Last Update](https://img.shields.io/github/last-commit/hiudyy/nazuninha-bot)](https://github.com/hiudyy/nazuninha-bot)
[![Stars](https://img.shields.io/github/stars/hiudyy/nazuninha-bot?color=yellow&label=Favorites&style=for-the-badge)](https://github.com/hiudyy/nazuninha-bot/stargazers)
[![License](https://img.shields.io/badge/license-Copyright-red?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/STATUS-ACTIVE-success?style=for-the-badge)](#-)

📊 **Total Visits:**  
[![Visits Counter](https://count.getloli.com/@nazuninha-bot?name=nazuninha-bot&theme=booru-lewd&padding=8&offset=0&align=top&scale=2&pixelated=1&darkmode=1)](#-)

---

## 📢 **Join Our WhatsApp Channel!**

Stay in the loop with the latest **Nazuninha Bot** news, updates, and tips! Join our official WhatsApp channel:  
[![Join WhatsApp Channel](https://img.shields.io/badge/Join-WhatsApp-green?style=for-the-badge&logo=whatsapp)](https://whatsapp.com/channel/0029Vb6Ezk6LI8YXPgZPUJ2b)

---

## 🌐 **Choose Your Language**

This README is available in multiple languages to make it easy for everyone:

- 🇺🇸 [English](#-english)
- 🇧🇷 [Português (Brasil)](#-português-brasil)
- 🇪🇸 [Español](#-español)
- 🇮🇩 [Bahasa Indonesia](#-bahasa-indonesia)

---

## 🇺🇸 **English**

### 🤖 **What is Nazuninha Bot?**

**Nazuninha Bot** is a super-friendly WhatsApp bot built with **Node.js** and **Baileys**. It’s like a Swiss Army knife for WhatsApp—great for automating tasks, managing groups, or just having fun with cool features! Whether you’re new to bots or a pro, **Nazuninha Bot** is easy to set up and use.

> ⚠️ **Important**: This bot is **protected by copyright**. Don’t remove credits or try to sell it—it’s not allowed, and we’ll take legal action if you do.

### 🎉 **Why Use Nazuninha Bot?**

- **Easy Setup**: Connect with a QR code or phone number in minutes.
- **Lots of Features**: From group management to fun commands, it’s got it all!
- **Works Everywhere**: Use it on your computer, phone, or even Termux (an Android app).
- **Always Improving**: We add new stuff and fix bugs regularly.
- **Safe & Fast**: Keeps your chats secure and runs smoothly.

### 📜 **Table of Contents**

- [📋 Before You Start](#-before-you-start)
- [📥 How to Install](#-how-to-install)
- [🚀 Starting the Bot](#-starting-the-bot)
- [🔌 Connecting to WhatsApp](#-connecting-to-whatsapp)
- [🔄 Updating the Bot](#-updating-the-bot)
- [💻 Using Termux (Android)](#-using-termux-android)
- [❓ Help! Something’s Wrong](#-help-somethings-wrong)
- [💖 Support Us](#-support-us)
- [📜 Rules (License)](#-rules-license)
- [👤 Who Made This?](#-who-made-this)

#### 📋 **Before You Start**

Here’s what you need to get **Nazuninha Bot** running:

- **Node.js**: A program to run the bot (version 18 or newer). Download it from [nodejs.org](https://nodejs.org).
- **Git**: A tool to download the bot’s files. Get it from [git-scm.com](https://git-scm.com).
- **WhatsApp**: A phone number for the bot. **Tip**: Use a new number, not your main one, to avoid issues.
- **Internet**: A stable connection for setup and use.
- **Computer or Phone**: You’ll need a device to run commands (like a terminal or Termux app).

> 😅 **New to this?** Don’t worry! We’ll guide you step-by-step.

#### 📥 **How to Install**

Let’s set up the bot on your device:

1. **Download the Bot Files**  
   Open your terminal (or Command Prompt) and type:  
   ```bash
   git clone https://github.com/hiudyy/nazuninha-bot.git
   cd nazuninha-bot
   ```  
   This grabs the bot and moves you to its folder.

2. **Add Needed Tools**  
   Run these commands one by one:  
   ```bash
   npm run config
   npm run config:install
   ```  
   These install everything the bot needs to work.

   > **Stuck?** If you see errors, make sure Node.js is installed (try `node -v` to check). You can also type `npm install` to fix missing files.

#### 🚀 **Starting the Bot**

To start **Nazuninha Bot**, type:  
```bash
npm start
```

The bot will ask how you want to connect to WhatsApp (see [Connecting to WhatsApp](#-connecting-to-whatsapp)).

> **First Time?** You’ll need to connect with a QR code or phone number. After that, it’s usually automatic!

#### 🔌 **Connecting to WhatsApp**

**Nazuninha Bot** works with WhatsApp’s **multi-device mode**, so it doesn’t need your phone to stay online after setup. Choose one of these methods:

1. **QR Code**  
   - The terminal will show a QR code (a square with patterns).  
   - On your phone, open WhatsApp:  
     1. Go to **Settings** (or three dots).  
     2. Tap **Linked Devices**.  
     3. Tap **Link a Device**.  
     4. Scan the QR code with your phone’s camera.  
   - Done! The bot will say it’s connected.

2. **Pairing Code**  
   - Choose this if you don’t want to scan.  
   - Enter your phone number (like `+12025550123`).  
   - The terminal will give you a code (e.g., `1234-5678`).  
   - On WhatsApp:  
     1. Go to **Settings > Linked Devices**.  
     2. Tap **Link with Phone Number**.  
     3. Type the code.  
   - The bot will connect automatically.

> ⚠️ **Heads Up**:  
> - Use a **secondary number** to keep your main WhatsApp safe.  
> - If the QR code expires, just restart with `npm start`.  
> - Once connected, the bot saves your session, so you won’t need to reconnect unless you log out.

#### 🔄 **Updating the Bot**

Want the latest features? Update with:  
```bash
npm run update
```

This keeps your bot fresh without deleting your settings or chats.

> ✅ **No Stress**: Updates are safe and won’t mess up your bot.

#### 💻 **Using Termux (Android)**

**Termux** is an app that lets you run **Nazuninha Bot** on your Android phone. Perfect if you don’t have a computer! Here’s how:

1. **Install Termux**  
   - Download Termux from [F-Droid](https://f-droid.org) or another trusted source (Google Play’s version is outdated).  
   - Open Termux and type:  
     ```bash
     pkg update && pkg upgrade -y
     ```  
     This updates Termux.

2. **Add Node.js**  
   ```bash
   pkg install nodejs -y
   ```  
   This lets Termux run the bot.

3. **Allow Storage Access**  
   ```bash
   termux-setup-storage
   ```  
   Say “yes” if asked for permission.

4. **Go to Your Phone’s Storage**  
   ```bash
   cd /sdcard
   ```  
   This is where we’ll save the bot.

5. **Download the Bot**  
   ```bash
   git clone https://github.com/hiudyy/nazuninha-bot.git
   cd nazuninha-bot
   ```

6. **Install Tools**  
   ```bash
   npm run config
   npm run config:install
   ```

7. **Start the Bot**  
   ```bash
   npm start
   ```  
   Connect using a QR code or pairing code (see [Connecting to WhatsApp](#-connecting-to-whatsapp)).

**Restarting the Bot**:  
- If you close Termux or your phone restarts, don’t worry! To start again:  
  1. Open Termux.  
  2. Type:  
     ```bash
     cd /sdcard/nazuninha-bot
     npm start
     ```  
  3. The bot should reconnect automatically if you didn’t log out.  
- **Tip**: If it asks for a QR code again, your session might have expired. Just reconnect.

**Keeping Termux Running**:  
- To keep the bot online 24/7, don’t close Termux. Use a “keep awake” app or charge your phone to prevent it from sleeping.  
- If Termux stops, just repeat the restart steps above.

> **Helpful Hint**: If the bot doesn’t start, try `npm install` or check [Help! Something’s Wrong](#-help-somethings-wrong).

#### ❓ **Help! Something’s Wrong**

New to bots? Here are answers to common problems:

- **“Command not found” (e.g., git, node)**  
  - You need to install Git or Node.js. Check [Before You Start](#-before-you-start) for links.  
  - In Termux, try `pkg install git` or `pkg install nodejs`.

- **QR Code Doesn’t Work**  
  - Make sure your phone’s WhatsApp is updated.  
  - If the code expires, type `npm start` again for a new one.  
  - Check your internet connection.

- **Bot Won’t Connect**  
  - Restart with `npm start`.  
  - Delete the `sessions` folder (in the bot’s directory) and reconnect.  
  - Use a different phone number if WhatsApp bans the current one.

- **Errors During Install**  
  - Run `npm install` to fix missing files.  
  - Ensure Node.js is version 18+ (check with `node -v`).  
  - In Termux, update packages with `pkg update`.

- **Bot Stops in Termux**  
  - Your phone might be closing Termux. Keep it plugged in or use a “stay awake” setting.  
  - Restart with `cd /sdcard/nazuninha-bot && npm start`.

> 😊 **Still Stuck?** Join our [WhatsApp Channel](https://whatsapp.com/channel/0029Vb6Ezk6LI8YXPgZPUJ2b) for help!

#### 💖 **Support Us**

Making **Nazuninha Bot** awesome takes a lot of work. If you love it, you can help keep it going:

- **🌍 Worldwide (Patreon)**  
  Support us from anywhere!  
  [![Support on Patreon](https://img.shields.io/badge/Support-Patreon-orange?style=for-the-badge&logo=patreon)](https://patreon.com/hiudyy)

- **🇧🇷 Brazil (Pix)**  
  Send a donation to:  
  **Pix Key (Email):** `lua.bot@hotmail.com`

Even a small amount means a lot. Thanks for supporting **Nazuninha Bot**! ❤️

#### 📜 **Rules (License)**

© 2025 **Hiudy**. All rights reserved.

This bot is **protected by copyright**. You **can’t** remove credits, sell it, or share modified versions without permission. Breaking these rules may lead to legal trouble.

#### 👤 **Who Made This?**

Created with ❤️ by [**Hiudy**](https://github.com/hiudyy).  
[![Hiudy's Profile](https://github-readme-stats.vercel.app/api?username=hiudyy&show_icons=true&theme=dracula&locale=en)](https://github.com/hiudyy)

Like the bot? Give us a ⭐ on GitHub and tell your friends!

---

## 🇧🇷 **Português (Brasil)**

### 🤖 **O que é o Nazuninha Bot?**

O **Nazuninha Bot** é um bot para WhatsApp superlegal, feito com **Node.js** e **Baileys**. Ele é como um canivete suíço: perfeito para automatizar coisas, gerenciar grupos ou se divertir com comandos legais! Mesmo se você for iniciante, é fácil de configurar e usar.

> ⚠️ **Atenção**: Este bot é **protegido por direitos autorais**. Não remova os créditos nem tente vender—é proibido, e podemos tomar medidas legais.

### 🎉 **Por que usar o Nazuninha Bot?**

- **Configuração Simples**: Conecte com QR Code ou número em minutos.
- **Muitas Funções**: Gerencia grupos, tem comandos divertidos e mais!
- **Roda em Qualquer Lugar**: Computador, celular ou Termux (app para Android).
- **Sempre Melhorando**: Adicionamos novidades e corrigimos erros com frequência.
- **Rápido e Seguro**: Mantém suas conversas protegidas e funciona bem.

### 📜 **Índice**

- [📋 Antes de Começar](#-antes-de-começar)
- [📥 Como Instalar](#-como-instalar)
- [🚀 Iniciando o Bot](#-iniciando-o-bot)
- [🔌 Conectando ao WhatsApp](#-conectando-ao-whatsapp)
- [🔄 Atualizando o Bot](#-atualizando-o-bot)
- [💻 Usando no Termux (Android)](#-usando-no-termux-android)
- [❓ Socorro! Algo deu Errado](#-socorro-algo-deu-errado)
- [💖 Apoie o Projeto](#-apoie-o-projeto)
- [📜 Regras (Licença)](#-regras-licença)
- [👤 Quem Fez Isso?](#-quem-fez-isso)

#### 📋 **Antes de Começar**

Você vai precisar de:

- **Node.js**: Um programa para rodar o bot (versão 18 ou mais nova). Baixe em [nodejs.org](https://nodejs.org).
- **Git**: Para baixar os arquivos do bot. Pegue em [git-scm.com](https://git-scm.com).
- **WhatsApp**: Um número de telefone para o bot. **Dica**: Use um número novo, não o seu principal, para evitar problemas.
- **Internet**: Conexão estável para configurar e usar.
- **Computador ou Celular**: Algo para digitar comandos (como um terminal ou o app Termux).

> 😅 **Novo nisso?** Calma, vamos te guiar direitinho!

#### 📥 **Como Instalar**

Vamos configurar o bot no seu dispositivo:

1. **Baixar os Arquivos do Bot**  
   Abra o terminal (ou Prompt de Comando) e digite:  
   ```bash
   git clone https://github.com/hiudyy/nazuninha-bot.git
   cd nazuninha-bot
   ```  
   Isso baixa o bot e entra na pasta dele.

2. **Adicionar Ferramentas**  
   Digite esses comandos, um de cada vez:  
   ```bash
   npm run config
   npm run config:install
   ```  
   Eles instalam tudo que o bot precisa.

   > **Travou?** Se der erro, veja se o Node.js está instalado (digite `node -v` para checar). Tente também `npm install` para consertar.

#### 🚀 **Iniciando o Bot**

Para ligar o **Nazuninha Bot**, digite:  
```bash
npm start
```

Ele vai perguntar como conectar ao WhatsApp (veja [Conectando ao WhatsApp](#-conectando-ao-whatsapp)).

> **Primeira Vez?** Você vai precisar conectar com QR Code ou número. Depois disso, normalmente é automático!

#### 🔌 **Conectando ao WhatsApp**

O **Nazuninha Bot** usa o **modo multi-dispositivos** do WhatsApp, então não precisa do celular ligado após a configuração. Escolha uma dessas opções:

1. **QR Code**  
   - O terminal vai mostrar um QR Code (um quadrado com padrões).  
   - No seu celular, abra o WhatsApp:  
     1. Vá em **Configurações** (ou três pontinhos).  
     2. Toque em **Aparelhos Conectados**.  
     3. Toque em **Conectar um Aparelho**.  
     4. Aponte a câmera para o QR Code.  
   - Pronto! O bot vai dizer que conectou.

2. **Código de Pareamento**  
   - Escolha essa opção se não quiser escanear.  
   - Digite seu número de telefone (ex.: `+5511999999999`).  
   - O terminal mostra um código (tipo `1234-5678`).  
   - No WhatsApp:  
     1. Vá em **Configurações > Aparelhos Conectados**.  
     2. Toque em **Conectar com Número de Telefone**.  
     3. Digite o código.  
   - O bot conecta sozinho.

> ⚠️ **Atenção**:  
> - Use um **número secundário** para proteger seu WhatsApp principal.  
> - Se o QR Code expirar, digite `npm start` de novo.  
> - Após conectar, o bot salva sua sessão, então não precisa reconectar a menos que faça logout.

#### 🔄 **Atualizando o Bot**

Quer as novidades? Atualize com:  
```bash
npm run update
```

Isso mantém o bot novinho sem apagar suas configurações ou conversas.

> ✅ **Sem Medo**: Atualizar é seguro e não bagunça nada.

#### 💻 **Usando no Termux (Android)**

O **Termux** é um app que roda o **Nazuninha Bot** no seu celular Android. Ideal se você não tem computador! Veja como:

1. **Instalar o Termux**  
   - Baixe o Termux pelo [F-Droid](https://f-droid.org) ou outra fonte confiável (a versão do Google Play é antiga).  
   - Abra o Termux e digite:  
     ```bash
     pkg update && pkg upgrade -y
     ```  
     Isso atualiza o Termux.

2. **Adicionar Node.js**  
   ```bash
   pkg install nodejs -y
   ```  
   Isso permite rodar o bot.

3. **Liberar Armazenamento**  
   ```bash
   termux-setup-storage
   ```  
   Diga “sim” se pedir permissão.

4. **Ir para o Armazenamento do Celular**  
   ```bash
   cd /sdcard
   ```  
   É onde vamos salvar o bot.

5. **Baixar o Bot**  
   ```bash
   git clone https://github.com/hiudyy/nazuninha-bot.git
   cd nazuninha-bot
   ```

6. **Instalar Ferramentas**  
   ```bash
   npm run config
   npm run config:install
   ```

7. **Iniciar o Bot**  
   ```bash
   npm start
   ```  
   Conecte com QR Code ou código de pareamento (veja [Conectando ao WhatsApp](#-conectando-ao-whatsapp)).

**Reiniciando o Bot**:  
- Se fechar o Termux ou o celular desligar, é fácil voltar:  
  1. Abra o Termux.  
  2. Digite:  
     ```bash
     cd /sdcard/nazuninha-bot
     npm start
     ```  
  3. Se você não fez logout, o bot reconecta sozinho.  
- **Dica**: Se pedir QR Code de novo, a sessão pode ter expirado. Reconecte normalmente.

**Mantendo o Termux Ligado**:  
- Para o bot ficar online 24/7, não feche o Termux. Use um app de “manter acordado” ou deixe o celular carregando para não dormir.  
- Se parar, é só reiniciar com os passos acima.

> **Dica Esperta**: Se o bot não ligar, tente `npm install` ou veja [Socorro! Algo deu Errado](#-socorro-algo-deu-errado).

#### ❓ **Socorro! Algo deu Errado**

Novo com bots? Aqui estão soluções para problemas comuns:

- **“Comando não encontrado” (ex.: git, node)**  
  - Você precisa instalar o Git ou Node.js. Veja [Antes de Começar](#-antes-de-começar) para links.  
  - No Termux, tente `pkg install git` ou `pkg install nodejs`.

- **QR Code Não Funciona**  
  - Veja se seu WhatsApp está atualizado.  
  - Se o código expirar, digite `npm start` para um novo.  
  - Cheque sua internet.

- **Bot Não Conecta**  
  - Reinicie com `npm start`.  
  - Apague a pasta `sessions` (na pasta do bot) e reconecte.  
  - Use outro número se o WhatsApp bloquear o atual.

- **Erros na Instalação**  
  - Digite `npm install` para consertar arquivos faltando.  
  - Confirme que o Node.js é versão 18+ (veja com `node -v`).  
  - No Termux, atualize com `pkg update`.

- **Bot Para no Termux**  
  - O celular pode estar fechando o Termux. Mantenha ele ligado ou use “manter acordado”.  
  - Reinicie com `cd /sdcard/nazuninha-bot && npm start`.

> 😊 **Ainda Perdido?** Entre no nosso [Canal do WhatsApp](https://whatsapp.com/channel/0029Vb6Ezk6LI8YXPgZPUJ2b) para ajuda!

#### 💖 **Apoie o Projeto**

Deixar o **Nazuninha Bot** incrível dá muito trabalho. Se gostou, ajude a manter ele vivo:

- **🌍 Mundo Todo (Patreon)**  
  Apoie de qualquer lugar!  
  [![Support on Patreon](https://img.shields.io/badge/Support-Patreon-orange?style=for-the-badge&logo=patreon)](https://patreon.com/hiudyy)

- **🇧🇷 Brasil (Pix)**  
  Mande uma doação para:  
  **Chave Pix (E-mail):** `lua.bot@hotmail.com`

Qualquer valor ajuda muito. Obrigado por apoiar o **Nazuninha Bot**! ❤️

#### 📜 **Regras (Licença)**

© 2025 **Hiudy**. Todos os direitos reservados.

O bot é **protegido por direitos autorais**. Você **não pode** tirar os créditos, vender ou compartilhar versões modificadas sem permissão. Quem desrespeitar pode ter problemas legais.

#### 👤 **Quem Fez Isso?**

Feito com ❤️ por [**Hiudy**](https://github.com/hiudyy).  
[![Hiudy's Profile](https://github-readme-stats.vercel.app/api?username=hiudyy&show_icons=true&theme=dracula&locale=pt-br)](https://github.com/hiudyy)

Gostou? Dê uma ⭐ no GitHub e mostre pros amigos!

---

## 🇪🇸 **Español**

### 🤖 **¿Qué es Nazuninha Bot?**

**Nazuninha Bot** es un bot súper útil para WhatsApp, creado con **Node.js** y **Baileys**. ¡Es como una navaja suiza! Sirve para automatizar tareas, administrar grupos o divertirte con funciones geniales. Es fácil de usar, incluso si eres nuevo en esto.

> ⚠️ **Importante**: Este bot está **protegido por derechos de autor**. No quites los créditos ni intentes venderlo—está prohibido y podríamos tomar acciones legales.

### 🎉 **¿Por qué usar Nazuninha Bot?**

- **Fácil de Configurar**: Conecta con un código QR o número en minutos.
- **Muchas Funciones**: Administra grupos, tiene comandos divertidos y más.
- **Funciona en Todo**: Computadora, celular o Termux (app para Android).
- **Siempre Mejorando**: Añadimos cosas nuevas y arreglamos errores seguido.
- **Rápido y Seguro**: Protege tus chats y funciona sin problemas.

### 📜 **Índice**

- [📋 Antes de Empezar](#-antes-de-empezar)
- [📥 Cómo Instalar](#-cómo-instalar)
- [🚀 Iniciando el Bot](#-iniciando-el-bot)
- [🔌 Conectando a WhatsApp](#-conectando-a-whatsapp)
- [🔄 Actualizando el Bot](#-actualizando-el-bot)
- [💻 Usando Termux (Android)](#-usando-termux-android)
- [❓ ¡Ayuda! Algo salió Mal](#-ayuda-algo-salió-mal)
- [💖 Apóyanos](#-apóyanos)
- [📜 Reglas (Licencia)](#-reglas-licencia)
- [👤 ¿Quién lo Hizo?](#-quién-lo-hizo)

#### 📋 **Antes de Empezar**

Necesitas esto para usar **Nazuninha Bot**:

- **Node.js**: Un programa para el bot (versión 18 o más nueva). Descarga en [nodejs.org](https://nodejs.org).
- **Git**: Para bajar los archivos del bot. Consíguelo en [git-scm.com](https://git-scm.com).
- **WhatsApp**: Un número de teléfono para el bot. **Consejo**: Usa uno nuevo, no tu número principal, para evitar problemas.
- **Internet**: Conexión estable para configurar y usar.
- **Computadora o Celular**: Algo para escribir comandos (como una terminal o la app Termux).

> 😅 **¿Eres nuevo?** ¡Tranquilo! Te explicamos todo paso a paso.

#### 📥 **Cómo Instalar**

Vamos a configurar el bot:

1. **Descargar los Archivos**  
   Abre tu terminal (o Símbolo del Sistema) y escribe:  
   ```bash
   git clone https://github.com/hiudyy/nazuninha-bot.git
   cd nazuninha-bot
   ```  
   Esto baja el bot y te lleva a su carpeta.

2. **Añadir Herramientas**  
   Escribe estos comandos, uno por uno:  
   ```bash
   npm run config
   npm run config:install
   ```  
   Instalan lo que el bot necesita.

   > **¿Problemas?** Si ves errores, asegúrate de tener Node.js (prueba `node -v`). También puedes escribir `npm install` para arreglar.

#### 🚀 **Iniciando el Bot**

Para encender **Nazuninha Bot**, escribe:  
```bash
npm start
```

Te pedirá que elijas cómo conectar a WhatsApp (mira [Conectando a WhatsApp](#-conectando-a-whatsapp)).

> **¿Primera vez?** Necesitarás conectar con un código QR o número. ¡Después suele ser automático!

#### 🔌 **Conectando a WhatsApp**

**Nazuninha Bot** usa el **modo multidispositivo** de WhatsApp, así que no necesitas el celular encendido tras configurar. Elige una opción:

1. **Código QR**  
   - El terminal mostrará un código QR (un cuadrado con patrones).  
   - En tu celular, abre WhatsApp:  
     1. Ve a **Configuración** (o tres puntos).  
     2. Toca **Dispositivos Vinculados**.  
     3. Toca **Vincular un Dispositivo**.  
     4. Escanea el código con la cámara.  
   - ¡Listo! El bot dirá que está conectado.

2. **Código de Vinculación**  
   - Elige esto si no quieres escanear.  
   - Escribe tu número (ej.: `+34912345678`).  
   - El terminal te dará un código (como `1234-5678`).  
   - En WhatsApp:  
     1. Ve a **Configuración > Dispositivos Vinculados**.  
     2. Toca **Vincular con Número de Teléfono**.  
     3. Escribe el código.  
   - El bot se conectará solo.

> ⚠️ **Cuidado**:  
> - Usa un **número secundario** para proteger tu WhatsApp principal.  
> - Si el código QR expira, escribe `npm start` otra vez.  
> - Tras conectar, el bot guarda tu sesión, así no necesitas reconectar a menos que cierres sesión.

#### 🔄 **Actualizando el Bot**

¿Quieres lo nuevo? Actualiza con:  
```bash
npm run update
```

Esto mantiene el bot al día sin borrar tus ajustes ni chats.

> ✅ **Sin Miedo**: Actualizar es seguro y no desordena nada.

#### 💻 **Usando Termux (Android)**

**Termux** es una app para usar **Nazuninha Bot** en tu celular Android. ¡Perfecto si no tienes computadora! Sigue estos pasos:

1. **Instalar Termux**  
   - Descarga Termux desde [F-Droid](https://f-droid.org) u otra fuente confiable (la versión de Google Play está vieja).  
   - Abre Termux y escribe:  
     ```bash
     pkg update && pkg upgrade -y
     ```  
     Esto actualiza Termux.

2. **Añadir Node.js**  
   ```bash
   pkg install nodejs -y
   ```  
   Esto hace que el bot funcione.

3. **Permitir Almacenamiento**  
   ```bash
   termux-setup-storage
   ```  
   Di “sí” si pide permisos.

4. **Ir al Almacenamiento del Celular**  
   ```bash
   cd /sdcard
   ```  
   Aquí guardaremos el bot.

5. **Descargar el Bot**  
   ```bash
   git clone https://github.com/hiudyy/nazuninha-bot.git
   cd nazuninha-bot
   ```

6. **Instalar Herramientas**  
   ```bash
   npm run config
   npm run config:install
   ```

7. **Iniciar el Bot**  
   ```bash
   npm start
   ```  
   Conecta con código QR o de vinculación (mira [Conectando a WhatsApp](#-conectando-a-whatsapp)).

**Reiniciando el Bot**:  
- Si cierras Termux o el celular se apaga, no pasa nada. Para volver:  
  1. Abre Termux.  
  2. Escribe:  
     ```bash
     cd /sdcard/nazuninha-bot
     npm start
     ```  
  3. Si no cerraste sesión, el bot reconecta solo.  
- **Consejo**: Si pide código QR otra vez, la sesión pudo haber expirado. Reconecta normal.

**Mantener Termux Encendido**:  
- Para que el bot esté online 24/7, no cierres Termux. Usa una app de “mantener despierto” o deja el celular cargando para que no duerma.  
- Si se detiene, repite los pasos de reinicio.

> **Truco**: Si el bot no arranca, prueba `npm install` o mira [¡Ayuda! Algo salió Mal](#-ayuda-algo-salió-mal).

#### ❓ **¡Ayuda! Algo salió Mal**

¿Nuevo con bots? Resolvemos problemas comunes:

- **“Comando no encontrado” (ej.: git, node)**  
  - Necesitas instalar Git o Node.js. Mira [Antes de Empezar](#-antes-de-empezar) para links.  
  - En Termux, prueba `pkg install git` o `pkg install nodejs`.

- **Código QR No Funciona**  
  - Asegúrate de que WhatsApp esté actualizado.  
  - Si expira, escribe `npm start` para uno nuevo.  
  - Revisa tu internet.

- **Bot No Conecta**  
  - Reinicia con `npm start`.  
  - Borra la carpeta `sessions` (en la carpeta del bot) y reconecta.  
  - Usa otro número si WhatsApp bloquea el actual.

- **Errores al Instalar**  
  - Escribe `npm install` para arreglar archivos faltantes.  
  - Confirma que Node.js es versión 18+ (mira con `node -v`).  
  - En Termux, actualiza con `pkg update`.

- **Bot Se Detiene en Termux**  
  - El celular puede cerrar Termux. Mantenlo encendido o usa “mantener despierto”.  
  - Reinicia con `cd /sdcard/nazuninha-bot && npm start`.

> 😊 **¿Aún perdido?** Únete a nuestro [Canal de WhatsApp](https://whatsapp.com/channel/0029Vb6Ezk6LI8YXPgZPUJ2b) para ayuda.

#### 💖 **Apóyanos**

Hacer **Nazuninha Bot** genial requiere mucho esfuerzo. Si te gusta, ayúdanos a seguir:

- **🌍 Todo el Mundo (Patreon)**  
  Apoya desde cualquier lugar.  
  [![Support on Patreon](https://img.shields.io/badge/Support-Patreon-orange?style=for-the-badge&logo=patreon)](https://patreon.com/hiudyy)

- **🇧🇷 Brasil (Pix)**  
  Envía una donación a:  
  **Clave Pix (Correo):** `lua.bot@hotmail.com`

Cualquier apoyo cuenta. ¡Gracias por querer a **Nazuninha Bot**! ❤️

#### 📜 **Reglas (Licencia)**

© 2025 **Hiudy**. Todos los derechos reservados.

El bot está **protegido por derechos de autor**. No puedes quitar créditos, venderlo ni compartir versiones modificadas sin permiso. Si lo haces, podrías meterte en problemas legales.

#### 👤 **¿Quién lo Hizo?**

Creado con ❤️ por [**Hiudy**](https://github.com/hiudyy).  
[![Hiudy's Profile](https://github-readme-stats.vercel.app/api?username=hiudyy&show_icons=true&theme=dracula&locale=es)](https://github.com/hiudyy)

¿Te gusta? ¡Dale una ⭐ en GitHub y compártelo con amigos!

---

## 🇮🇩 **Bahasa Indonesia**

### 🤖 **Apa itu Nazuninha Bot?**

**Nazuninha Bot** adalah bot WhatsApp yang sangat keren, dibuat dengan **Node.js** dan **Baileys**. Ini seperti pisau serbaguna—cocok untuk mengotomatiskan tugas, mengelola grup, atau bersenang-senang dengan fitur-fitur menarik! Bahkan jika kamu pemula, bot ini mudah diatur dan digunakan.

> ⚠️ **Penting**: Bot ini **dilindungi hak cipta**. Jangan hapus kredit atau coba menjualnya—itu dilarang, dan kami bisa mengambil tindakan hukum.

### 🎉 **Mengapa Pakai Nazuninha Bot?**

- **Pemasangan Mudah**: Hubungkan dengan kode QR atau nomor dalam hitungan menit.
- **Banyak Fitur**: Kelola grup, gunakan perintah seru, dan lainnya!
- **Bisa di Mana Saja**: Komputer, ponsel, atau Termux (aplikasi Android).
- **Selalu Update**: Kami tambah fitur baru dan perbaiki bug rutin.
- **Cepat & Aman**: Jaga chatmu aman dan berjalan lancar.

### 📜 **Daftar Isi**

- [📋 Sebelum Mulai](#-sebelum-mulai)
- [📥 Cara Pasang](#-cara-pasang)
- [🚀 Menyalakan Bot](#-menyalakan-bot)
- [🔌 Menghubungkan ke WhatsApp](#-menghubungkan-ke-whatsapp)
- [🔄 Memperbarui Bot](#-memperbarui-bot)
- [💻 Pakai Termux (Android)](#-pakai-termux-android)
- [❓ Bantuan! Ada Masalah](#-bantuan-ada-masalah)
- [💖 Dukung Kami](#-dukung-kami)
- [📜 Aturan (Lisensi)](#-aturan-lisensi)
- [👤 Siapa Pembuatnya?](#-siapa-pembuatnya)

#### 📋 **Sebelum Mulai**

Ini yang kamu butuhkan untuk menjalankan **Nazuninha Bot**:

- **Node.js**: Program untuk bot (versi 18 atau lebih baru). Unduh di [nodejs.org](https://nodejs.org).
- **Git**: Alat untuk mengunduh file bot. Ambil di [git-scm.com](https://git-scm.com).
- **WhatsApp**: Nomor telepon untuk bot. **Tips**: Pakai nomor baru, bukan nomor utamamu, biar aman.
- **Internet**: Koneksi stabil untuk pengaturan dan penggunaan.
- **Komputer atau Ponsel**: Perangkat untuk mengetik perintah (seperti terminal atau aplikasi Termux).

> 😅 **Baru di sini?** Tenang, kami pandu langkah demi langkah!

#### 📥 **Cara Pasang**

Mari siapkan bot di perangkatmu:

1. **Unduh File Bot**  
   Buka terminal (atau Command Prompt) dan ketik:  
   ```bash
   git clone https://github.com/hiudyy/nazuninha-bot.git
   cd nazuninha-bot
   ```  
   Ini mengunduh bot dan masuk ke foldernya.

2. **Tambah Alat yang Dibutuhkan**  
   Ketik perintah ini satu per satu:  
   ```bash
   npm run config
   npm run config:install
   ```  
   Ini memasang semua yang bot butuhkan.

   > **Macets?** Jika ada error, pastikan Node.js terpasang (cek dengan `node -v`). Coba juga ketik `npm install` untuk memperbaiki.

#### 🚀 **Menyalakan Bot**

Untuk menyalakan **Nazuninha Bot**, ketik:  
```bash
npm start
```

Bot akan tanya cara menghubungkan ke WhatsApp (lihat [Menghubungkan ke WhatsApp](#-menghubungkan-ke-whatsapp)).

> **Pertama Kali?** Kamu perlu hubungkan dengan kode QR atau nomor. Setelah itu, biasanya otomatis!

#### 🔌 **Menghubungkan ke WhatsApp**

**Nazuninha Bot** pakai **mode multi-perangkat** WhatsApp, jadi ponselmu tak perlu online setelah pengaturan. Pilih salah satu cara:

1. **Kode QR**  
   - Terminal akan tunjukkan kode QR (kotak dengan pola).  
   - Di ponselmu, buka WhatsApp:  
     1. Masuk **Pengaturan** (atau tiga titik).  
     2. Ketuk **Perangkat Tertaut**.  
     3. Ketuk **Tautkan Perangkat**.  
     4. Pindai kode QR dengan kamera ponsel.  
   - Selesai! Bot akan bilang sudah terhubung.

2. **Kode Pasangan**  
   - Pilih ini kalau tak mau pindai.  
   - Masukkan nomor teleponmu (misal: `+6281234567890`).  
   - Terminal akan beri kode (contoh: `1234-5678`).  
   - Di WhatsApp:  
     1. Masuk **Pengaturan > Perangkat Tertaut**.  
     2. Ketuk **Tautkan dengan Nomor Telepon**.  
     3. Ketik kode.  
   - Bot akan terhubung otomatis.

> ⚠️ **Perhatian**:  
> - Pakai **nomor kedua** agar WhatsApp utamamu aman.  
> - Jika kode QR kadaluarsa, ketik `npm start` lagi.  
> - Setelah terhubung, bot simpan sesimu, jadi tak perlu sambung ulang kecuali kamu logout.

#### 🔄 **Memperbarui Bot**

Mau fitur terbaru? Perbarui dengan:  
```bash
npm run update
```

Ini bikin bot tetap fresh tanpa hapus pengaturan atau chatmu.

> ✅ **Aman**: Pembaruan tak akan rusak botmu.

#### 💻 **Pakai Termux (Android)**

**Termux** adalah aplikasi untuk jalankan **Nazuninha Bot** di ponsel Android. Cocok kalau tak punya komputer! Ikuti langkah ini:

1. **Pasang Termux**  
   - Unduh Termux dari [F-Droid](https://f-droid.org) atau sumber terpercaya (versi Google Play sudah tua).  
   - Buka Termux dan ketik:  
     ```bash
     pkg update && pkg upgrade -y
     ```  
     Ini perbarui Termux.

2. **Tambah Node.js**  
   ```bash
   pkg install nodejs -y
   ```  
   Ini bikin bot bisa jalan.

3. **Izinkan Akses Penyimpanan**  
   ```bash
   termux-setup-storage
   ```  
   Bilang “ya” kalau diminta izin.

4. **Masuk ke Penyimpanan Ponsel**  
   ```bash
   cd /sdcard
   ```  
   Di sinilah bot akan disimpan.

5. **Unduh Bot**  
   ```bash
   git clone https://github.com/hiudyy/nazuninha-bot.git
   cd nazuninha-bot
   ```

6. **Pasang Alat**  
   ```bash
   npm run config
   npm run config:install
   ```

7. **Nyalakan Bot**  
   ```bash
   npm start
   ```  
   Hubungkan dengan kode QR atau kode pasangan (lihat [Menghubungkan ke WhatsApp](#-menghubungkan-ke-whatsapp)).

**Menyalakan Ulang Bot**:  
- Kalau Termux tertutup atau ponsel mati, tenang! Untuk nyalakan lagi:  
  1. Buka Termux.  
  2. Ketik:  
     ```bash
     cd /sdcard/nazuninha-bot
     npm start
     ```  
  3. Kalau tak logout, bot akan sambung otomatis.  
- **Tips**: Jika minta kode QR lagi, sesi mungkin kadaluarsa. Sambung ulang seperti biasa.

**Jaga Termux Tetap Nyala**:  
- Supaya bot online 24/7, jangan tutup Termux. Pakai aplikasi “tetap aktif” atau cas ponsel agar tak tidur.  
- Jika berhenti, ulangi langkah nyalakan ulang.

> **Petunjuk**: Jika bot tak nyala, coba `npm install` atau lihat [Bantuan! Ada Masalah](#-bantuan-ada-masalah).

#### ❓ **Bantuan! Ada Masalah**

Baru pakai bot? Ini solusi untuk masalah umum:

- **“Perintah tak ditemukan” (misal: git, node)**  
  - Kamu perlu pasang Git atau Node.js. Lihat [Sebelum Mulai](#-sebelum-mulai) untuk link.  
  - Di Termux, coba `pkg install git` atau `pkg install nodejs`.

- **Kode QR Tak Bekerja**  
  - Pastikan WhatsAppmu diperbarui.  
  - Jika kadaluarsa, ketik `npm start` untuk kode baru.  
  - Cek koneksi internetmu.

- **Bot Tak Terhubung**  
  - Mulai ulang dengan `npm start`.  
  - Hapus folder `sessions` (di folder bot) dan sambung ulang.  
  - Pakai nomor lain jika WhatsApp blokir nomor saat ini.

- **Error Saat Pasang**  
  - Ketik `npm install` untuk perbaiki file hilang.  
  - Pastikan Node.js versi 18+ (cek dengan `node -v`).  
  - Di Termux, perbarui dengan `pkg update`.

- **Bot Berhenti di Termux**  
  - Ponsel mungkin menutup Termux. Jaga ponsel nyala atau pakai “tetap aktif”.  
  - Nyalakan ulang dengan `cd /sdcard/nazuninha-bot && npm start`.

> 😊 **Masih Bingung?** Gabung ke [Kanal WhatsApp](https://whatsapp.com/channel/0029Vb6Ezk6LI8YXPgZPUJ2b) untuk bantuan!

#### 💖 **Dukung Kami**

Membuat **Nazuninha Bot** hebat butuh banyak kerja. Jika suka, bantu kami lanjutkan:

- **🌍 Seluruh Dunia (Patreon)**  
  Dukung dari mana saja!  
  [![Support on Patreon](https://img.shields.io/badge/Support-Patreon-orange?style=for-the-badge&logo=patreon)](https://patreon.com/hiudyy)

- **🇧🇷 Brasil (Pix)**  
  Kirim donasi ke:  
  **Kunci Pix (Email):** `lua.bot@hotmail.com`

Sekecil apa pun bantuannya sangat berarti. Terima kasih atas cinta untuk **Nazuninha Bot**! ❤️

#### 📜 **Aturan (Lisensi)**

© 2025 **Hiudy**. Semua hak dilindungi.

Bot ini **dilindungi hak cipta**. Kamu **tak boleh** hapus kredit, jual, atau bagikan versi modifikasi tanpa izin. Melanggar bisa berujung masalah hukum.

#### 👤 **Siapa Pembuatnya?**

Dibuat dengan ❤️ oleh [**Hiudy**](https://github.com/hiudyy).  
[![Hiudy's Profile](https://github-readme-stats.vercel.app/api?username=hiudyy&show_icons=true&theme=dracula&locale=id)](https://github.com/hiudyy)

Suka bot ini? Beri ⭐ di GitHub dan ajak temenmu!

---