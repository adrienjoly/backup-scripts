const assert = require('assert');
const { DiigoItemFlag, DiigoLink, DiigoFormatting } = require('./diigo');

// sorting criteria
const byPos = (a, b) => a.pos - b.pos;

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
  const combinedRegex = rules.map(({ detectionRegEx }) =>
    `(?:${ detectionRegEx.toString().substring(1, detectionRegEx.toString().length - 2) })`
  ).join('|')
  const detectionRegEx = new RegExp(combinedRegex, 'g');

  // optimisation: quit early if content does not require any custom replacements
  if (!content.match(detectionRegEx)) {
    return scrambleText(content);
  }

  // get rid of parts that need custom scrambling
  const plainTexts = content.split(detectionRegEx).map(scrambleText);
  const nbSplits = plainTexts.length;

  // given a replacement rule, this function generates an array of replacements to be done in the content
  const getReplacements = rule => {
    const replacements = [];
    let lastMatch;
    while ((lastMatch = (rule.extractionRegEx || rule.detectionRegEx).exec(content)) !== null) {
      replacements.push({
        pos: lastMatch.index,
        replacement: rule.renderMatch(lastMatch),
      });
    }
    return replacements;  
  };

  const scrambledReplacements = rules
    .map(getReplacements)
    .reduce((flattened, arr) => [...flattened, ...arr], []) // flatMap would be awesome
    .sort(byPos)
    .map(({ replacement }) => plainTexts.shift() + replacement);

  assert.equal(nbSplits, scrambledReplacements.length + 1);
  return scrambledReplacements.join('') + plainTexts.join('');
};

const scrambleContent = content => {
  const rules = [
    {
      ...DiigoItemFlag,
      renderMatch: match => {
        const link = DiigoItemFlag.getMatchData(match);
        // const scrambleText = makeScrambler(); // make a separate scrambler, in order to avoid side effects to scrambling of plain-text content
        return DiigoItemFlag.renderFromData({
          ...link,
          title: scrambleText(link.title),
          url: link.url ? scrambleText(link.url) : undefined,
        });
      },    
    },
    {
      ...DiigoLink,
      renderMatch: ([ fullMatch, url, title ]) => DiigoLink.renderFromData({
        url: scrambleText(url),
        title: scrambleText(title),
      }),
    },
    {
      ...DiigoFormatting,
      renderMatch: ([ fullMatch, classes, text ]) => DiigoFormatting.renderFromData({
        classes,
        text: scrambleText(text),
      }),
    },
  ];
  const scrambleWithCustomRule = makeScramblerWithCustomRules({ rules });
  return scrambleWithCustomRule(content);
  // TODO: also leave HTML elements as is
};

const scrambleNode = node => ({
  ...node,
  content: scrambleContent(node.content),
  description: scrambleText(node.description || ''),
});

module.exports = {
  scrambleNode,
};
