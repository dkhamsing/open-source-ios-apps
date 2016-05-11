To contribute to`open-source-ios-apps`, please update the **contents.json** file (this will generate the README)

## New category

Please [open an issue](https://github.com/dkhamsing/open-source-ios-apps/issues) and contact
@dkhamsing, @kvnbautista or @scribblemaniac

## New app

Adding a `JSON` entry

### New entries go to the end of the file

At the end of **contents.json**, add an entry at `}]`

```js
		"stars": 100
	}] // here
}
```

Insert a comma between `}` and `]` and create a new entry with the format below.

### Format

At minimum

```js
  {
		"title": "MrCode",
		"category": "github",
		"description": "GitHub iPhone app that can cache Markdown content",
		"source": "https://github.com/haolloyin/MrCode" // note, no comma on last line
  }
```

Optionally

```js
  {
		"title": "App name",
		"category": ["github", "parse"],
		"description": "Describe what this app does",
		"lang": "zho",
		"source": "https://github.com/user/repo",
		"homepage": "https://awesome-url",
		"itunes": "https://itunes.apple.com/app/id1234567890",
		"tags": ["swift"],
		"stars": 200 // number of GitHub stars
  }
```

Thanks for contributing :tada:
