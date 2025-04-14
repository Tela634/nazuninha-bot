// Sistema de Limpeza de Memória
// Criado por Hiudy (adaptado)
// Mantenha os créditos, por favor! <3

/**
 * Limpa o cache de módulos e força a coleta de lixo
 * @param {boolean} [log=true] - Exibir logs no console
 * @returns {void}
 */
function clearMemory(log = true) {
  const timestamp = new Date().toISOString();

  try {
    if (log) {
      console.log(`[${timestamp}] Iniciando limpeza de memória e cache...`);
    }

    // Limpa o cache de módulos, exceto módulos críticos
    const protectedModules = [
      /node_modules/
    ];

    let clearedCount = 0;
    Object.keys(require.cache).forEach((key) => {
      if (!protectedModules.some((pattern) => key.match(pattern))) {
        delete require.cache[key];
        clearedCount++;
      }
    });

    // Força a coleta de lixo se disponível
    if (global.gc) {
      global.gc();
      if (log) {
        console.log(`[${timestamp}] Garbage collection executada. ${clearedCount} módulos removidos do cache.`);
      }
    } else if (log) {
      console.warn(`[${timestamp}] Garbage collection não disponível. Considere usar --expose-gc`);
    }

    if (log) {
      console.log(`[${timestamp}] Limpeza concluída.`);
    }
  } catch (error) {
    console.error(`[${timestamp}] Erro durante a limpeza de memória:`, error.message);
  }
}

/**
 * Agenda a limpeza periódica (opcional)
 * @param {number} [intervalMinutes=30] - Intervalo em minutos
 * @returns {NodeJS.Timeout} - ID do intervalo
 */
function scheduleClearMemory(intervalMinutes = 30) {
  const intervalMs = intervalMinutes * 60 * 1000;
  console.log(`[${new Date().toISOString()}] Limpeza programada a cada ${intervalMinutes} minutos.`);
  return setInterval(() => clearMemory(true), intervalMs);
}

// Agenda a limpeza (comente esta linha se preferir chamar manualmente)
scheduleClearMemory(30);

module.exports = { clearMemory, scheduleClearMemory };