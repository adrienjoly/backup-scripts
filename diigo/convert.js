// usage:
// node convert.js diigo-outliner-sample.json >output.txt

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
  .replace(/<[^>]*>/g, '')
  .replace(/&gt;/, '>');
  // TODO: also replace other HTML entities
  // TODO: create a different function that is able to interpret hyperlinks

const renderTextContent = content => {
  const text = renderHTML(content);
  return /^\{.*\}$/.test(text) ? JSON.parse(text).title : text;
  // TODO: also include plain text that may surround the JSON links
  // TODO: create a different function that is able to also extract the `url` field of the JSON
};

const indent = (text, depth = 0) => `${''.padStart(depth * 2)}${text}`;

const renderIndentedNodes = (logFct, nodes = [], depth = 0) => nodes
  .forEach(node => {
    logFct(indent(`- ${renderTextContent(node.content)}`, depth)),
    renderIndentedNodes(logFct, getChildNodes(node), depth + 1);
  });

// ===
// actual rendering

renderIndentedNodes(console.log, rootNodes);

// TODO also render to YAML objects (incl. urls of links and basic text formatting)
// TODO also render to HTML (incl. urls of links and basic text formatting)

