import Trie from '../index';

describe('Trie', () => {
  it('should have an initial root node after invoking the constructor', () => {
    const trie = new Trie();

    expect(trie).toMatchObject({
      root: {
        children: new Map(),
        isTerminal: false,
      },
    });
  });

  it("should contain the string 'js'", () => {
    const trie = new Trie();

    trie.insert('js');

    expect(trie.search('js')).toBeTruthy();
  });

  it("should not contain the string 'rs'", () => {
    const trie = new Trie();

    trie.insert('js');
    trie.insert('ts');
    trie.insert('rfs');
    trie.insert('R_s');

    expect(trie.search('rs')).toBeFalsy();
  });

  it('should be case insensitive', () => {
    const trie = new Trie();

    trie.insert('JS');

    expect(trie.search('js')).toBeTruthy();
  });

  it("should return an array containing all the strings that start with 'new'", () => {
    const trie = new Trie();

    trie.insert('new york');
    trie.insert('ne york');
    trie.insert('not so good');

    expect(trie.startsWith('new')).toEqual(['new york']);
  });

  it('should return an empty array if theres no match', () => {
    const trie = new Trie();

    trie.insert('new york');
    trie.insert('ne york');
    trie.insert('not so good');

    expect(trie.startsWith('noway')).toEqual([]);
  });
});
