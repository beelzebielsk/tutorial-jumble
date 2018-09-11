#lang racket

(require pollen/tag
         pollen/core
         txexpr
         "utility.rkt"
         "latex-base.rkt")

(define-syntax (O stx)
  (syntax-case stx ()
    [name (identifier? #'name) #'(ensure-math "O")]
    [(name args ...) #'(ensure-math "O(" args ... ")")]))
(define (whitespace? e)
  (and (string? e)
       (regexp-match #px"^\\s*$" e)))
(define newline? 
  (λ (e) (and (whitespace? e)
              (string-contains? e "\n"))))

(define (hash->opt-args hsh)
  (append*
    (add-between 
      (hash-map (λ (k v) `(,k "=" ,@(group v))) hsh)
      ", ")))

; string? number? -> string?
; Takes in a string and a number for the desired with of each line of
; the final formatted comment. Returns the final formatted comment as
; a string.
(define (comment-split str len)
  (let* 
    ([comment-line-length (- len 3)]
     [words (string-split str)]
     [words-and-spaces (add-between (string-split str) " ")]
     [get-split-length (λ (split)
                          (foldl + 0 
                                 (map string-length split)))]
     [lines (split-where 
              words-and-spaces
              (λ (word current-split . _)
                 (let 
                   ([word-length (string-length word)]
                    [split-length (get-split-length current-split)])
                   (and (not (whitespace? word))
                        ;(< split-length comment-line-length)
                        (>= (+ split-length word-length) comment-line-length))))
              #:keep-where
              (λ (word current-split . _)
                 (let 
                   ([word-length (string-length word)]
                    [split-length
                      (foldl + 0 
                             (map string-length current-split))])
                   (cond
                     [(= comment-line-length (+ split-length word-length))
                      'current]
                     [else 'next]))))])
     (add-between lines
                  (list "\n * ")
                  #:before-first (list "/* ")
                  #:after-last (list "*/\n")
                  #:splice? #t)))

(define (list-strip lst pred?)
  (dropf-right (dropf lst pred?) pred?))
(define-tag-function
  (listing attrs elems)
  (report elems)
  (report attrs)
  (list-splice
    (macro 'noindent)
    (macro 'hrulefill)
    (select 'name (txexpr 'root null elems))
    (macro 'hrulefill)
    (environment 'lstlisting
           #:opt-args 
           `("caption={" ,@(report (select*
                               'description
                               (txexpr 'root null elems))) "}")
           elems)))

(define-tag-function
  (code attrs elems)
  (if (memf newline? elems)
    (environment 'lstlisting elems)
    (macro 'lstinline elems)))

(define-tag-function
  (h1 attrs elems)
  (macro 'section elems))

(define-tag-function
  (h2 attrs elems)
  (macro 'subsection elems))

(define-tag-function
  (h3 attrs elems)
  (macro 'subsubsection elems))


(define (box elems ref-msg)
  (if (and (= 1 (length elems)) (symbol? (first elems)))
    ref-msg
    (list-splice "\n\n"
                 (macro 'noindent)
                 (macro 'hrulefill)
                 "\n\n"
                 "Example:"
                 "\n\n"
                 (list-splice elems)
                 "\n\n"
                 (macro 'noindent)
                 (macro 'hspace '("2em"))
                 (macro 'hrulefill)
                 (macro 'hspace '("2em")))))

;(define-tag-function
  ;(example attrs elems)
  ;(box elems "a previous example"))

(define-tag-function
  (e attrs elems)
  (box elems "a previous exercise"))

(define (note . _) "")
(define (ignore . _) "")

; It's assumed that the comment tag is composed only of strings, or
; tags that have already transformd to a string by the time this
; function is executed.
(define-tag-function
  (comment attrs elems)
  (list-splice (report (flatten (comment-split (string-join elems) 50)))))

(define (bold . elems) 
  (macro 'textbf (report elems)))
(define (answer . elems) "")

(define-tag-function
  (rule attrs elems)
  (if (and (= 1 (length elems)) (symbol? (first elems)))
    "a previous rule"
    (environment 'center `("Rule: " ,(apply bold elems)))))

(define-tag-function
  (em attrs elems)
  (macro 'textsl elems))

(define term em)
(define point em)

(define-tag-function
  (llog attrs elems)
  (apply ensure-math `(,(macro 'text "log") "(" ,@elems ")")))

(define (text-in-math . elems)
  (macro 'text (list (macro 'textsl elems))))

(define (root . elems)
  (->ltx (txexpr 'root null elems)))

(define (attr-list-ref lst key [failure-result #f])
  (let ([pair (findf (λ (p) (eq? (first p) key)) lst)])
    (if pair (second pair) failure-result)))

(define type-label 
  (make-parameter (void)))
(define counter
  (make-parameter (void)))

(define-syntax-rule 
  (define-ref-tag (name attrs elems) body ...)
  (define-tag-function
    (name attrs elems)
    (parameterize ([type-label
                     (λ (label) 
                        (format "~a:~a" (syntax->datum #'name) label))]
                   [counter 
                     (format "custom~acounter" (syntax->datum #'name))])
      (if (and (= 1 (length elems)) (symbol? (first elems)))
        (macro 'ref (list ((type-label) (first elems))))
        (list-splice (macro 'refstepcounter (list (counter)))
                     (let ([label (attr-list-ref attrs 'label)])
                       (if label
                         (macro 'label (list ((type-label) label)))
                         ""))
                     body ...)))))

(define-ref-tag
  (example attrs elems)
  (list-splice 
    (macro 'noindent)
    (macro 'hrulefill)
    "\n\n"
    "Example: "
    (macro 'arabic (list (counter)))
    "\n\n"
    (list-splice elems)
    "\n\n"
    (macro 'noindent)
    (macro 'hspace '("2em"))
    (macro 'hrulefill)
    (macro 'hspace '("2em"))))

; TODO: 
; - Handle references to something. You have to be able to label
;   something, have the label stick to just that "unit" and refer back
;   to that label, and I'd like to do all of that using the exact same
;   interface:
;   to create:    ◊tag{#:label name]{contents...}
;   to reference: ◊tag['name]
;   - This is a very helpful reference!
;     <https://tex.stackexchange.com/questions/111280/understanding-how-references-and-labels-work#111281>
;     It seems that the label macro refers to the counter of the thing
;     that most recently updated. There's no special "scoping" or
;     anything like I'd originally thought. That means that I can
;     pretty easily label anything that I'd want. I just need to
;     create a counter for those different classes of things, and
;     update the counters when necessary, and then place a \label
;     macro right after the counter gets updated. I could facilitate
;     the process with latex macros... or not. I dunno. I don't want
;     there to be stuff that the ->ltx tags depend on which is
;     required to be in the template. For now, it doesn't matter. Go
;     with whatever feels best/easiest, and see if there's reasons to
;     do otherwise.
;   - Here's another useful source:
;     <https://en.wikibooks.org/wiki/LaTeX/Counters>
;     I was right! Most recently updated counter using the
;     \refstepcounter macro is what sets the current label. So, as
;     long as I place a label after the update of a counter, I can
;     number a thing.
;   - So, in general, if I create something that goes like:
;     \refstepcounter{somecounter}\label{type:name} stuff...
;     then I can reference the stuff.
(provide (all-defined-out))
(provide list-splice let-splice $ $$)
