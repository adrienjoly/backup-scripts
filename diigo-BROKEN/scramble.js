// this script encrypts personal content of an outliner JSON dump
// usage: node scramble.js diigo-outliner-private.json >diigo-outliner-sample.json

const { scrambleNode } = require('./src/scrambler');

const filename = process.argv[2] || 'diigo-outliner-private.json';

console.warn(`reading ${filename} ...`);
const json = require(`./${filename}`);

const scrambled = {
  data: {
    bulletpoints: json.data.bulletpoints.map(scrambleNode),
  },
};

console.log(JSON.stringify(scrambled, null, 2))

// const twoLinks = '[side-project] Player whyd local ? &lt;-- <span class=\"diigoItemFlag\">{\"title\":\"1.\",\"url\":\"http://electron.atom.io\"}</span><span></span> coucou [side-project] Player whyd local ? &lt;-- <span class=\"diigoItemFlag\">{\"title\":\"2.\",\"url\":\"http://electron.atom.io\"}</span><span></span>';

// console.log(scrambleContent(twoLinks));
