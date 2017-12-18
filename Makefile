install: 
	npm install

lint:
	npm run eslint .

publish:
	npm publish

start:
	npm run babel-node -- src/bin/gendiff.js