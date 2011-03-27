build:
	@node-waf configure build

test: build
	@mkdir -p tests/temp/ && rm -rf tests/temp/*
	@cd tests && vows *.*