\documentclass{article}

\usepackage{amsmath}
\usepackage{amssymb}
\usepackage{listings}
\usepackage{xcolor}

\lstdefinelanguage{javascript}{
    keywords={if, else, for, in, of, typeof, function, return,
    let, var},
    morecomment=[l]{//},
    morecomment=[s]{/*}{*/},
    morestring=[b]{"},
    morestring=[b]{'},
}
\lstset{
    language=javascript,
    basicstyle=\small\ttfamily, % print whole listing small
    keywordstyle=\color{red!080!black}\bfseries,
    identifierstyle=, % nothing happens
    commentstyle=\color{green!050!black}, % white comments
    stringstyle=\ttfamily, % typewriter type for strings
    showstringspaces=false}

\newcounter{customexamplecounter}

\begin{document}
◊(select* 'root doc)
\end{document}
