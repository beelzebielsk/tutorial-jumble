/* Task:
 * Implement a function to check if a binary tree is balanced.  For
 * the purposes of this question, a balanced tree is defined to be a
 * tree such that no two leaf nodes differ in distance from the root
 * by more than one.
 */

/* HOW TO READ THIS:
 * - You might wanna skip straight to the code. That's okay. You don't
 *   lose anything by doing so.
 * 
 * If you read the comments:
 * I'm going to present a few different methods. The names of the
 * methods are going to be Method X.Y, where X and Y are numbers.
 * - Each different method will have a different X.
 * - Each refinement (or version) of a method will have the same X,
 *   but a different Y.
 * - You probably shouldn't read all the refinements. Read if you're
 *   curious, but you can skip the refinements once you feel you've
 *   got the gist of a method. I give you these refinements so that
 *   you can understand the process of working toward a final answer,
 *   rather than just seeing the final answer worked out. Sometimes,
 *   the first version of a method will have a mistake, or make a very
 *   poor choice.
 */

/* SHORT INTRO TO TREES:
 * There's a lot of different ways to do this. Doing it always starts
 * out the same, no matter how you do it: make sure you understand
 * the problem.
 *
 * What is a tree?
 * A tree is a collection of nodes, and information about which nodes
 * are connected to other nodes.
 *
 * What is a node?
 * Nodes typically have a value and children associated with them. The
 * value can be something of any data type, it doesn't really matter.
 * The children are other nodes. Usually, we say that a node is
 * connected to it's children via an "edge". This isn't super
 * important for programming, more for drawing. You don't create edges
 * directly in a node. The edges are implicitly specified by creating
 * a child. As the challenge told you, the structure of a single Node
 * is:
 *     { value, left, right }
 * where value is some value, left is a Node, and right is a node.
 *
 * What is a leaf?
 * A leaf is a node with no children. You can think of leaves as the
 * nodes "at the bottom of a tree", but this can occasionally be
 * misleading. 
 *
 * What is a binary tree?
 * A binary tree is a tree in which no node has more than two
 * children.
 *
 * When is a binary tree balanced?
 * A binary tree is balanced when no two nodes exist in the such that
 * their distance from the root differs by more than 1.
 *
 * What is distance?
 * Distance is how far away two nodes are from each other. Simply
 * speaking, the distance between two nodes is the number of edges you
 * have to cross to get from one node to the other. The two nodes may
 * be the same node. 
 * Any node is distance 0 away from itself. 
 * Any node is distance 1 away from its children.
 * You might read online that the distance between any two nodes is
 * the LEAST POSSIBLE number of edges you have to cross to get from
 * one node to another. This is generally true, but not important
 * here.
 *
 * What is depth?
 * Depth is a node's distance from the root of a tree. It's something
 * that gets said often enough, and I might use it a few times in this
 * document.
 *
 * Example of distance:
 *
 *     e
 *    / \
 *   d   c
 *  / \    
 * a   b    
 *
 * Distance 1:
 * distance(e, d) = 1
 * distance(e, c) = 1
 * distance(d, a) = 1
 * distance(d, b) = 1
 *
 * Distance 2:
 * distance(e, a) = 2
 * aistance(e, b) = 2
 */

