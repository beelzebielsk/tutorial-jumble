/* Question 2 -- decodeString(s): 
 * Given an encoded string, return its corresponding decoded string.
 *
 * The encoding rule is: 
 *      k[encoded_string]
 * where the encoded_string inside the square brackets is repeated
 * exactly k times. 
 * NOTE: k is guaranteed to be a positive integer.
 *
 * Examples:
 * For s = "4[ab]", the output should be decodeString(s) = "abababab" 
 * For s = "2[b3[a]]", the output should be decodeString(s) = "baaabaaa"
 */

/* I'm going to attack a slightly more general version of this
 * problem, so that I have an easier time with this. 
 * In the original problem, the inputs are encoded strings.
 *
 * In this function, the inputs may be either decoded strings or
 * encoded strings. I do this to make the recursion easier. Recursion
 * is about breaking down a larger problem into smaller versions of
 * the same exact problem. If I kept this function as one that
 * strictly accepted encoded strings, then expressing my simplest
 * (base) case would be difficult. What is the smallest case in this
 * instance? How would I measure that? However, by accepting both
 * encoded and decoded strings, the base case is simple: decoded
 * strings are simplest. A case is more complicated if it has a
 * greater "decoding depth", which is roughly expressed as the largest
 * number of balanced pairs of square brackets in an encoded string.
 *
 * Preconditions:
 * - input is a string, which may either be encoded or decoded.
 * - There is no more than one encoded form (the part of the string
 *   that is of the form k[...]) in an input.
 * - Encoded forms may include encoded forms.
 *
 * Postconditions:
 * - The return value of a decoded string is the decoded string
 *   itself.
 * - The return value of an encoded string is the decoding of that
 *   string.
 *
 * NOTE: The preconditions are assumptions that I'm making about my
 * input. They're things that, should they all be true, the
 * postconditions should all be true.
 *
 * A string is encoded if it contains the character sequence 
 *      \d+\[.*\]
 *
 *
 * Examples:
 *      ab1[c] -> abc
 *      ab1[2[c]] -> abcc
 *      asd3[f] -> asdfff
 *      asd1[2[[] -> asdf2[[
 *
 * Examples that this function is not designed to handle:
 *      ab1[c]2[d] is not allowed
 */
function decode_string(input) {
    //console.log("input:", input);
    let encoded_expression = /^(.*?)(\d+\[.*\])(.*)$/;
    let match = input.match(encoded_expression);
    // The string is not encoded.
    if (match === null) {
        //console.log("String not encoded.");
        return input;
    }
    else {
        let start = match[1];
        let encoded_piece = match[2];
        let end = match[3];

        //console.log(`start: ${start}`);
        //console.log(`encoded_piece: ${encoded_piece}`);
        //console.log(`end: ${end}`);

        let encoding = encoded_piece.match(/^(\d+)\[(.*)\]$/);
        let number = encoding[1];
        let to_decode = encoding[2];

        //console.log(`number: ${number}`);
        //console.log(`to_decode: ${to_decode}`);

        return start + decode_string(to_decode).repeat(number) + end;
    }
}

let testCases = [
    { testCase : "ab1[c]", result : "abc" },
    { testCase : "ab1[2[c]]", result : "abcc" },
    { testCase : "asd3[f]", result : "asdfff" },
    { testCase : "asd1[2[[]", result : "asd2[[" },
]

function test(testCases, method) {
    let correct = true;
    for (testCase of testCases) {
        let expected = testCase.result;
        let actual = method(testCase.testCase);
        if (actual !== expected) {
            console.log("function is incorrect!");
            console.log("case:", testCase.testCase);
            console.log(`expected: '${expected}'`);
            console.log(`actual: '${actual}'`);
            correct =  false;
        }
    }
    return correct;
}

test(testCases, decode_string);
