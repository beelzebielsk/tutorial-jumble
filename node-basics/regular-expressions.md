What is a Regular Expression?
=============================

*Regular Expressions* are a language for describing text. For describing
what text looks like.

What are they used for?
-----------------------

Good question. By describing text, you can pretty much do anything you
can think of where a description of text would be useful, but the major
use case is *searching for text*. It's easier to search for something
when you know what it looks like, right?


Why Regular Expressions?
------------------------

- Why not just type in the exact text you want? For example, if I'm
  looking for my name in a document, why can't I just type in 'my name'?
- What can regular expressions do that searching for exact text couldn't
  do?

Good questions, I'm impressed. If you know exactly what you're looking
for, then there's really no reason for you to use a regular expression.
You might as well just use simplest tool available to you, and a plain
search would do just fine.

However, there's a lot of times when you know how something *roughly
looks like*, but not exactly what it looks like. 

Some Examples:
--------------

For instance, suppose you've got a report to read. The report is a
summary of important events that have happened in the past ten years.
It's not very structured or anything, so it's just a bunch of paragraphs
with an event that happened, and a date in the paragraph if the time the
event happened was important for logging purposes.

So, what if you're only interested in the events that are dated? How
would you search for those? You could search for parts of the year that
stay the same (for instance, if the report was from 2007 to 2017, then
you could search for "20"), but that might not pan out. There could be
all sorts of false positives (like the number "20", or places where only
a year is mentioned, but no date, such as on a document heading).

### Looking up a Simple Year

So, here's the first problem: we know how years in this document would
look like. They'd be "20" followed by two other numbers. We're currently
only searching for "20", but we have more information than just "20".

This is a problem that a regular expression can solve. If you wanted to
say "the characters '20' followed by two numbers", you'd say:

  20\d\d

Each character means:

- "20" just means 20.
- "\d" means "a number".

