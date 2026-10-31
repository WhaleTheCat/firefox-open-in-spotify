JSC := /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc

.PHONY: test zip

test:
	$(JSC) spotify-link.js tests/spotify-link.test.js

zip:
	mkdir -p dist
	zip -FS dist/open-in-spotify-app.zip manifest.json background.js spotify-link.js icons/on.svg icons/off.svg
