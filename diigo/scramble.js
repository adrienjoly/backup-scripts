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

const makeLetterPicker = () => () => 'a'; // makeCharacterPicker('abcdefghijklmnopqrstuvwxyz'); // TODO: re-enable
const makeNumberPicker = () => makeCharacterPicker('0123456789');

const makeScrambler = () => {
  const pickLetter = makeLetterPicker();
  const pickNumber = makeNumberPicker();
  
  const scrambleText = text => text
    // .replace(/[0-9]/g, pickNumber) // TODO: re-enable
    .replace(/[a-z]/g, pickLetter)
    .replace(/[A-Z]/g, () => pickLetter().toUpperCase());

  return scrambleText;
};

const scrambleText = makeScrambler();

const RE_JSON_LINK = /<span class=\"diigoItemFlag\">(\{[^\}]*\})<\/span>/g;
const RE_LINK = /<span class=\"diigoItemFlag\">\{[^\}]*\}<\/span>/g;

const scrambleContent = content => {
  const plainTexts = content.split(RE_LINK).map(scrambleText);
  let jsonLinks = [];
  let lastMatch;
  while (lastMatch = RE_JSON_LINK.exec(content)) {
    const link = JSON.parse(lastMatch[1]);
    // const scrambleText = makeScrambler(); // make a separate scrambler, in order to avoid side effects to scrambling of plain-text content
    jsonLinks.push({
      ...link,
      title: scrambleText(link.title),
      url: link.url ? scrambleText(link.url) : undefined,
    });
  }
  const renderJsonLink = json => !json ? '' : `<span class="diigoItemFlag">${JSON.stringify(json)}</span>`;
  const scrambled = plainTexts
    .map(text => text + renderJsonLink(jsonLinks.shift()))
    .join('');
  // console.warn('=>', scrambled);
  return scrambled;
  // TODO: also leave HTML elements as is
};

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

// const twoLinks = '[side-project] Player whyd local ? &lt;-- <span class=\"diigoItemFlag\">{\"title\":\"1.\",\"url\":\"http://electron.atom.io\"}</span><span></span> coucou [side-project] Player whyd local ? &lt;-- <span class=\"diigoItemFlag\">{\"title\":\"2.\",\"url\":\"http://electron.atom.io\"}</span><span></span>';

// console.log(scrambleContent(twoLinks));
