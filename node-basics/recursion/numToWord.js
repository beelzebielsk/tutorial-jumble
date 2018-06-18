let numberToWord = {
    0    : "zero",
    1    : "one",
    2    : "two",
    3    : "three",
    4    : "four",
    5    : "five",
    6    : "six",
    7    : "seven",
    8    : "eight",
    9    : "nine",
    10   : "ten",
    11   : "eleven",
    12   : "twelve",
    13   : "thirteen",
    14   : "fourteen",
    15   : "fifteen",
    16   : "sixteen",
    17   : "seventeen",
    18   : "eighteen",
    19   : "nineteen",
    20   : "twenty",
    30   : "thirty",
    40   : "fourty",
    50   : "fifty",
    60   : "sixty",
    70   : "seventy",
    80   : "eighty",
    90   : "ninety",
    100  : "hundred",
    1000 : "thousand",
    1e6  : "million",
    1e9  : "billion",
    1e12 : "trillion",
    1e15 : "quadrillion",
    1e18 : "quintillion",
    1e21 : "sextillion",
    1e24 : "septillion",
    1e27 : "octillion",
    // Stop trusting these names starting here.
    1e30 : "nuptillion",
    1e33 : "dicetillion?",
    1e36 : "...twicetillion?",
    1e39 : "thricetillion???",
    // To spanish!
    1e42 : "catorcillion",
    1e45 : "qunicillion",
}

module.exports = {
    getNumDigits(number) {
        if (number === 0) {
            return 1;
        } else {
            return Math.floor(Math.log10(number)) + 1;
        }
    },

    getMostSignificantPlaceValue(number) {
        return Math.pow(10, getNumDigits(number) - 1);
    },

    // For a number, gets the closest "significant magnitude" of that
    // number, which I guess is a loosely defined concept. If you're
    // going to say the number, then it is the first word that you'd use
    // to describe the magnitude of the number. So for one million,
    // ten million and one hundred million, the closest magnitude is
    // "million".
    closestSignificantMagnitude(number) {
        let digits = this.getNumDigits(number);
        if (digits < 4) {
            return Math.pow(10, digits - 1);
        } else {
            return Math.pow(10, Math.floor((digits - 1) / 3) * 3)
        }
    },

    // TODO: I'm treating all of the magnitudes like they were in the
    // teens, saying things like "hundred twenty three" (123) instead
    // of "one hundred twenty three". I need to program both
    // behaviors.
    generalNumToWord(number) {
        // For english counting, the base-case names are typically
        // said exactly as listed when they're less than 100. 100 and
        // above is said as "one hundred".
        if (number < 100 && numberToWord[number]) {
            return numberToWord[number];
        } else if (numberToWord[number]) {
            return `${numberToWord[1]} ${numberToWord[number]}`;
        } else {
            let significantMagnitude = 
                this.closestSignificantMagnitude(number);
            let significantMultiple = 
                Math.floor(number / significantMagnitude);
            let significantValue = 
                significantMultiple * significantMagnitude;
            let rest = number % significantMagnitude;
            console.log("significantMultiple:", significantMultiple);
            let high = (numberToWord[significantValue] ?
                        numberToWord[significantValue] :
                        this.generalNumToWord(significantMultiple) +
                            " " + numberToWord[significantMagnitude])
            return high + " " + this.generalNumToWord(rest);
        }
    },
}
