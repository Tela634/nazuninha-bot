const { googleIt, googleImage } = require('@bochilteam/scraper');

async function searchText(text) {
  try {
    const search = await googleIt(text);
    const result = search.articles.map(({ title, url, description }) => {return `*${title}*\n_${url}_\n_${description}_`}).join('\n\n');
    return { ok: true, image: `https://image.thum.io/get/fullpage/https://google.com/search?q=${encodeURIComponent(text)}`, text: result, array: search.articles };
  } catch(e) {
    console.error(e);
    return { ok: false };
  };
};

async function searchImage(text) {
  try {
    const res = await googleImage(text);
    return { ok: true, result: res };
  } catch(e) {
    console.error(e);
    return { ok: false };
  };
};

module.exports = { search: searchText, image: searchImage };