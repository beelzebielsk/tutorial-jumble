function iterativeCutListIntoEighths(list) {
    /* Assume that list has at least 8 elements.  If list is not
     * evenly divisible by 8, then we're going to put all the
     * remaining elements in the last piece.
     */
    let length = list.length;
    let pieceLength = Math.floor(length / 8);
    let pieces = [];
    for (let i = 0; i < 8; i++) {
        if (i !== 8) {
            /* For all slices that are not the last, create a slice
             * that's exactly `pieceLength` elements long.
             */
            pieces.push(
                list.slice(i*pieceLength, (i + 1)*pieceLength));
        } else {
            /* For the last slice, include all of the remaining
             * elements, no matter how many there are. We don't want
             * to leave out any of the elements from the list.
             */
            pieces.push(list.slice(i*pieceLength));
        }
    }
    return pieces;
}

/* There's some cleverness here in the way the iterative function was
 * made. Each next piece starts where the previous piece started. To
 * cut into eighths iteratively, I had to figure out how each piece
 * relates to each other, (that one piece picks up where the other one
 * ends) and I had to make an arbitrary distinction about where the
 * "remaining pieces" went.
 *
 * In order to program this iteratively, I had to think about all of
 * those things ahead of time.
 */

/* Let's look at a recursive version of this function. How does it
 * compare? To build something recursively, you have to figure out how
 * to create an answer to a problem from smaller versions of the same
 * problem. So, how would we recursively solve this problem?
 *
 * When we iteratively solved this problem, the process we did, pretty
 * much was:
 * - Take an array.
 * - Take out 1st piece.
 * - Take out 2nd piece.
 * - ...
 * - Take out 7th piece.
 * - All remaining elements become the 8th piece.
 *
 * We had to reason about what to do based on the number of pieces we
 * were removing. And while we did break the problem down into smaller
 * problems (splitting into eighths was reduced into "breaking off
 * pieces one at a time"), we didn't break the problem donw into
 * smaller versions of itself, so this wasn't a recursive solution.
 *
 * How difficult would it be to cut a list into halves? Not all that
 * difficult, it would just be finding a single index, and taking two
 * slices of a list.
 *
 * If splitting a list into halves was our problem, then our problem
 * would be easy. But it's not. But this problem is similar to our
 * original problem of breaking something into eighths. We're breaking
 * something down into two pieces each of which are as equally sized
 * as possible.
 *
 * What if we could break a list down into fourths? If we could break
 * it into fourths, then break those fourths into halves, then we
 * would be able to cut something into eighths. Do we have a "cut into
 * fourths" function? No, we don't.
 *
 * We can give up there, or we can expand our problem's scope a bit
 * and try to generalize. Instead of solving the problem of cutting
 * something into eighths, we'll cut something into an arbitrary power
 * of two. Keep in mind that we're limited ourselves only to powers of
 * two (1, 2, 4, 8, 16, ...) because this makes our problem easier.
 */

let recursiveCutList;
recursiveCutList = function(list, numPieces) {
    /* I dunno what to do yet. This is...  something. I just put
     * something so I wouldn't get an error.
     */
    return list;
}

/* I can build the recursive version by building a few simple rules.
 * I'm going to build this version in steps, as I think about it. I'm
 * going to figure out, piece-by-piece:
 * - How to solve the most trivial versions of the problem.
 * - How to break down a difficult version of a problem into less
 *   difficult versions of the problem.
 */

/* This is a general version of our problem, which means that the
 * number of pieces could be anything. It could be 2 pieces (halves),
 * 4 pieces, 8 pieces, and so on. When numPieces is 1, I shouldn't do
 * anything, because anything is always in one piece. Thus, if I just
 * want 1 piece, then the original result is the answer.
 */

recursiveCutList = function(list, numPieces) {
  // Progress!
  if (numPieces === 1) {
    return list;
  }
}

/* What happens when we want even more pieces? Perhaps 2? Or 4? Or 8?
 * Well, I know how to solve the case for two pieces. Just cut the
 * list in two.
 */

recursiveCutList = function(list, numPieces) {
    // Progress!
    if (numPieces === 1) {
        return list;
    } else if (numPieces === 2) {
        let halfLength = Math.floor(list.length / 2);
        // Return a list of halves.
        return [list.slice(0, halfLength), list.slice(halfLength + 1)];
    }
}

/* Now we get to an interesting mistake. Look at the two cases that
 * I've thought about. The case of a single piece and two pieces. Both
 * functions return a list, but are they really both the same kind of
 * list?
 *
 * The case of 1 piece returns the single piece itself.
 * The case of 2 pieces returns *a list of pieces*. That's different.
 * In two different cases, I return two different kinds of values
 * (roughly). My recursive function doesn't really work consistently.
 */

/* recursiveCutList
 * Arguments:
 * list, array: An array of entries to cut into pieces.
 * numPieces, number: The number of pieces to cut our list into. Must
 *      be a power of two.
 * Returns:
 * pieces, list: An array of the pieces.
 */
recursiveCutList = function(list, numPieces) {
    if (numPieces === 1) {
        // Conforming with my return value's description.
        return [list];
    } else if (numPieces === 2) {
        let halfLength = Math.floor(list.length / 2);
        return [list.slice(0, halfLength), list.slice(halfLength + 1)];
    }
}

