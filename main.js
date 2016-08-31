var themes = [{ name: "Cerulean", description: "A calm blue sky" }, { name: "Cosmo", description: "An ode to Metro" }, { name: "Cyborg", description: "Jet black and electric blue" }, { name: "Darkly", description: "Flatly in night mode" }, { name: "Flatly", description: "Flat and modern" }, { name: "Journal", description: "Crisp like a new sheet of paper" }, { name: "Lumen", description: "Light and shadow" }, { name: "Paper", description: "Material is the metaphor" }, { name: "Readable", description: "Optimized for legibility" }, { name: "Sandstone", description: "A touch of warmth" }, { name: "Simplex", description: "Mini and minimalist" }, { name: "Slate", description: "Shades of gunmetal gray" }, { name: "Spacelab", description: "Silvery and sleek" }, { name: "Superhero", description: "The brave and the blue" }, { name: "United", description: "Ubuntu orange and unique font" }, { name: "Yeti", description: "A friendly foundation" }];
var previewTheme = null;
var _settings = {};

function updateNavigationPadding() {
    $(document.body).css("padding-top", $("#main-nav").outerHeight() + 15);
}

function cancelSettings() {
	console.log("cancel");
	// Remove the preview theme and restore the current theme
	if(previewTheme != null) {
		previewTheme = null;
		var currentTheme = loadSetting("theme");
		$("#bootstrap-theme").attr("href", "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/" + currentTheme.toLowerCase() + "/bootstrap.min.css");
		$(".theme-item.panel-primary").removeClass("panel-primary").addClass("panel-default");
		$(".theme-item[name=" + currentTheme + "]").removeClass("panel-default").addClass("panel-primary");
	}
}

function loadSetting(key) {
	if(_settings.hasOwnProperty(key)) {
		return _settings[key];
	}
	else {
		// Try localstorage
		if(window.localStorage && window.localStorage.hasOwnProperty(key)) {
			return window.localStorage.getItem(key);
		}
		
		// Try cookies
		var cookieSplit = document.cookie.split(";");
		var keyEqual = key + "=";
		for(var i = 0; i < cookieSplit.length; i++) {
			cookieSplit[i] = cookieSplit[i]
			var j = 0;
			while(j < cookieSplit.length && cookieSplit[j] == " ") j++;
			if(cookieSplit[i].indexOf(keyEqual, j) == j) return cookieSplit[i].substring(j + keyEqual.length);
		}
		
		// Fall back to default options
		var defaultSettings = { theme: "Sandstone" };
		if(defaultSettings.hasOwnProperty(key)) {
			return defaultSettings[key];
		}
		
		// Unknown setting (no default), return undefined
		console.warn("Attempt to access unknown key '" + key + "'");
		return undefined;
	}
}

function saveSetting(key, value) {
	if(window.localStorage) {
		window.localStorage.setItem(key, value);
	}
	else {
		var expiry = new Date();
		expiry.setFullYear(expiry.getFullYear() + 1);
		document.cookie = key + "=" + value + ";path='/';expires=" + expiry; 
	}
}

function saveSettings() {
	// Keep the preview theme (if there is one)
	if(previewTheme != null) {
		saveSetting("theme", previewTheme);
		previewTheme = null;
	}
	
	// Hide modal dialog
	$("#settings").modal("hide");
}

function starString(starCount) {
	if(starCount == null) return "";
	
	var starLimit = [100, 200, 500, 1000, 2000];
	
	var starResult = [""];
	for(var i = 1; i <= starLimit.length; i++) {
		starResult[i] = starResult[i-1] + emojione.shortnameToImage(":star:");
	}
	
	var i = 0;
	while(starCount >= starLimit[i] && i < starLimit.length) i++;
	
 	return "<span class=\"insert-tooltip\" title=\"" + starCount + " Stars\">" + starResult[i] + "</span>";
}