/* Exploring the problem some more:
 *
 * Let's repeat the problem one more time, now that we know more about
 * trees:
 *
 * TASK:
 * Implement a function to check if a binary tree is balanced.  For
 * the purposes of this question, a balanced tree is defined to be a
 * tree such that no two leaf nodes differ in distance from the root
 * by more than one.
 *
 * When they say "no two leaf nodes", they mean "any pair of leaf
 * nodes". So, a tree is balanced if you cannot find a pair of leaf
 * nodes whose distances from the root are more than 1.
 *
 * This gives us one method of checking to see if a tree is balanced.
 * It is probably the most naive method of all.
 *
 * Start of METHOD 1:
 *
 * METHOD 1.0:
 * - Produce a list of the leaves of a tree. 
 * - Iterate through a list of pairs of the leaves, checking the
 *   distances of each pair. 
 *      - If the distances of the pairs differ by more than 1, the
 *        tree is unbalanced. 
 *      - Otherwise, check another pair.
 * - If no pair was found by the time you've iterated through all of
 *   the possible pairs, then the tree must be balanced.
 *
 * This looks okay, but I made an oversight. If you have just the leaf
 * node itself, is there any way to check the distance of the leaf
 * from the root? No, not really. Not without some unncessary
 * creativity.
 *
 * METHOD 1.1:
 * - Produce a list of the distances of each leaf of a tree. These
 *   distances are distance(currentLeaf, root).
 * - Iterate through a list of pairs of the leaves, checking the
 *   distances of each pair. 
 *      - If the distances of the pairs differ by more than 1, the
 *        tree is unbalanced. 
 *      - Otherwise, check another pair.
 * - If no pair was found by the time you've iterated through all of
 *   the possible pairs, then the tree must be balanced.
 *
 * Let's critique this solution:
 * The running time of this solution is actually not a function of one
 * parameter. 
 * - First, we have to find the leaves of the tree. For the tree we've
 *   been given, there's really only one way to do that: check all the
 *   nodes to see if they do or do not have children. If they don't,
 *   they are a leaf. For each of these leaves, we also have to check
 *   the distance of this leaf from the root. For now, to make things
 *   simple, suppose that this is a constant-time operation, O(1).
 *   Running time of this step: O(nodes) * O(1) = O(nodes)
 * - Now that we have a list of the depths, we iterate through all the
 *   pairs of them. How many different pairs are there? The answer is:
 *       (# leaves) * (# leaves) = (# leaves)^2
 *   We could iterate through less than this if we think more about
 *   what we're doing, but this isn't a good solution to start with.
 *   Checking the difference of the distances is an O(1) operation.
 *   Runnimg time of this step: O(leaves ^ 2) * O(1) = O(leaves ^ 2)
 *
 * Total Running time: O(nodes) + O(leaves ^ 2)
 * NOTE: One running time does not dominate the other because they are
 * different quantities. If the running time had been
 *      O(nodes) + O(nodes ^ 2)
 *      OR
 *      O(leaves) + O(leaves ^ 2)
 * then the result would have been
 *      O(nodes ^ 2)
 *      OR
 *      O(leaves ^ 2)
 *
 * Start of METHOD 2:
 *
 * The previous method sucked. All the methods will deal, somehow,
 * with exploring the nodes of a tree and finding their distance. We
 * will never escape that (not with the current Node data structure we
 * have). So this method will try and reduce the number of pairs that
 * we have to check.
 *
 * Suppose we found a pair of leaves that showed a tree is unbalanced.
 * Depth(leaf1) = 2, Depth(leaf2) = 4
 *
 * Since the leaves must have different depths, one of them will be
 * greater than the other.
 *
 * Are there any other leaves we could've chosen as the leaf of lesser
 * depth? Sure. Any leaf that has depth 2 or less (if they exist).
 *
 * Are there any other leaves we could've chosen as the leaf of
 * greater depth? Sure. Any leaf that has depth 4 or more.
 *
 * Thus, surely, if an offending pair of leaves exists, any other pair
 * of such that:
 * - The leaf of lesser depth is switched out for a leaf of even
 *   lesser depth (or the same depth)
 * - The leaf of greater depth is switched out for a leaf of even
 *   greater depth (or the same depth)
 * Is also an offending pair of leaves, showing that a tree is
 * unbalanced.
 *
 * Therefore, we really don't have to check ALL the pairs. We can just
 * check one pair: the leaf of least depth, and the leaf of greatest
 * depth. If these leaves don't show that the binary tree is
 * unbalanced, no other pair will (since, if that pair existed, this
 * pair must also have shown the tree to be offending).
 *
 * METHOD 2.0:
 * - Find the leaf with least depth and get it's depth.
 *   Running time of step: O(nodes)
 * - Find the leaf with greatest depth and get it's depth.
 *   Running time of step: O(nodes)
 * - Take the differece of the depths, and check if that difference is
 *   greater than 1.
 *   Running time of step: O(1)
 * Running time of method: O(nodes) + O(nodes) + O(1) = O(nodes)
 *
 * This is a better method than Method 1.
 *
 * START OF METHOD 3:
 *
 * We can actually do better. Suppose we have the following tree:
 *
 *     e
 *    / \
 *   d   c
 *  / \    
 * a   b    
 *    / \
 *   f   g
 *        \
 *         h
 *          \
 *           i
 * What if we already knew that the leaf pair (c, f) was proof that
 * the tree was unbalanced? Do we really have to keep going until we
 * find the pair (c, i) (the leaves of minimum and maximum depth)? No,
 * that's stilly. Why do all that work?
 * If we could just... find the leaf of minimum depth first, and
 * return an answer as soon as we found another leaf of depth 2 more
 * than the leaf of minimum depth, then we could stop working
 * immediately.
 *
 * Method 3.0:
 * - Search through the nodes of the tree in order of increasing
 *   depth. That means we start off with the nodes closer to the root,
 *   look through all of those, then look through the nodes further
 *   away from the root.
 *      - On the 1st node that we find, record it's depth. Continue
 *        searching through the other nodes of the tree.
 *      - Each time we explore a node:
 *          - Check if the node is a leaf.
 *          - If the node is a leaf, check the depth of the node.
 *          - If the (currentNodeDepth - minDepth) > 1, then the tree
 *            is not balanced.
 * - If we have reached this point (finishing exploring the nodes of
 *   the tree), and we found no leaf with a depth that's more than 1
 *   away from the leaf of least depth, then the tree is balancd.
 *   Running time of method: O(nodes)
 *
 * Interesting. The running time doesn't look any better than Method
 * 2.0 running time. But I made the argument that this method is
 * better. Why?
 *
 * Well, Big-O notation is... an umbrella term for a lot of related
 * but distinct things, unfortunately. Blame industry for mucking that
 * up. In particular, Big-O notation tries to express how long a
 * process will take, based on the size of it's input, IN THE WORST
 * CASE. You don't HAVE to measure performance in terms of the worst
 * case. What most people do is measure performance in three different
 * cases:
 * - Best case: the least possible steps the process can take to
 *   finish.
 * - Average case: The average number of steps that a process takes to
 *   finish, where this average is taken over all the different
 *   possibilities of inputs to the process.
 * - Worst case: The largest number of steps that a process could take
 *   to finish.
 *
 * At first blush, you might thing that this is weird. What cases are
 * we considering? Since when could we make assumptions about what
 * goes into the process? Why is anything but the worst case a good
 * metric?  Anyone can build something that works well in a lucky case
 * and performs like crap otherwise.
 *
 * What assumptions can we make about what goes into the process?
 * The one thing you are NOT allowed to make assumptions about is the
 * SIZE of the input. Obviously, the input should also satisfy any
 * restrictions that the process places on the input (for our balance
 * checking algorithm, we must give it a Node, because it expects a
 * node). What we CAN play with is the structure and characteristics
 * of the tree. 
 *
 * Why consider something other than the worst case?
 * No one metric beats out the others. Having a low worst-case runtime
 * is great, because you know that the process will never be slower
 * than the worst case. However, think of this: suppose you had an
 * algorithm whose best, average, and worst case running times were
 * all the same. That means that... every possible case is the worst
 * case. Does that sound right? Not in general, no. Sometimes, this
 * may be unavoidable. All the cases might be equally hard, it
 * happens. But there are times when it is not.
 * That said, if there are problems where not all the cases should be
 * worst cases, then you'd like your algorithm to take advantage of
 * these easier cases, and actually spend less time working.
 *
 * For the following analyses, I will consider the size of the input
 * to be the number of nodes in the tree.
 *
 * Best-Case Running Time of Method 3.0:
 *
 * The base-case time is actually O(1). Constant time. It's possible
 * for this algorithm to finish within a number of steps that does not
 * depend on the size of the tree. The second example tree is actually
 * pretty close to the best possible case.
 * One reason is that we're working with *binary trees*. The search
 * method for 3.0, which is called a BREADTH-FIRST SEARCH, tends to
 * perform well on trees that have a limited number of children per
 * node.
 *
 * Here's a simple best case tree:
 *
 *       e
 *      / \
 *     c   d
 *    /      
 *   b        
 *  /
 * a
 *
 * This is a best-case tree for unbalanced trees with 5 nodes. We
 * finish by exploring all the five nodes, which you'll notice is all
 * the nodes in the tree. Sounds kinda wrong, doesn't it? Well, this
 * is a small case. The reason this is a good case is that, so long as
 * a tree has a structure pretty much like this, we'll only ever
 * explore 5, or 6 nodes and then immediately return that the tree is
 * not balanced.
 *
 * This can be a best case example for trees of larger size by making
 * all nodes beyond the 1st 5 descendants of nodes b or c. It doesn't
 * matter how we place new nodes under nodes b and c: this will always
 * be an unbalanced tree, because depth(d) == 1, and depth(a) == 3.
 *
 * Here's an example of a larger tree:
 *       e
 *      / \
 *     c   d
 *    / \    
 *   b   f    
 *  / \   \
 * a   g   .
 *    / \   .
 *   .   .   .
 *  .     .
 * .       .
 *
 * Where the dots mean that there could be any number of descendant
 * nodes as children of g and f (including no children at all, which
 * would make f and g leaves). For this example, we will assume f and
 * g have children.
 * In this case, the Method 3.0 would explore the nodes in the
 * following order:
 *      e, c, d, b, f, a
 * The leaf of minimum depth is d, the next encountered leaf is a,
 * which has depth 3. We know enough to say that the tree is
 * unbalanaced, and we never looked at the children of f and g. No
 * matter how large these trees are, we never explored more than 6
 * nodes.
 *
 * Average Case Running Time:
 * This can be difficult to compute. I'll tell you roughly how one
 * does the average case running time, but I won't do it here, because
 * I don't know how.
 * - For a given, fixed size, n, you look at all of the different
 *   trees of size n.
 * - We assume that you're equally likely to get each tree as an
 *   input.
 * - Calculate the exact number of steps required to finish exploring
 *   this tree. Let's call this quantity Time(tree).
 * - Find Time(tree) for all possible trees of some size, and then
 *   average up all of those times.
 *
 * I'm not sure how to figure out all the different possible trees of
 * a given size, partially because the following two trees are
 * different:
 *
 * Tree 1   |  Tree 2
 * a        |      a
 *  \       |     /
 *   b      |    b
 *    \     |   /
 *     c    |  c
 * 
 * However, Time(tree) can be reasoned about. The running time has to
 * do with the number of nodes one needs to explore before you
 * encounter
 * - A leaf of least depth.
 * - An offending leaf.
 *
 * Based on that, one observation is obvious: all balanced trees are
 * worst cases. You cannot determine that a tree is balanced until
 * you've looked at all the nodes.
 */

