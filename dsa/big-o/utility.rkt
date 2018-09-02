#lang racket
(require txexpr)
(require pollen/decode)

; Pollen Helpers: {{{ ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-syntax-rule (report EXPR)
  (let 
    [(result EXPR)
     (expr-length 25)
     (expr-string (~v (syntax->datum #'EXPR)))]
    (displayln
      (string-append
        ; If the syntax object is from some other module...
        (if (syntax-source-module #'EXPR)
          (format "[From ~a]" 
                  ; Report only the filename of the module.
                  (last
                    (explode-path
                      (resolved-module-path-name
                        (module-path-index-resolve 
                          (syntax-source-module #'EXPR))))))
          "")
        (format "(line ~a, col ~a): Expression ~a results in ~a"
                (syntax-line #'EXPR)
                (syntax-column #'EXPR)
                (if (> (string-length expr-string) expr-length)
                  (string-append (substring expr-string 0 expr-length) "...")
                  expr-string)
                result)))
    result))

; Makes it so that a list of elements appears in the pollen document
; as if they were not enclosed in a list. Like when/splice, but always
; happens. The map here is for just in case something is produced that
; is not a txexpr-element. Any number that's not a symbol (I think) is
; not a txexpr-element, so that's nonpositive numbers, floating-point,
; exact rational numbers which do not reduce to an integer.
(define (list-splice . args)
  (if (= 1 (length args))
    (let ([lst (first args)])
      (cons '@ 
            (map (lambda (e) (if (txexpr-element? e) e (~a e)))
                 lst)))
    (list-splice args)))
(define-syntax let-splice
  (lambda (stx)
    (syntax-case stx ()
      [(_ ((id val) ...) body)
       #'(let ((id val) ...) body)]
      [(_ ((id val) ...) body ...)
       #'(let ((id val) ...) 
           (list-splice body ...))])))

; }}} ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define (number->bits num)
  (if (< num 2)
    (list num)
    (append (number->bits (quotient num 2)) 
            (list (remainder num 2)))))
(define (enumerate lst)
  (build-list (length lst) identity))
(define printable? (or/c string? number? symbol?))
(define (reverse* val)
  (cond [(null? val) val]
        [(pair? val) (reverse (map reverse* val))]
        [else val]))
(define (my-flatten lst)
  (foldl
    (λ (cur prev)
       (if (pair? cur)
         (append prev (my-flatten cur))
         (append prev (list cur))))
    null lst))
(define (tree-depth val)
  (cond [(null? val) 0]
        [(list? val)
         (add1 (apply max (map tree-depth val)))]
        [else 0]))
(define (add-ns ns) 
  (λ (tx) 
     (txexpr
       (string->symbol (format "~a:~a" ns (get-tag tx)))
       (get-attrs tx)
       (get-elements tx))))
(define (is-tag? tag name)
  (and (txexpr? tag) (eq? (get-tag tag) name)))
; list? procedure? #:keep-where procedure? -> list?
; Somewhat similar to the split procedure for strings. Takes a list
; and returns a list of the same elements of lst, in the same order,
; but placed in sublists. Each sublist ends where an element occurs
; that causes (split-pred? element current-split tail) to be true. The
; next sublist picks up from there. If a split should be empty (such
; as when there are two consecutive elements that cause split-pred? to
; be true), then those splits are not kept.
; The split-map option is supplied because the output of split-where
; may not be a list of splits if the #:keep-where function returns
; 'separate. In this case, the split element is placed on it's own in
; the list of splits. Mapping over the splits (and only the splits) is
; a common enough use-case, I think, that the optional parameter is
; warranted.
; The reason why the objects at which we split are not placed in the
; list as splits is that this function takes after split-string, and
; functions like it from other languages. The thing upon which we
; split is normally removed. Not considered. There are use cases where
; you wouldn't want to throw away that which you split upon, but you'd
; want to run a function over everything else.
;
; TODO:
; Consider splitting this into two functions:
; - a splitter-function, which handled the iteration over the
;   elements, and expects a function which determines the next state
;   of everything. Like, the output of this function will be the next
;   current split, the next list of splits, and the new value of the
;   remaining elements to iterate upon.
; - A function which takes in the arguments like split-pred?
;   #:keep-where #:split-map, and uses those to create the function
;   that splitter-function uses. This will make the resulting
;   functionality of splitting easier to think about, especially as I
;   extend the capabilities of the function, stating allowing the user
;   to do something like directly supply the function
;   splitter-function wants, allowing them the greatest control over
;   the splitting method.
(define (split-where lst split-pred? 
          #:keep-where [keep-pred? (λ _ #f)]
          #:split-map [split-func #f])
  (define (iter current-split splits remaining)
    (cond 
      [(null? remaining) 
       (cond
         [(null? current-split) splits]
         [split-func (cons (split-func (reverse current-split)) splits)]
         [else (cons (reverse current-split) splits)])]
      [else
        (match-let
          [((cons elem tail) remaining)]
          (if (split-pred? elem current-split tail)
            (let* 
              [(decision (keep-pred? elem current-split
                                     tail))
               (new-current-split
                 (case decision
                   [(next) (list elem)]
                   [else null]))
               (final-current-split-contents
                 (reverse
                   (case decision
                     [(current) (cons elem current-split)]
                     [else current-split])))
               (processed-current-split
                 (cond
                   [(null? final-current-split-contents)
                    final-current-split-contents]
                   [split-func
                    (split-func final-current-split-contents)]
                   [else final-current-split-contents]))
               (new-splits
                 (begin 
                   (report decision)
                   (if (eq? decision 'separate)
                     (report (list elem processed-current-split))
                     (void))
                   (report 
                     (case decision
                       [(separate #t)
                        (if (null? processed-current-split)
                          (cons elem splits)
                          (append (list elem processed-current-split)
                                  splits))]
                       [else
                         (if (null? processed-current-split)
                           splits
                           (cons processed-current-split splits))]))))]
              (iter new-current-split
                    new-splits
                    tail))
            (iter (cons elem current-split)
                  splits
                  tail)))]))
  (reverse (iter null null lst)))

; list? list? -> lambda
; Takes in one of two optional lists of tags: 
; #:only, which specifies which tags to flatten and nothing else.
; #:exclude, which specifies flattens all tags but those listed.
; Returns a function that, when given as #:txexpr-proc in
; pollen/decode, will flatten those tags and leave all others alone.
(define (decode-flattener #:only [only-these (void)]
                          #:exclude [except-these (void)])
  (cond [(and (void? only-these) (void? except-these))
         get-elements]
        [(void? except-these)
         (λ (tx) 
            (if (ormap (λ (name) (is-tag? tx name)) only-these)
              (get-elements tx)
              tx))]
        [else 
          (λ (tx)
             (if (ormap (λ (name) (is-tag? tx name)) except-these)
               tx
               (get-elements tx)))]))

                        
; The difference between flatten and what I'm going for is that I'm
; not going to flatten everything.
; If I assume that the only tag left are math tags, which means that
; the document now looks like:
;   ('root (or/c string? math-tag?) ...)
; And that math tags may contain either strings or other math-tags,
; then all I'm really trying to do is call a special flatten on all
; the math tags. It's a txexpr-flatten which includes only the
; elements of the expression within the parent expression.
;
; If I wait until the absolute last moment to handle the math nesting,
; then one interesting consequence of this is that all the "top-level"
; math tags will necessarily be children of the root tag. This is
; because if the 'root tag has a tag as a child at this point, the
; only remaining tags at this point are math tags.

; ensure-math should expand to math, unless inside of a math tag.
; Can be accomplished through syntax parameters.
; ensure-math will be syntax parameter which expands to a math tag.
; math tags change that syntax parameter to be something
; inconsequential.
(define (math-process xexpr)
  (cond [(report (is-tag? (report xexpr) 'math))
         (list-splice
           `($
              ,@(decode-elements 
                 (get-elements xexpr)
                 #:txexpr-proc (decode-flattener #:only '(ensure-math)))
              $))]
        ; We know that this is not contained within a math tag, for if
        ; it were, the above branch would have been taken already, and
        ; decode would've been applied to this tag.
        [(is-tag? xexpr 'ensure-math)
         (math-process (txexpr 'math null (get-elements xexpr)))]
        [(txexpr? xexpr)
         (map (lambda (e) (if (txexpr? e) (math-process e) e)) xexpr)]
        [else xexpr]))

(provide (all-defined-out))
