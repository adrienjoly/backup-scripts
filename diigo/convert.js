// usage:
// node convert.js diigo-outliner-sample.json >output.txt

const filename = process.argv[2] || 'diigo-outliner-sample.json';

console.warn(`reading ${filename} ...`);
const nodes = require(`./${filename}`).data.bulletpoints;

console.warn('creating node index ...');

const nodeSet = nodes.reduce((nodeSet, node) => ({
  ...nodeSet,
  [node.bullet_client_id]: {
    ...nodeSet[node.bullet_client_id],
    ...node
  },
  [node.parent_client_id]: {
    ...nodeSet[node.parent_client_id],
    childrenIds: [
      ...(nodeSet[node.parent_client_id] || {}).childrenIds || [],
      node.bullet_client_id,
    ],
  },
}), {});

const byPosition = (a, b) =>
  nodeSet[a.bullet_client_id].position - nodeSet[b.bullet_client_id].position;

const recurseChildren = nodeId => ({
  ...nodeSet[nodeId],
  childNodes: (nodeSet[nodeId].childrenIds || [])
    .map(recurseChildren)
    .sort(byPosition)
});

console.warn('recreating node tree ...');
const nodeTree = recurseChildren(0); // or log(recurseChildren)(0)

const renderHTML = html => html
  .replace(/<[^>]*>/g, '')
  .replace(/&gt;/, '>');
  // TODO: also replace other HTML entities
  // TODO: create a different function that is able to interpret hyperlinks

const renderTextContent = content => {
  const text = renderHTML(content);
  return /^\{.*\}$/.test(text) ? JSON.parse(text).title : text;
  // TODO: create a different function that is able to also extract the `url` field of the JSON
};

const indent = (text, depth = 0) => `${''.padStart(depth * 2)}${text}`;
const renderIndentedNode = (node, depth = 0) => 
  [ indent(`- ${renderTextContent(node.content)}`, depth) ]
    .concat(node.childNodes.map(node => renderIndentedNode(node, depth + 1)))
    .join('\n');

console.log(renderIndentedNode(nodeTree.childNodes[0]));
// TODO also render to YAML objects (incl. urls of links and basic text formatting)
// TODO also render to HTML (incl. urls of links and basic text formatting)
