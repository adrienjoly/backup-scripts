// converts the JSON dump of a Diigo Outliner into a markdown file
// usage: node convert.js diigo-outliner-sample.json >diigo-outliner-sample.converted.md

const { DiigoItemFlag, DiigoBold, DiigoFormatting, DiigoEmptySpan } = require('./src/diigo');

const filename = process.argv[2] || 'diigo-outliner-sample.json';

console.warn(`reading ${filename} ...`);
const nodes = require(`./${filename}`).data.bulletpoints;

console.warn('creating node index ...');

// => nodeSet schema: { nodeId -> (bullet_client_id, parent_client_id, content, childrenIds) }
const indexInNodeSet = (nodeSet, node) => ({
  ...nodeSet,
  // store node content without overwriting childrenIds
  [node.bullet_client_id]: {
    ...nodeSet[node.bullet_client_id],
    ...node
  },
  // append bullet_client_id to childrenIds array of parent node
  [node.parent_client_id]: {
    ...nodeSet[node.parent_client_id],
    childrenIds: [
      ...(nodeSet[node.parent_client_id] || {}).childrenIds || [],
      node.bullet_client_id,
    ],
  },
});

// generate getChildNodes() and rootNodes based on node index
const { getChildNodes, rootNodes } = (() => {
  const nodeSet = nodes.reduce(indexInNodeSet, {});
  const byPosition = (a, b) =>
    nodeSet[a.bullet_client_id].position - nodeSet[b.bullet_client_id].position;
  const getChildNodes = node => (node.childrenIds || [])
    .map(nodeId => nodeSet[nodeId])
    .sort(byPosition)
  return {
    getChildNodes,
    rootNodes: getChildNodes(nodeSet[0]),
  };
})();

// ===
// rendering functions

const renderHTML = html => html
  .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>([^<]*)<\/a>/g, '[$2]($1)')
  .replace(DiigoEmptySpan.extractionRegEx, '')
  .replace(DiigoItemFlag.extractionRegEx, function() {
    const data = DiigoItemFlag.getMatchData(arguments);
    return `[${data.title}](${data.url})`;
  })
  .replace(DiigoBold.extractionRegEx, function() {
    return DiigoBold.renderFromData(DiigoBold.getMatchData(arguments));
  })
  .replace(DiigoFormatting.extractionRegEx, function() {
    const data = DiigoFormatting.getMatchData(arguments);
    let text = new String(data.text);
    if (data.classes.match('bold')) {
      text = `**${text}**`;
    } else if (data.classes.match('italic')) {
      text = `*${text}*`;
    } else if (data.classes.match('strike')) {
      text = `~~${text}~~`;
    } else {
      console.warn(`unknown formatting style: text-${data.style}`);
    }
    return text;
  })
  .replace(/&gt;/, '>');
  // TODO: also replace other HTML entities ?

const indent = (text, depth = 0) => `${''.padStart(depth * 2)}${text}`;

const renderIndentedNodes = (logFct, nodes = [], depth = 0) => nodes
  .forEach(node => {
    logFct(indent(`- ${renderHTML(node.content)}`, depth)),
    renderIndentedNodes(logFct, getChildNodes(node), depth + 1);
  });

// ===
// actual rendering

renderIndentedNodes(console.log, rootNodes);
