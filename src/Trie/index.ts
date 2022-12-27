class Node {
    constructor({ value, isTerminal }: Omit<Node, "children">) {
        this.value = value
        this.isTerminal = isTerminal
        this.children = new Map()
    }

    public readonly value: string
    public readonly children: Map<string, Node>
    public isTerminal: boolean
}

class Trie {
    constructor() {
        this.root = new Node({ value: "\0", isTerminal: false })
    }

    insert(word: string) {
        let current = this.root
        for (const w of word.toLowerCase()) {
            if (!current.children.has(w)) {
                current.children.set(
                    w,
                    new Node({ value: w, isTerminal: false })
                )
            }
            const child = current.children.get(w)

            if (child) {
                current = child
            }
        }
        current.isTerminal = true
    }

    /**
     * Returns if the word is in the trie
     */
    search(word: string): boolean {
        let current = this.root

        for (const w of word) {
            if (!current.children.has(w)) {
                return false
            }
            const child = current.children.get(w)

            if (child) {
                current = child
            }
        }

        return current.isTerminal
    }

    /**
     * Returns if there is any word in the trie that starts with the given prefix
     * Modification for this use case: returns a string[] that starts with the given prefix
     */
    startsWith(prefix: string): string[] {
        let current = this.root
        const results: string[] = []

        for (const c of prefix) {
            if (!current.children.has(c)) {
                return []
            }

            const child = current.children.get(c)

            if (child) {
                current = child
            }
        }

        const dfs = (node: Node, word: string) => {
            if (!node) {
                return
            }

            if (node.isTerminal) {
                results.push(word)
            }

            node.children.forEach((child) => dfs(child, word + child.value))
        }

        dfs(current, prefix)

        return results
    }

    private readonly root: Node
}

export default Trie
