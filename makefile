GO ?= go
GOMOD:=$(GO) mod
BUILD= $(GO) build
DEV:= $(GO) run


NPM= npm

init:
	mv ./config/setting.json.sample ./config/setting.json

install: init;
	$(NPM) install --prefix ./web

run: install;
	$(NPM) run build --prefix ./web

build: run;
	$(BUILD) -o run-this main.go

dev: run;
	$(DEV) main.go