function pairs(list1, list2) {
    /* Each pair is a list of two elements. */
    let listOfPairs = [];
    for (let i = 0; i < list1.length; i++) {
        for (let j = 0; j < list2.length; j++) {
            listOfPairs.push([list1[i], list2[j]]);
        }
    }
    return listOfPairs;
}

function isLeaf(node) {
    //console.log(node);
    return (node.left === null && node.right === null);
}
/* Explanation of leafDistancesOfTree:
 * A tree either has one node (a node with no children) or more than 1
 * node.
 * - If a tree has 1 node, then it has 1 leaf.
 * - If a tree has more than 1 node, then the root of the tree has at
 *   least one child. In this case, the leaves of the tree are the
 *   leaves of smaller trees whose roots are the children of the root.
 *
 * Example:
 *
 *     e
 *    / \
 *   d   c
 *  / \    
 * a   b    
 *
 * The leaves of this tree are [a, b, c]. [a, b] are leaves of the
 * tree:
 *
 *   d    
 *  / \    
 * a   b    
 *
 * [c] is a leaf of the tree:
 *
 * c
 */

/* NOTE: These objects are NOT necessary. I just needed a way to do a
 * lot of related work, with some repeated stuff, but all in the same
 * file. I'm abusing objects.
 */
let Method_1_1 = {
    leafDistancesOfTree(tree) {
        /* This function gives us the distances of leaves in a tree,
         * relative to another tree's root. We assume that the root we
         * operate on is a descendant of some other root, and the
         * distance(root, originalRoot) === distanceToOriginalRoot
         * Preconditions:
         * - root is an object of type Node, or null.
         * - distance(root, originalRoot) === distanceToOriginalRoot
         * Postconditions:
         * - The return value of this function is a list of the
         *   distances of the leaves of the current tree, relative to
         *   some original root node.
         */
        function distancesFrom(root, distanceToOriginalRoot) {
            if (root === null) {
                /* There are no nodes in this tree. 
                 * Note that I'm respecting my postcondition at all
                 * times: this function always returns a list of
                 * distances of leaves.
                 */
                return [];
            } else if (isLeaf(root)) {
                // This tree has just one leaf: it's root.
                return [0 + distanceToOriginalRoot];
            } else {
                let distancesOfLeftchild = distancesFrom(root.left,
                    distanceToOriginalRoot + 1);
                let distancesOfRightchild = distancesFrom(root.right,
                    distanceToOriginalRoot + 1);
                return distancesOfLeftchild.concat(distancesOfRightchild);
            }
        }
        // The distances of the leaves of this tree, are the distances
        // of the leaves, relative to this root. Which consists of
        // distances of leaves in each smaller tree, but relative to
        // the same original root.
        return distancesFrom(tree, 0);
    },
    /* checkBalanced takes in an object of type Node, and returns true
     * if the tree rooted at this node is balanced, and false
     * otherwise.
     *
     * NOTE: You'll notice that this returns true if a tree is null.
     * This is correct behavior, by the definition. Can't find a bad
     * pair if there are no pairs.
     */
    checkBalanced(tree) {
        let distances = this.leafDistancesOfTree(tree);
        for(let pair of pairs(distances, distances)) {
            if (Math.abs(pair[0] - pair[1]) > 1) return false;
        }
        return true;
    }
}