/* Now, what about even larger cases? How would I cut up something
 * into 4 or 8 pieces? I'm not really sure. But I can make things
 * simple on myself. 
 * - Suppose that I wanted to cut something into 4 pieces. I could cut
 *   what I have into two pieces, and then cut those two pieces in two
 *   as well. Then I'd have fourths.  
 * - If I wanted to cut something into 8 pieces, I could cut what I
 *   have into two pieces, then cut those two pieces into two, and
 *   then finally cut the fourths into two as well, giving me eighths.
 * - These two examples are nice, but they dig into too much detail.
 *   I'm describing the solution as *iteration*, because I'm not
 *   solving the problem in terms of smaller versions of the *exact
 *   same problem*. The solutions I just gave described cutting pieces
 *   into two, and then what to do with the resulting pieces. That's
 *   too many details. What if I made things even simpler: 
 *   - to cut into eighths, cut what you have in half, then cut the
 *     halves into fourths. 
 *   - Similarly to cut into fourths, cut what you have in half, then
 *     cut the halves into halves.
 * - In general, if I wanted to cut something into into a bunch of
 *   pieces (which are a power of two), I could cut what I have into
 *   two, and then cut the two halves into half as many pieces as I
 *   originally wanted (ex: if I wanted 16 pieces, cut what I have
 *   into two, then cut each half into 16/2 = 8 pieces).
 */

recursiveCutList = function(list, numPieces) {
    if (numPieces === 1) {
        return [list];
    } else if (numPieces === 2) {
        let halfLength = Math.floor(list.length / 2);
        return [list.slice(0, halfLength), list.slice(halfLength + 1)];
    } else {
        let halfLength = Math.floor(list.length / 2);
        let firstHalf = list.slice(0, halfLength);
        let secondHalf = list.slice(halfLength);
        let newPieces = numPieces / 2;
        return [recursiveCutList(firstHalf, newPieces),
                recursiveCutList(secondHalf, newPieces)];
    }
}

/* You might wonder how I knew to call our function recursively? Well,
 * suppose that you knew for sure that, for whatever number of pieces
 * you called recursiveCutList for, the function would work correctly
 * if you asked for fewer pieces (and followed all the requirements
 * for the arguments of recursiveCutList). That is, you can trust the
 * results from smaller versions of your problem.
 *
 * If we could freely assume this, then wouldn't our recursive
 * function work fine? It pretty much matches exactly what we said to
 * do in English, right? If we want four or more pieces, then we cut
 * what we have into halves, and then cut those halves into halves.
 * That's pretty much what we did.
 *
 * Actually, there's a misake in my description. Again. Notice what I
 * return in each case:
 * - Case 1 piece: A list of one piece.
 * - Case 2 pieces: A list of two pieces.
 * - Case more pieces: A list of... two of whatever is returned by
 *   recursiveCutList. What happens when numPieces == 4? Then we have
 *   a list of what's returned from case 2, which is a list of two
 *   pieces. Thus our return type here is: a list containing lists of
 *   pieces.
 *   - [ ... ] --> A list
 *   - contents of the list: recursiveCutList(someList, 2) --> A list
 *     of pieces.
 *   - Thus the final returned value is a list of piece lists.
 *
 * The problem would actually get worse if we wanted more than four
 * pieces. Think about it, if we wanted 8 pieces, then what we would
 * return is a list of the two values of whatever is returned by
 * recursiveCutList(someList, 4), so that's a list containing lists
 * containing lists of pieces.
 *
 * So we have to combine our recursive return values in such a way
 * that they're always a list of pieces.
 *
 * Since we want our function to return a list of pieces, we will
 * assume that all recursive calls to our function "do the right
 * thing", meaning that they return a list of pieces. With that
 * assumption, we will treat the return values correctly by combining
 * them in such a way that we keep the correct kind of return value.
 */

recursiveCutList = function(list, numPieces) {
    if (numPieces === 1) {
        return [list];
    } else if (numPieces === 2) {
        let halfLength = Math.floor(list.length / 2);
        return [list.slice(0, halfLength), list.slice(halfLength + 1)];
    } else {
        let halfLength = Math.floor(list.length / 2);
        let firstHalf = list.slice(0, halfLength);
        let secondHalf = list.slice(halfLength);
        let newPieces = numPieces / 2;
        /* Concatenation adds the contents of the second list onto the
         * end of the contents of the first list.
         * The first list is a list containing pieces, the second list
         * is a list containing pieces.
         * The result is a list containing both of their contents with
         * is just a larger list containing pieces. Thus we have a
         * list containing pieces.
         */
        return recursiveCutList(firstHalf, newPieces).concat(
                    recursiveCutList(secondHalf, newPieces))
    }
}

/* This is it! We have a working recursive function. This function is
 * actually provably correct without too much difficulty. Certainly
 * with far less difficulty than it would take to prove the iterative
 * version.
 *
 * Can we make the function better? What would happen if we removed
 * the specialy programmed case for 2 pieces? Would the program work
 * correctly?
 */

recursiveCutList = function(list, numPieces) {
    if (numPieces === 1) {
        return [list];
    } else {
        let halfLength = Math.floor(list.length / 2);
        let firstHalf = list.slice(0, halfLength);
        let secondHalf = list.slice(halfLength);
        let newPieces = numPieces / 2;
        return recursiveCutList(firstHalf, newPieces).concat(
                    recursiveCutList(secondHalf, newPieces))
    }
}

/* Well, let's assume that numPieces was 2.
 * - Is numPieces === 1? No, so we skip this part.
 * - We split our list into two pieces-- something we would've done
 *   anyway.
 * - Then we try to split those halves into... ones, since now
 *   numPieces would be 1. After doing that, we concatenate the two
 *   lists of pieces together into one list of halves.
 * The function still works, and we didn't have to give it too many
 * directions. It seems that the second case was really just a special
 * version of the case "more than one piece".
 * Notice that in the "more than one piece" case, we split things in
 * two, just like we would have in the "two pieces" case.
 */
