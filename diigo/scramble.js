// this script encrypts personal content of an outliner JSON dump
// usage: node scramble.js diigo-outliner-private.json >diigo-outliner-sample.json

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

const makeScramblerWithCustomRules = ({ rules }) => content => {
  const detectionRegEx = rules[0].detectionRegEx; // TODO: new RegExp(rules.map(regex => `(${regex.toString()})`).join('|'));
  if (!content.match(detectionRegEx)) {
    return scrambleText(content);
  }
  const plainTexts = content.split(detectionRegEx).map(scrambleText);
  let scrambled = '';
  //console.warn(`detected matches for rule ${rules[0].detectionRegEx} => splitted in ${plainTexts.length}`);

  const getReplacements = rule => {
    const replacements = [];
    while (lastMatch = (rule.extractionRegEx || rule.detectionRegEx).exec(content)) {
      //console.warn('=>', rule.renderMatch(lastMatch));
      //customRenders.push(rule.renderMatch(lastMatch));
      replacements.push(rule.renderMatch(lastMatch));
    }
    return replacements;  
  };

  const replacements = getReplacements(rules[0]);
  scrambled += replacements.map(replacement => plainTexts.shift() + replacement).join('');

  // console.warn('=>', scrambled);
  return scrambled + plainTexts.join('');
};

const scrambleContent = content => {
  const rules = [
    {
      detectionRegEx: /<span class=\"diigoItemFlag\">\{[^\}]*\}<\/span>/g,
      extractionRegEx: /<span class=\"diigoItemFlag\">(\{[^\}]*\})<\/span>/g,
      renderMatch: match => {
        const link = JSON.parse(match[1]);
        // const scrambleText = makeScrambler(); // make a separate scrambler, in order to avoid side effects to scrambling of plain-text content
        const data = {
          ...link,
          title: scrambleText(link.title),
          url: link.url ? scrambleText(link.url) : undefined,
        };
        return `<span class="diigoItemFlag">${JSON.stringify(data)}</span>`;
      },
    },
    // {
    //   detectionRegEx: /<a [^>]*>[^<]*<\/a>/g,
    //   extractionRegEx: /<a .*href=\"([^\"]*)\"[^>]*>([^<]*)<\/a>/g,
    //   renderMatch: ([ fullMatch, url, title ]) =>
    //     `<a href="${scrambleText(url)}">${scrambleText(title)}</a>`,
    // },
  ];
  const scrambleWithCustomRule = makeScramblerWithCustomRules({ rules });
  return scrambleWithCustomRule(content);
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
