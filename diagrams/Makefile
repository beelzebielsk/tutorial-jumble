src:=$(wildcard *.tex)
outputDir=output
targets:=$(addprefix $(outputDir)/, $(src:.tex=.pdf))

all : $(targets)

output/%.pdf : %.tex | $(outputDir)
		pdflatex -output-directory ${outputDir} $<

$(outputDir) :
	mkdir $(outputDir)