function langString(lang) {
	if(typeof lang == "undefined") return "";
	
	var langMapping = { "deu": { name: "German", flag: "🇩🇪" }, "jpn": { name: "Japanese", flag: "🇯🇵" }, "ltz": { name: "Luxembourgish", flag: "🇱🇺" }, "nld": { name: "Dutch", flag: "🇳🇱" }, "por": { name: "Portuguese", flag: "🇵🇹" }, "spa": { name: "Spanish", flag: "🇪🇸" }, "zho": { name: "Chinese", flag: "🇨🇳" } }; 
	
	if(langMapping.hasOwnProperty(lang)) {
		return "<span class=\"insert-tooltip\" title=\"" + langMapping[lang].name + "\">" + emojione.unicodeToImage(langMapping[lang].flag) + "</span>";
	}
	else {
		return "";
	}
}

$(document).ready(function() {
	// Load boostrap theme
	$(document.head).append("<link id=\"bootstrap-theme\" href=\"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/" + loadSetting("theme").toLowerCase() + "/bootstrap.min.css\" rel=\"stylesheet\">");
	
	// Fetch latest contents.json file
	$.get("https://raw.githubusercontent.com/dkhamsing/open-source-ios-apps/master/contents.json", function(data) {
		// Set a global variable for easier debugging
		d = data;

		// Update app count
		$("#app-count").text(data.projects.length);

		// Create and add table of contents items
		categoryElements = {};
		//var toc = $("<div id=\"toc\" class=\"container\"><h1>Table of Contents</h1></div>"); 
		for(var i = 0; i < data.categories.length; i++) {
			var currentCategory = data.categories[i];
			categoryElements[currentCategory.id] = $("<div class=\"toc-item\"><h4 class=\"toc-item-bullet\"></h4><div class=\"toc-item-content\"><h4><a href=\"#category-" + currentCategory.id + "\">" + currentCategory.title + "</a> <span class=\"badge\">0</span></h4>" + (typeof currentCategory.description != "undefined" ? "<p>" + currentCategory.description + "</p>" : "") + "</div></div>");
			if(typeof currentCategory.parent != "undefined") {
				categoryElements[currentCategory.parent].children(".toc-item-content").append(categoryElements[currentCategory.id]);
			}
			else {
				$("#toc").append(categoryElements[currentCategory.id]);
				$("#main-content").append($("<div class=\"category-wrapper\" id=\"category-" + currentCategory.id + "\"><div class=\"list-group-item title\"><h2 class=\"list-group-item-heading\">" + currentCategory.title + "</h2>" + (typeof currentCategory.description != "undefined" ? "<p class=\"list-group-item-text\">" + currentCategory.description + "</p>" : "") + "</div></div>"));
			}
		}

		// Add icons to toc-item-bullet classes
		$(".toc-item-bullet").addClass("glyphicon glyphicon-menu-right");

		// Create and add apps
		for(var i = 0; i < data.projects.length; i++) {
			var currentProject = data.projects[i];
			
			for(var j = 0; j < currentProject["category-ids"].length; j++) {
				var licenseMap = { "mit": "https://opensource.org/licenses/MIT", "mpl-2.0": "https://opensource.org/licenses/MPL-2.0", "gpl-3.0": "https://opensource.org/licenses/BSD-3-Clause", "lgpl-3.0": "https://opensource.org/licenses/LGPL-3.0", "unlicense": "http://unlicense.org/", "bsd-2-clause": "https://opensource.org/licenses/BSD-2-Clause", "isc": "https://opensource.org/licenses/ISC", "lgpl-2.1": "https://opensource.org/licenses/LGPL-2.1", "gpl-2.0": "https://opensource.org/licenses/GPL-2.0", "apache-2.0": "https://opensource.org/licenses/Apache-2.0", "cc0-1.0": "https://creativecommons.org/publicdomain/zero/1.0/deed.en", "artistic-2.0": "https://opensource.org/licenses/Artistic-2.0", "bsd-3-clause": "https://opensource.org/licenses/BSD-3-Clause", "agpl-3.0": "https://opensource.org/licenses/AGPL-3.0", "epl-1.0": "https://opensource.org/licenses/EPL-1.0" };
				
				$("#category-" + currentProject["category-ids"][j]).append($("<div class=\"list-group-item\"><h4 class=\"list-group-item-heading\">" + currentProject.title + "</h4><p class=\"list-group-item-text\">" + (typeof currentProject.description != "undefined" ? currentProject.description + " " : "") + langString(currentProject.lang) + starString(currentProject.stars) + (typeof currentProject.itunes != "undefined" ? "<a class=\"app-store-button\" href=\"" + currentProject.itunes + "\" target=\"_blank\"><span class=\"fa fa-apple\"></span><span class=\"hidden-s hidden-xs\">&nbsp;Available on the App Store</span></a>" : "") + "</p><p class=\"list-group-item-text details\">" + "Source: <a href=\"" + currentProject.source + "\" target=\"_blank\">" + currentProject.source + "</a><br />License: " + (licenseMap.hasOwnProperty(currentProject.license) ? "<a href=\"" + licenseMap[currentProject.license] + "\" target=\"_blank\">" + currentProject.license + "</a>" : currentProject.license) + "<br />Suggested by <a href=\"https://github.com/" + currentProject.suggested_by + "\" target=\"_blank\">" + currentProject.suggested_by + "</a> on <span class=\"text-info\">" + (new Date(currentProject.date_added)).toDateString() + "</span></p></div>"));
				// Increment category badge
				var badge = categoryElements[currentProject["category-ids"][j]].children(".toc-item-content").children("h4").children(".badge");
				badge.html(Number(badge.html()) + 1);
			}
		}

		// Convert shortcodes and unicode characters to nice looking emojis
		$(document.body).html(emojione.toImage($(document.body).html()));
		
		// Workaround for when the file is being loaded local
		$(".emojione[src]").each(function() {
			if($(this).attr("src").startsWith("//")) {
				$(this).attr("src", "https:" + $(this).attr("src"));
			}
		});

		// Add app show more links
		$("#main-content .list-group-item").click(function() {
			$(this).children(".details").toggle("blind");
		});
		
		// Prevent details from showing when clicking the app store link
		$(".app-store-button").click(function(e) {
			e.stopPropagation();
		});
		
		// Add themes to settings dialog
		for(var i = 0; i < themes.length; i++) {
			var currentTheme = loadSetting("theme");
			var cell = $("<div class=\"theme-item panel panel-" + (themes[i].name == currentTheme ? "primary" : "default") + "\" name=\"" + themes[i].name + "\"><div class=\"panel-heading\">" + themes[i].name + "</div><div class=\"panel-body\"><img src=\"https://bootswatch.com/" + themes[i].name.toLowerCase() + "/thumbnail.png\" /><p>" + themes[i].description + "</p></div></div>");
			$("#theme-container").append(cell);
		}
		// Enable theme selection
		$(".theme-item").click(function() {
			$(".theme-item.panel-primary").removeClass("panel-primary").addClass("panel-default");
			$(this).removeClass("panel-default").addClass("panel-primary");
			previewTheme = $(this).attr("name");
			$("#bootstrap-theme").attr("href", "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/" + previewTheme.toLowerCase() + "/bootstrap.min.css");
		});
		
		// Add tooltips
		$(".insert-tooltip").tooltip({ position: top });
		
		// Open settings dialog when the button is pressed
		$("#setting-button").click(function() { $("#settings").modal("show"); });
		// Register save settings
		$("#save-settings").click(saveSettings);
		// Register modal close handler
		$("#settings").on("hide.bs.modal", cancelSettings);
	}, "json").fail(function() {
		// TODO Handle error gracefully
	});

	// Register event to to top padding
	$(window).resize(updateNavigationPadding);
	// Check the nav size now
	updateNavigationPadding();
});