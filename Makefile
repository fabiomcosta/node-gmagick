build:
	@node-waf configure build

clean:
	@node-waf clean

install:
	@npm install

test: build
	@mkdir -p tests/temp/ && rm -rf tests/temp/*
	@cd tests && env GMAGICK_DEBUG=1 vows *.js

.PHONY: build clean install