Except for some special characters (which I won't discuss yet), every
character means itself. So if I were to just search for:

  20

Then a regular expression search would find all instances of the letter
'2' followed by the letter '0'.

### Looking up a Date

Well, what you *really* wanted to do was look for dates. The idea of
looking for a year was just a hack because we didn't know how to look
for a date yet.  Well, again, we know what a date roughly looks like: A
month, followed by a slash, followed by a day, followed by a slash, then
a year.

  MM/DD/YYYY

Well, all of the `M`, `D`, and `Y` are all numbers. So, we can do what
this instead:

  \d\d/\d\d/\d\d\d\d

And this would find any date in the document of this form.

How Do Regular Expressions Work?
================================

To get into some specifics, I need to go through a rough example of how
a regular expression actually works, under the hood. You should probably
just skim this for now, and then come back to it a little later. Just
get the sense of how things flow.

We're going to use the example of searching for a date in both the rough
and more worked out example.

Our search string will be:
  
  Patient 204 had an adverse event on 09/08/2017.

And our regular expression will be:

  \d\d/\d\d/\d\d\d\d

Rough Example
-------------

When you write a regular expression, you're describing what a desired
piece of text looks like. Something you want to find. The language is
all about descirbing what text looks like in more abstract terms like
"groups of characters" or "a repeating series of characters".

Why would searching be related to how things work anyhow? Why would you
need to know how a search works under the hood to figure out how to
write the expressions well? You don't know much about how a computer
works, but you're already doing pretty okay.

The main things to understand are how a search proceeds through the
pieces of an expression, and that each piece of the expression is
expected at a *certain position*.

So one way to interpret the regular expression:

  \d\d/\d\d/\d\d\d\d

Is:

- It starts with a digit.
- It is then followed by a digit, which is followed by a `/`.
- After that comes two digits, and after that comes `/`.
- After that comes four digits.

We're looking for any portion of the search text that matches that
description.

Let's look at the search string again.

~~~
  String     : Patient 204 had an adverse event on 09/08/2017.
  Position   : 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6
  Tens Place : 0         10        20        30        40    46
~~~

The numbers in position are for counting, the tens place row is for
making getting around a little easier. I left out the odd numbers for
ease of reading, so it's not too cramped, but they otherwise would have
been there.

For instance, if I want to check character 22, then I'd go to where `20`
starts in the tens place row, go up to the position row to where it says
`2`, and then once I'm there, I'd just go up to the string row and check
the character that's there. Character 22 is `e`.

When searching for a date in this search string, what's going to happen
is:

- It will try to match `\d`, the start of the expression at *every
  character*. The way it solves searching is:
  - If I found a piece of text that maches, then the text will match the
    first piece of the regular expression, and the following text will
    match the rest of the regular expression.
  - With that kind of reasoning, the way to start searching for
    something is to find a *valid starting point*.
- It will fail to match the first `\d` against characters 0-7 (`Patient
  `).
- It will match `\d` against the `2` in `204`, then it will match the
  next `\d` against the `0` in `204`, but fail to match the `/` against
  the `4` in 204. 
- In simple patterns like this one, every time the searcher fails to
  find a match, it will:
  - Move to a new starting position (in this case, it will move from `2`
    to `0` in `204`.
  - It will start from the beginning of the pattern again, because it is
    looking for a new start point.
- The searcher will fail to find a match starting at `0`, because `04 `
  doesn't match `\d\d\ `.
- The searcher will fail to find a match starting at `4`, because `4 `
  doesn't match `\d\d`.
- From this point on, it will fail to match the start of the pattern
  against all characters from 11 to 35, because none of them are digits.
- Finally, at charcter 36, it will match `0` against `\d`, finding
  another valid starting point. From here on in, it will match:
  - `\d` : 9
  - `/` : /
  - `\d` : 0
  - `\d` : 8
  - `/` : /
  - `\d` : 2
  - `\d` : 0
  - `\d` : 1
  - `\d` : 7

  And once there's no expression left to match, then the searcher says
  that it found a match.


More Specific Example
---------------------

So, a regular expression looks for a section of text. That section is
going to have a *beginning* and *end*. So what a regular expression
searcher does is:

1. Starting from the beginning of the text, it checks if the current
   letter is a valid starting point for the regular expression. It
   checks as many letters as needed until it finds out that the current
   letter is or is not the start of text which matches the regular
   expression.
2. If the searcher finds a match, then it returns the start and end of
   of the match. If it does not find a match, then it advances to the
   next character, if there is another character left. If there are
   no characters left, then it returns nothing, except perhaps something
   to signal failure.

So, let's run through it.

- First Step:
  - We start at the first letter of the search text, which is `P`. We
    try to match that letter to the first part of the regular expression
    `\d`. `P` is not a digit, so it doesn't match. Therefore there is no
    way the rest of it can match, so we move to the next character.
  
  Patient 204 had an adverse event on 09/08/2017.
  ^

- Second Step through Eighth Step
  - We again try to match the current start letter with the expression,
    and of course, it won't match because our expresion starts with a
    number, and there are no numbers. The same thing will happen over
    and over again for the 3rd through 8th characters, the 3rd being `t`
    and the 8th being ` ` (a space. Those count).

  Patient 204 had an adverse event on 09/08/2017.
   ^

- 9th step
  - Here, things are different. Our expression starts with a digit, and
    we have encountered a digit in our search string. This matches the
    first part of our regular expression. Now, we will check if the next
    characters of the search string match the rest of the expression.

  Patient 204 had an adverse event on 09/08/2017.
          ^
- 10th step
  - We're now trying to match the next character to the next part of the
    expression. The next character is a digit, and the next part of the
    regular expression matches a digit, so this matches. We proceed to
    try and match the next character of the search string to the next
    part of the regular expression.

  Search String:
  Patient 204 had an adverse event on 09/08/2017.
          ^*
  
  Expression:
  \d\d/\d\d/\d\d\d\d
     *

- 11th step
  - Now, we try to match the next character of the search string to the
    next part of the regular expression. The next character is a number,
    and the next part of the regular expression is `/`. They don't
    match, so the character `2` is not a valid start for our regular
    expression. Now, we advance the start character.

  Search String:
  Patient 204 had an adverse event on 09/08/2017.
          ^**
  
  Expression:
  \d\d/\d\d/\d\d\d\d
      *

- 12th step through ... many others.
  - We start again from the next digit. The first two digits will match,
    which will be two steps, but the match is going to fail at the
    space. It will keep failing until we reach `09/08/2017`.

  Search String:
  Patient 204 had an adverse event on 09/08/2017.
           ^ 
  
  Expression:
  \d\d/\d\d/\d\d\d\d
   *   

- The part that works
  - When the start character is `0` in `09/08/2017`, the whole
    expression will match at the posiiton `0`.

Pieces of a Regular Expression
------------------------------

So, what exactly are the pieces? You've seen a few of them. For one,
you've seen normal characters, which just represent themselves, such as
`/`. In most implementations of regular expressions, a slash is just a
slash. You've also seen a *character class*, which is `\d` for digit. It
represents a set of characters that could come up.

- Normal characters. These are:
  - Numbers (0,1,2,3,4,5,6,7,8,9)
  - Letters (a-z, A-Z)
  - Underscore `_`
  - Every normal letter just represents itself. If you put them in a
    regular expression, then the expression will expect that character
    in that position.
- Character classes:
  - These are of the form `[letters]`. Use this when any of the letters
    inside of the brackets would be at the given position in a word.
  - An example of a search string with a character class might be
    `a[bcd]e`. This would match any of:
    - `abe`
    - `ace`
    - `ade`
  - There are some prebuilt character classes:
    - `\d` for digits
    - `\a` for letters
    - `\w` for letters, numbers, and `_`. It roughly corresponds to
      "letters in a word".
    - `\s` for spaces. A single space, a tab, a line break and so on.
- Parentheses. `()`. When you surround an expression with parentheses,
  the whole expression becomes one piece. You'll often need to use this
  with the next piece of regular expressions: quantifiers.
- Quantifiers. Sometimes, you know which characters should be in which
  position, but not how many of them. Quantifiers act on the expressions
  that come before them.
  - `?`, which means "0 or 1" times. That basically means that the
    expression may or may not actually be there. For instance, `adumb?`
    would match either `adum` or `adumb`.
  - `*`, which means "0 or more times". That means that the expression
    may not be there, or it may be there any number of times. For
    instance `adumb*` would match `adum`, `adumb` or `adumbb` or
    `adumbbb` and so on.
  - `+`, which means "at least once". That means that the expression
    is there once and potentially more times.
- Beginning/End matchers. The `^` is for beginning and the `$` is for
  end. They may mean the beginning/end of the search string, or the
  beginning/end of a line. It depends on where you use them. For our
  purposes, they will match both.

These are the main pieces. They might not all make sense right now.
