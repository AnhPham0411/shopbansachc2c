@echo off
echo Dang don dep file tam...
del /q *.aux *.log *.out *.toc *.lof *.lot *.blg *.bbl *.run.xml *.bcf

echo.
echo Dang bien dich lan 1 (pdflatex)...
pdflatex -interaction=nonstopmode main.tex

echo.
echo Dang xu ly tai lieu tham khao (bibtex)...
bibtex main

echo.
echo Dang bien dich lan 2 de cap nhat muc luc...
pdflatex -interaction=nonstopmode main.tex

echo.
echo Dang bien dich lan cuối de chot so trang...
pdflatex -interaction=nonstopmode main.tex

echo.
echo ======================================================
echo CHUC MUNG! Bao cao da duoc bien dich xong.
echo Ban hay mo file main.pdf de kiem tra ket qua.
echo ======================================================
pause
