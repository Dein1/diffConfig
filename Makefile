install: 
	npm install

lint:
	npm run eslint .

publish:
	npm publish

test:
	npm run test

start:
	npm run babel-node -- src/bin/gendiff.js --format string /Users/dmitry/project/hexlet-project-2/before-recursive.json /Users/dmitry/project/hexlet-project-2/after-recursive.json

start1:
	npm run babel-node -- src/bin/gendiff.js -f plain /Users/dmitry/project/hexlet-project-2/before-recursive.json /Users/dmitry/project/hexlet-project-2/after-recursive.json

start2:
	npm run babel-node -- src/bin/gendiff.js /Users/dmitry/project/hexlet-project-2/before-recursive.json /Users/dmitry/project/hexlet-project-2/after-recursive.json

help:
	npm run babel-node -- src/bin/gendiff.js -h

v:
	npm run babel-node -- src/bin/gendiff.js -V