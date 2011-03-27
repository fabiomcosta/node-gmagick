build:
	@node-waf configure build

test: build
	@cd tests && vows *.*