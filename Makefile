all : bin/Abubu.js

subdirs:=src
bin/Abubu.js: .PHONY
	make --directory=$(subdirs)
	./maker.sh

.PHONY:

clean:
	make --directory=$(subdirs) clean
	rm -rf libs/Abubu.js
