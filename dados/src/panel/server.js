const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 2012;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Store bot statistics
let botStats = {
    groups: 0,
    commandsExecuted: 0,
    messagesReceived: 0,
    messagesSent: 0,
    startTime: null,
    premiumUsers: []
};

// Format uptime duration
function formatUptime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);
    
    return parts.join(' ');
}

// Get premium users
function getPremiumUsers() {
    const premiumPath = path.join(__dirname, '../..', 'database', 'premium');
    let premiumUsers = [];
    
    if (fs.existsSync(premiumPath)) {
        const files = fs.readdirSync(premiumPath);
        premiumUsers = files
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const data = JSON.parse(fs.readFileSync(path.join(premiumPath, file)));
                return {
                    id: file.replace('.json', ''),
                    name: data.name || 'Unknown User',
                    expiresAt: data.expiresAt || 'Never',
                    avatar: data.avatar || '/img/default-avatar.png'
                };
            });
    }
    
    return premiumUsers;
}

// Get group details including systems and top users
function getGroupDetails(groupId) {
    const groupPath = path.join(__dirname, '../..', 'database', 'grupos', `${groupId}.json`);
    if (!fs.existsSync(groupPath)) return null;

    const data = JSON.parse(fs.readFileSync(groupPath));
    return {
        id: groupId,
        name: data.name || 'Unknown Group',
        members: data.members || 0,
        image: data.image || '/img/default-group.png',
        systems: {
            antilink: data.antilink || false,
            welcome: data.welcome || false,
            antiflood: data.antiflood || false
        },
        topUsers: data.ranking ? 
            Object.entries(data.ranking)
                .map(([id, msgs]) => ({ id, messages: msgs }))
                .sort((a, b) => b.messages - a.messages)
                .slice(0, 3) : []
    };
}

// Initialize bot stats from database
function initBotStats() {
    botStats.startTime = Date.now();
    const dbPath = path.join(__dirname, '../..', 'database', 'panel');
    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
    }
    const statsPath = path.join(dbPath, 'stats.json');
    if (fs.existsSync(statsPath)) {
        const savedStats = JSON.parse(fs.readFileSync(statsPath));
        botStats = { ...botStats, ...savedStats };
    }
    
    // Update premium users
    botStats.premiumUsers = getPremiumUsers();
}

// Update bot stats
function updateStats() {
    const statsPath = path.join(__dirname, '../..', 'database', 'panel', 'stats.json');
    fs.writeFileSync(statsPath, JSON.stringify(botStats));
}

// Routes
app.get('/', (req, res) => {
    const uptime = botStats.startTime ? formatUptime(Date.now() - botStats.startTime) : '0s';
    res.render('dashboard', { 
        stats: botStats,
        uptime: uptime
    });
});

app.get('/groups', (req, res) => {
    const groupsPath = path.join(__dirname, '../..', 'database', 'grupos');
    let groups = [];
    
    if (fs.existsSync(groupsPath)) {
        const files = fs.readdirSync(groupsPath);
        groups = files
            .filter(file => file.endsWith('.json'))
            .map(file => getGroupDetails(file.replace('.json', '')))
            .filter(group => group !== null);
    }
    
    res.render('groups', { groups });
});

// Export functions to update stats from bot
module.exports = {
    startServer: () => {
        initBotStats();
        app.listen(port, () => {
            console.log(`Panel running at http://localhost:${port}`);
        });
    },
    updateStats: (newStats) => {
        botStats = { ...botStats, ...newStats };
        updateStats();
    },
    incrementStat: (stat) => {
        if (stat in botStats) {
            botStats[stat]++;
            updateStats();
        }
    }
};
