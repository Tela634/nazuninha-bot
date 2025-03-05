const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json')));
const port = config.panelPort || 2012;

// Set EJS as templating engine with new paths
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '.views'));

// Serve static files from new path
app.use(express.static(path.join(__dirname, '.public')));

// Store bot statistics with enhanced tracking
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

// Get premium users with enhanced error handling
function getPremiumUsers() {
    const premiumPath = path.join(__dirname, '../..', 'database', 'premium');
    let premiumUsers = [];
    
    try {
        if (fs.existsSync(premiumPath)) {
            const files = fs.readdirSync(premiumPath);
    premiumUsers = files
        .filter(file => file.endsWith('.json'))
        .map(file => {
            try {
                const data = JSON.parse(fs.readFileSync(path.join(premiumPath, file), 'utf8'));
                const userId = file.replace('.json', '');
                // Try to get pushname from group data
                let pushname = 'Unknown User';
                const groupsPath = path.join(__dirname, '../..', 'database', 'grupos');
                if (fs.existsSync(groupsPath)) {
                    const groupFiles = fs.readdirSync(groupsPath);
                    for (const groupFile of groupFiles) {
                        try {
                            const groupData = JSON.parse(fs.readFileSync(path.join(groupsPath, groupFile), 'utf8'));
                            if (groupData.contador) {
                                const userEntry = groupData.contador.find(entry => entry.id === userId);
                                if (userEntry && userEntry.pushname) {
                                    pushname = userEntry.pushname;
                                    break;
                                }
                            }
                        } catch (e) {
                            console.error(`Error reading group file ${groupFile}:`, e);
                        }
                    }
                }
                return {
                    id: userId,
                    name: pushname,
                    expiresAt: data.expiresAt || 'Never',
                    avatar: data.avatar || '/img/default-avatar.png'
                };
            } catch (err) {
                console.error(`Error reading premium user file ${file}:`, err);
                return null;
            }
        })
        .filter(user => user !== null);
        }
    } catch (err) {
        console.error('Error accessing premium users directory:', err);
    }
    
    return premiumUsers;
}

// Enhanced group details function with additional information
function getGroupDetails(groupId, detailed = false) {
    try {
        const groupPath = path.join(__dirname, '../..', 'database', 'grupos', `${groupId}.json`);
        if (!fs.existsSync(groupPath)) return null;

        const data = JSON.parse(fs.readFileSync(groupPath, 'utf8'));
        
        // Basic group info for list view
        const basicInfo = {
            id: groupId,
            name: data.name || 'Unknown Group',
            members: data.members || 0,
            image: data.image || '/img/default-group.png'
        };

        // Return basic info if detailed view is not requested
        if (!detailed) return basicInfo;

        // Enhanced information for detailed view
        return {
            ...basicInfo,
            description: data.desc || 'No description available',
            adminCount: Array.isArray(data.admins) ? data.admins.length : 0,
            stats: {
                messagesReceived: data.totalMessages || 0,
                commandsExecuted: data.totalCommands || 0,
                messagesSent: data.totalSent || 0
            },
            systems: {
                antilink: data.antilink || false,
                welcome: data.welcome || false,
                antiflood: data.antiflood || false
            },
            topUsers: data.ranking ? 
                Object.entries(data.ranking)
                    .map(([id, info]) => ({
                        pushname: info.pushname || 'Unknown User',
                        number: id.replace(/(\d{4})\d+/, '$1********'),
                        messages: info.messages || 0
                    }))
                    .sort((a, b) => b.messages - a.messages)
                    .slice(0, 5) : []
        };
    } catch (err) {
        console.error(`Error getting group details for ${groupId}:`, err);
        return null;
    }
}

// Initialize bot stats from database
function initBotStats() {
    try {
        botStats.startTime = Date.now();
        const dbPath = path.join(__dirname, '../..', 'database', 'panel');
        if (!fs.existsSync(dbPath)) {
            fs.mkdirSync(dbPath, { recursive: true });
        }
        const statsPath = path.join(dbPath, 'stats.json');
        if (fs.existsSync(statsPath)) {
            const savedStats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
            botStats = { ...botStats, ...savedStats };
        }
        
        // Update premium users
        botStats.premiumUsers = getPremiumUsers();
    } catch (err) {
        console.error('Error initializing bot stats:', err);
    }
}

// Update bot stats with error handling
function updateStats() {
    try {
        const statsPath = path.join(__dirname, '../..', 'database', 'panel', 'stats.json');
        fs.writeFileSync(statsPath, JSON.stringify(botStats, null, 2), 'utf8');
    } catch (err) {
        console.error('Error updating stats:', err);
    }
}

// Update user's pushname in group ranking
function updateUserPushname(groupId, userId, pushname) {
    try {
        const groupPath = path.join(__dirname, '../..', 'database', 'grupos', `${groupId}.json`);
        if (!fs.existsSync(groupPath)) return;

        const data = JSON.parse(fs.readFileSync(groupPath, 'utf8'));
        if (!data.ranking) data.ranking = {};
        if (!data.ranking[userId]) {
            data.ranking[userId] = { messages: 0, pushname };
        } else {
            data.ranking[userId].pushname = pushname;
        }

        fs.writeFileSync(groupPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Error updating pushname for user ${userId} in group ${groupId}:`, err);
    }
}

// Routes
app.get('/', (req, res) => {
    const uptime = botStats.startTime ? formatUptime(Date.now() - botStats.startTime) : '0s';
    res.render('.dashboard', { 
        stats: botStats,
        uptime: uptime
    });
});

app.get('/groups', (req, res) => {
    try {
        const groupsPath = path.join(__dirname, '../..', 'database', 'grupos');
        let groups = [];
        
        if (fs.existsSync(groupsPath)) {
            const files = fs.readdirSync(groupsPath);
            groups = files
                .filter(file => file.endsWith('.json'))
                .map(file => getGroupDetails(file.replace('.json', '')))
                .filter(group => group !== null);
        }
        
        res.render('.groups', { groups });
    } catch (err) {
        console.error('Error fetching groups:', err);
        res.status(500).send('Error fetching groups');
    }
});

// New route for detailed group view
app.get('/group/:id', (req, res) => {
    try {
        const groupDetails = getGroupDetails(req.params.id, true);
        if (!groupDetails) {
            return res.status(404).send('Group not found');
        }
        res.render('.group-details', { group: groupDetails });
    } catch (err) {
        console.error('Error fetching group details:', err);
        res.status(500).send('Error fetching group details');
    }
});

// New API endpoint for real-time stats
app.get('/api/stats', (req, res) => {
    const uptime = botStats.startTime ? formatUptime(Date.now() - botStats.startTime) : '0s';
    res.json({ 
        ...botStats,
        uptime 
    });
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
    },
    updateUserPushname: updateUserPushname
};
