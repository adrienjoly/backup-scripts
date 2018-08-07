const RE_DIIGO_ITEM_FLAG = /<span class=\"diigoItemFlag\">\{[^\}]*\}<\/span>/g;
const RE_DIIGO_ITEM_FLAG_EXTR = /<span class=\"diigoItemFlag\">(\{[^\}]*\})<\/span>/g;

const RE_DIIGO_LINK = /<a [^>]*>[^<]*<\/a>/g;
const RE_DIIGO_LINK_EXTR = /href=\"([^\"]*)\"[^>]*>([^<]*)<\/a>/g;

const DiigoItemFlag = {
  detectionRegEx: RE_DIIGO_ITEM_FLAG,
  extractionRegEx: RE_DIIGO_ITEM_FLAG_EXTR,
  getMatchData: match => JSON.parse(match[1]),
  renderFromData: data => `<span class="diigoItemFlag">${JSON.stringify(data)}</span>`
};

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

module.exports = {
  DiigoItemFlag,
  DiigoLink,
  DiigoFormatting,
};