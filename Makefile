all : libs/Abubu.js

subdirs:=src
libs/Abubu.js: .PHONY
	make --directory=$(subdirs)
	./maker.sh

.PHONY:

clean:
	make --directory=$(subdirs) clean
	rm -rf libs/Abubu.js
