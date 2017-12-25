src:=$(wildcard *.tex)
outputDir=output
targets:=$(addprefix $(outputDir)/, $(src:.tex=.pdf))
all : $(targets)
output/%.pdf : %.tex
		pdflatex -output-directory ${outputDir} $<