let Method_2_0 = {
    leafDistancesOfTree : Method_1_1.leafDistancesOfTree,
    checkBalanced(tree) {
        let distances = this.leafDistancesOfTree(tree);
        let leastDepth = Math.min(...distances);
        let MostDepth = Math.max(...distances);
        return Math.abs(MostDepth - leastDepth) > 1;
    }
}

let Method_3_0 = {
    checkBalanced(tree) {
        // The structure of each entry in nodesToExplore: 
        // [node, depth]. The root node of a tree has depth 0.
        let nodesToExplore = [[tree, 0]];
        let minLeafFound = false;
        let leastDepth;
        while (nodesToExplore.length !== 0) {
            let toExplore = nodesToExplore[0];
            let node = toExplore[0];
            let currentDepth = toExplore[1];
            if (node === null) {
                // Nothing to explore here. This is not a leaf. This
                // is a tree of no nodes. How do I know that it is a
                // tree of no nodes? I chose it to be so. It makes
                // thinking about the problem easier. I could just say
                // "these are cases to handle nulls". But that's more
                // difficult to think about. When you create a data
                // structure, you get to say what's what. And I say
                // null means "empty tree".
                nodesToExplore.shift();
            } else if (isLeaf(node) && !minLeafFound) {
                let leastDepth = currentDepth;
                let minLeafFound = true;
            } else if (isLeaf(node)) {
                if (Math.abs(currentDepth - leastDepth) > 1) return false;
                // We no longer need to explore this node. Remove it.
                else nodesToExplore.shift();
            } else {
                // Explore the node's children. We place the children
                // all the way at the end of nodesToExplore so that we
                // explore nodes of greater depth last, keeping nodes
                // of least depth up front.
                nodesToExplore.shift();
                nodesToExplore.push([node.left, currentDepth + 1]);
                nodesToExplore.push([node.right, currentDepth + 1]);
            }
        }
        return true;
    }
}

