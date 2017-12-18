install: 
	npm install

lint:
	npm run eslint .

publish:
	npm publish

test:
	npm run test

start:
	npm run babel-node -- src/bin/gendiff.js before.json after.json

help:
	npm run babel-node -- src/bin/gendiff.js -h

v:
	npm run babel-node -- src/bin/gendiff.js -V