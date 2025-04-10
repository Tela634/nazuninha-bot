function clearMemory() {
  console.log(`[${new Date().toISOString()}] Limpando memória e cache...`);
  Object.keys(require.cache).forEach(key => {
    delete require.cache[key];
  });
  if (global.gc) {
    global.gc();
    console.log("Garbage collection forçada.");
  } else {
    console.warn("Garbage collection não está exposta. Rode o app com --expose-gc");
  }
  console.log("Limpeza concluída.");
}

console.log('Limpeza programada.');
setInterval(clearMemory, 30 * 60 * 1000);

module.exports = clearMemory;