// this script encrypts personal content of an outliner JSON dump

const filename = process.argv[2] || 'diigo-outliner-private.json';

console.warn(`reading ${filename} ...`);
const json = require(`./${filename}`);

const makeCharacterPicker = characters => {
  let next = 0;
  return () => {
    const char = characters[next];
    next = (next + 1) % characters.length;
    return char;
  };
}

const pickLetter = makeCharacterPicker('abcdefghijklmnopqrstuvwxyz');
const pickNumber = makeCharacterPicker('0123456789');

const scrambleText = text => text
  .replace(/[0-9]/g, pickNumber)
  .replace(/[a-z]/g, pickLetter)
  .replace(/[A-Z]/g, () => pickLetter().toUpperCase())

const scrambleContent = scrambleText; // TODO: leave HTML elements and JSON fields as is

const scrambleNode = node => ({
  ...node,
  content: scrambleContent(node.content),
  description: scrambleText(node.description),
});

const scrambled = {
  data: {
    bulletpoints: json.data.bulletpoints.map(scrambleNode),
  },
};

console.log(JSON.stringify(scrambled, null, 2))
