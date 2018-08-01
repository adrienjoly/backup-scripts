// usage:
// node convert.js diigo-outliner-sample.json >output.txt

const filename = process.argv[2] || 'diigo-outliner-sample.json';

console.warn(`reading ${filename} ...`);
const nodes = require(`./${filename}`).data.bulletpoints;

console.warn('creating node index ...');

// nodeSet schema: { nodeId -> (bullet_client_id, parent_client_id, content, childrenIds) }
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

const nodeSet = nodes.reduce(indexInNodeSet, {});

const byPosition = (a, b) =>
  nodeSet[a.bullet_client_id].position - nodeSet[b.bullet_client_id].position;

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
  (node.content ? [ indent(`- ${renderTextContent(node.content)}`, depth) ] : [])
    .concat((node.childrenIds || [])
      .map(childId => nodeSet[childId])
      .sort(byPosition)
      .map(node => renderIndentedNode(node, depth + 1))
    )
    .join('\n');

const rendered = renderIndentedNode(nodeSet[0], -1)
console.log(rendered);
// TODO also render to YAML objects (incl. urls of links and basic text formatting)
// TODO also render to HTML (incl. urls of links and basic text formatting)

