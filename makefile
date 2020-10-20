GO ?= go
GOMOD:=$(GO) mod
BUILD= $(GO) build
DEV:= $(GO) run


NPM= npm


install:
	$(NPM) install --prefix ./web

run: install;
	$(NPM) run build --prefix ./web

build: run;
	$(BUILD) -o main main.go

dev: run;
	$(DEV) main.go