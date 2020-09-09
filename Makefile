all : libs/Abubu.js

subdirs:=src
libs/Abubu.js: .PHONY
	make --directory=$(subdirs)
	./maker.sh
	cp -v libs/Abubu.js libs/Abubu.latest.js	

.PHONY:

clean:
	make --directory=$(subdirs) clean
	rm -rf libs/Abubu.js
