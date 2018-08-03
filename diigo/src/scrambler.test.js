const { scrambleNode } = require('./scrambler');

describe('scrambler', () => {

  it('converts a diigoItemFlag followed by a link', () => {

    // for reference, bullet_client_id: 8791970000000018

    const content = "<span class=\"diigoItemFlag\">{\"title\":\"uMap\",\"type\":\"bookmark\",\"url\":\"http://umap.openstreetmap.fr/fr/\",\"linkId\":\"167593705\",\"userId\":\"29454\",\"annotCount\":\"\",\"isConvert\":false}</span>+ <a target=\"_blank\" rel=\"nofollow\" class=\"link\" href=\"http://wiki.openstreetmap.org/wiki/UMap\">uMap - OpenStreetMap Wiki</a> ";

    const scrambled = "<span class=\"diigoItemFlag\">{\"title\":\"aAaa\",\"type\":\"bookmark\",\"url\":\"aaaa://aaaa.aaaaaaaaaaaaa.aa/aa/\",\"linkId\":\"167593705\",\"userId\":\"29454\",\"annotCount\":\"\",\"isConvert\":false}</span>+ <a href=\"aaaa://aaaa.aaaaaaaaaaaaa.aaa/aaaa/AAaa\">aAaa - AaaaAaaaaaAaa Aaaa</a> ";

    expect(scrambleNode({ content })).toHaveProperty('content', scrambled);
    
  });

  it('converts a link followed by a diigoItemFlag', () => {

    // for reference, bullet_client_id: 9430550000000000

    const content = "(DEPRECATED) <a target=\"_blank\" rel=\"nofollow\" class=\"link\" href=\"https://atmospherejs.com/mrt/offline-data\" data-gettitle=\"true\" data-url=\"https://atmospherejs.com/mrt/offline-data\">https://atmospherejs.com/mrt/offline-data</a> <span class=\"diigoItemFlag\">{\"title\":\"awwx/meteor-offline-data\",\"type\":\"bookmark\",\"url\":\"https://github.com/awwx/meteor-offline-data\",\"linkId\":\"171256988\",\"userId\":\"29454\",\"annotCount\":\"5\",\"isConvert\":false}</span><span></span>";

    const scrambled = "(AAAAAAAAAA) <a href=\"aaaaa://aaaaaaaaaaaa.aaa/aaa/aaaaaaa-aaaa\">aaaaa://aaaaaaaaaaaa.aaa/aaa/aaaaaaa-aaaa</a> <span class=\"diigoItemFlag\">{\"title\":\"aaaa/aaaaaa-aaaaaaa-aaaa\",\"type\":\"bookmark\",\"url\":\"aaaaa://aaaaaa.aaa/aaaa/aaaaaa-aaaaaaa-aaaa\",\"linkId\":\"171256988\",\"userId\":\"29454\",\"annotCount\":\"5\",\"isConvert\":false}</span><aaaa></aaaa>";

    expect(scrambleNode({ content })).toHaveProperty('content', scrambled);

  });

  it('converts content that contains two links', () => {

    // for reference, bullet_client_id: 2888650000000301

    const content = "Blogger: <a target=\"_blank\" rel=\"nofollow\" class=\"link\" href=\"https://www.wunderlist.com/#/lists/143792705\">@blogger</a> + <a target=\"_blank\" rel=\"nofollow\" class=\"link\" href=\"https://www.wunderlist.com/#/lists/131400047\">Ideas</a> ";

    const scrambled = "Aaaaaaa: <a href=\"aaaaa://aaa.aaaaaaaaaa.aaa/#/aaaaa/131400047\">@aaaaaaa</a> + <a href=\"aaaaa://aaa.aaaaaaaaaa.aaa/#/aaaaa/131400047\">Aaaaa</a> ";

    expect(scrambleNode({ content })).toHaveProperty('content', scrambled);

  });

});
