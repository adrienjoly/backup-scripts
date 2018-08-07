const assert = require('assert');
const {
  combineRegexps,
  DiigoItemFlag,
  DiigoLink,
  DiigoFormatting,
  DiigoBold,
  DiigoEmptySpan
} = require('./diigo');

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
  const detectionRegEx = combineRegexps(rules.map(({ detectionRegEx }) => detectionRegEx));

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

const scrambleElementData = elementData => ({
  ...elementData,
  text: typeof elementData.text === 'string' ? scrambleText(elementData.text) : undefined,
  title: typeof elementData.title === 'string' ? scrambleText(elementData.title) : undefined,
  url: typeof elementData.url === 'string' ? scrambleText(elementData.url) : undefined,
})

const makeDiigoElementScrambler = elementType => ({
  ...elementType,
  renderMatch: match =>
    elementType.renderFromData(
      scrambleElementData(
        elementType.getMatchData(match)
      )
    )
});

const scrambleContent = content => {
  const rules = [
    makeDiigoElementScrambler(DiigoItemFlag),
    makeDiigoElementScrambler(DiigoLink),
    makeDiigoElementScrambler(DiigoFormatting),
    makeDiigoElementScrambler(DiigoBold),
    {
      ...DiigoEmptySpan,
      renderMatch: DiigoEmptySpan.renderFromData,
    },
  ];
  const scrambleWithCustomRule = makeScramblerWithCustomRules({ rules });
  return scrambleWithCustomRule(content);
};

const scrambleNode = node => ({
  ...node,
  content: scrambleContent(node.content),
  description: scrambleText(node.description || ''),
});

module.exports = {
  scrambleNode,
};
