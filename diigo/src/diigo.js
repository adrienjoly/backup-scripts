const RE_DIIGO_ITEM_FLAG = /<span class=\"diigoItemFlag\">\{[^\}]*\}<\/span>/g;
const RE_DIIGO_ITEM_FLAG_EXTR = /<span class=\"diigoItemFlag\">(\{[^\}]*\})<\/span>/g;

const RE_DIIGO_LINK = /<a [^>]*>[^<]*<\/a>/g;
const RE_DIIGO_LINK_EXTR = /href=\"([^\"]*)\"[^>]*>([^<]*)<\/a>/g;

const combineRegexps = regexps => new RegExp(
  regexps
    .map(regex => `(?:${ regex.toString().substring(1, regex.toString().length - 2) })`)
    .join('|'),
  'g',
);

const DiigoItemFlag = {
  detectionRegEx: RE_DIIGO_ITEM_FLAG,
  extractionRegEx: RE_DIIGO_ITEM_FLAG_EXTR,
  getMatchData: match => JSON.parse(match[1]),
  renderFromData: data => `<span class="diigoItemFlag">${JSON.stringify(data)}</span>`
};
// TODO: support type="image" and type="17" (cf weird-itemflag-types.txt)

const DiigoLink = {
  detectionRegEx: RE_DIIGO_LINK,
  extractionRegEx: RE_DIIGO_LINK_EXTR,
  getMatchData: ([ fullMatch, url, title ]) => ({ url, title }),
  renderFromData: ({ url, title }) => `<a href="${url}">${title}</a>`,
};

const DiigoFormatting = {
  detectionRegEx: /<span class=\"text-[^"]*\">[^<]*<\/span>/g,
  extractionRegEx: /<span class=\"(text-[^"]*)\">([^<]*)<\/span>/g,
  getMatchData: ([ fullMatch, classes, text ]) => ({ classes, text }),
  renderFromData: ({ classes, text }) => `<span class="${classes}">${text}</span>`,
}; // style can be a space-separated combination of: 'text-bold', 'text-italic', 'text-strike'

const DiigoBold = {
  detectionRegEx: /<b>[^<]*<\/b>/g,
  extractionRegEx: /<b>([^<]*)<\/b>/g,
  getMatchData: ([ fullMatch, text ]) => ({ classes: 'text-bold', text }),
  renderFromData: DiigoFormatting.renderFromData,
};

/*
const DiigoFormattingCombined = {
  ...DiigoFormatting,
  detectionRegEx: combineRegexps([DiigoFormatting.detectionRegEx, DiigoBold.detectionRegEx]),
  extractionRegEx: combineRegexps([DiigoFormatting.extractionRegEx, DiigoBold.extractionRegEx]),
  getMatchData: match => match.length > 2
    ? DiigoFormatting.getMatchData(match)
    : DiigoBold.getMatchData(match),
};
*/

const DiigoEmptySpan = {
  detectionRegEx: /<span><\/span>/g,
  extractionRegEx: /<span><\/span>/g,
  getMatchData: () => null,
  renderFromData: () => `<span></span>`,
};

module.exports = {
  combineRegexps,
  DiigoItemFlag,
  DiigoLink,
  DiigoFormatting,
  DiigoBold,
  DiigoEmptySpan,
};