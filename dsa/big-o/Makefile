racketFiles := $(wildcard *.rkt)

all : listings

listings : listings.pdf

%.pdf : %.tex
	pdflatex $<

%.tex : %.tex.pm $(racketFiles) template.tex.p
	raco pollen render $@
