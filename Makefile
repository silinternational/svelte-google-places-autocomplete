
build: install
	npm run build

install:
	npm install

test: build
	npm run test

clean:
	npm prune
	npm run clean
