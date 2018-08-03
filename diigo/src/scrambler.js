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

  // given a replacement rule, this function generates an array of replacements to be done in the content
  const getReplacements = rule => {
    const replacements = [];
    while (lastMatch = (rule.extractionRegEx || rule.detectionRegEx).exec(content)) {
      replacements.push({
        pos: lastMatch.index,
        replacement: rule.renderMatch(lastMatch),
      });
    }
    return replacements;  
  };

  const scrambled = rules
    .map(getReplacements)
    .reduce((flattened, arr) => [...flattened, ...arr], []) // flatMap would be awesome
    .sort(byPos)
    .map(({ replacement }) => plainTexts.shift() + replacement).join('');

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
    {
      detectionRegEx: /<a [^>]*>[^<]*<\/a>/g,
      extractionRegEx: /<a .*href=\"([^\"]*)\"[^>]*>([^<]*)<\/a>/g,
      renderMatch: ([ fullMatch, url, title ]) =>
        `<a href="${scrambleText(url)}">${scrambleText(title)}</a>`,
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
