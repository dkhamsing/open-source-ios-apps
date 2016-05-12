To contribute to`open-source-ios-apps`, please update the **contents.json** file (this will generate the README).

## New category

Please [open an issue](https://github.com/dkhamsing/open-source-ios-apps/issues) and contact
@dkhamsing, @kvnbautista or @scribblemaniac.

## New app

Adding a `JSON` entry

### New entries go to the end of the file

![add-entry](https://cloud.githubusercontent.com/assets/4723115/15217463/7f8060c6-1810-11e6-97f7-3b555dc78bf9.gif)

At the end of **contents.json**, add an entry at `}]`.

```js
		"stars": 100
	}] // here
}
```

Insert a comma between `}` and `]` and create a new entry with the format below.

### Format

Feel free to cut and paste the snippet below

```js
{
    	  	"title": "Name of the app",
    		"category": "Category name",
    		"description": "What this app does",
    		"source": "Link to source, usually GitHub"
	}
```

#### Details

`title`, `category`, `description` and `source` are required, the rest is optional.

```js
{
		"title": "App name",
		"category": ["github", "parse"],
		"description": "Describe what this app does",
		"source": "https://github.com/user/repo",
		"homepage": "https://awesome-url",
		"itunes": "https://itunes.apple.com/app/id1234567890",		
		"lang": "zho",     
		"stars": 200,     
		"tags": ["swift"]
}
```

- `category`: Use an approved category from this list  https://github.com/dkhamsing/open-source-ios-apps/wiki/Categories

- `category`: An app can belong to more than one category, in that case use a list format in the example above

- `stars`: Number of GitHub stars

- `lang`: App language in the form of ISO 639-2 code https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes

- `tags`: List of app attribute tags, use `swift` if the app is written in Swift

#### Examples

Pull request:

- https://github.com/dkhamsing/open-source-ios-apps/pull/281
- https://github.com/dkhamsing/open-source-ios-apps/pull/281/files

```js
{
		"title": "Firefox",
		"category": ["browser", "official"],
		"description": "Official Firefox app",
		"source": "https://github.com/mozilla/firefox-ios",
		"itunes": "https://itunes.apple.com/app/firefox-web-browser/id989804926",
		"stars": 5641,
		"tags": ["swift"]
}
```

```js
{
		"title": "VLC",
		"category": ["media", "official"],
		"description": "Media Player",
		"source": "https://github.com/videolan/vlc",
		"homepage": "https://www.videolan.org/",
		"itunes": "https://itunes.apple.com/app/vlc-for-ios/id650377962",
		"stars": 1753
}
```

```js
{
		"title": "Simple Reader",
		"category": "hacker-news",
		"source": "https://github.com/rnystrom/HackerNewsReader",
		"itunes": "https://itunes.apple.com/app/simple-reader-free-open-source/id1000995253",
		"stars": 182
}
```

Thanks for contributing :tada:
