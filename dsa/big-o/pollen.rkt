#lang racket

(require pollen/tag
         pollen/core
         txexpr
         "utility.rkt"
         "latex-commands.rkt")

(define-tag-function
  (code attrs elems)
  (list-splice
    (select 'name (txexpr 'root null elems))
    (apply environment 'lstlisting 
           #:opt-args 
           `("caption={" ,@(report (select*
                               'description
                               (txexpr 'root null elems))) "}")
           (filter string? elems)))
  )

(provide (all-defined-out))
