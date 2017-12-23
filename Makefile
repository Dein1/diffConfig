install: 
	npm install

lint:
	npm run eslint .

publish:
	npm publish

test:
	npm run test

start:
	npm run babel-node -- src/bin/gendiff.js --format pretty /Users/dmitry/project/hexlet-project-2/__tests__/__fixtures__/before-recursive.json /Users/dmitry/project/hexlet-project-2/__tests__/__fixtures__/after-recursive.json

start1:
	npm run babel-node -- src/bin/gendiff.js -f json /Users/dmitry/project/hexlet-project-2/__tests__/__fixtures__/before-recursive.json /Users/dmitry/project/hexlet-project-2/__tests__/__fixtures__/after-recursive.json

start2:
	npm run babel-node -- src/bin/gendiff.js -f plain /Users/dmitry/project/hexlet-project-2/__tests__/__fixtures__/before-recursive.ini /Users/dmitry/project/hexlet-project-2/__tests__/__fixtures__/after-recursive.ini

help:
	npm run babel-node -- src/bin/gendiff.js -h

v:
	npm run babel-node -- src/bin/gendiff.js -V