class Node {
    constructor(value, left, right) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

let testCases = [
    {
        /* The first example tree:
         *     e
         *    / \
         *   d   c
         *  / \    
         * a   b    
         */
        testCase : 
            new Node("e",
                new Node("d",
                    new Node("a", null, null),
                    new Node("b", null, null)),
                new Node("c", null, null)),
        result : true
    },
    {
        /* The second example tree:
         *     e
         *    / \
         *   d   c
         *  / \    
         * a   b    
         *    / \
         *   f   g
         *        \
         *         h
         *          \
         *           i
         */
        testCase :
            new Node("e",
                new Node("d",
                    new Node("a", null, null),
                    new Node("b", 
                        new Node("f", null, null),
                        new Node("g", 
                            null,
                            new Node("h", 
                                null,
                                new Node("i", null, null))))),
                new Node("c", null, null)),
        result : false
    }
]

function testMethod(testCases, method) {
    for (testCase of testCases) {
        let expected = testCase.result;
        let actual = Method_1_1.checkBalanced(testCase.testCase);
        if (actual !== expected) {
            console.log(String(method) + " is incorrect!");
            return false;
        }
    }
    return true;
}

testMethod(testCases, Method_1_1);
testMethod(testCases, Method_2_0);
testMethod(testCases, Method_3_0);
