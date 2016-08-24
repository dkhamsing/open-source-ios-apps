function updateNavigationPadding() {
    $(document.body).css("padding-top", $("#main-nav").outerHeight() + 15);
}

function starString(starCount) {
	if(starCount == null) return "";
	
	var starLimit = [100, 200, 500, 1000, 2000];
	
	var starResult = [""];
	for(var i = 1; i <= starLimit.length; i++) {
		starResult[i] = starResult[i-1] + ":star:";
	}
	
	var i = 0;
	while(starCount >= starLimit[i] && i < starLimit.length) i++;
	
 	return starResult[i];
}

function langString(lang) {
	if(typeof lang == "undefined") return "";
	
	var langMapping = { "deu": { name: "German", flag: "🇩🇪" }, "jpn": { name: "Japanese", flag: "🇯🇵" }, "ltz": { name: "Luxembourgish", flag: "🇱🇺" }, "nld": { name: "Dutch", flag: "🇳🇱" }, "por": { name: "Portuguese", flag: "🇵🇹" }, "spa": { name: "Spanish", flag: "🇪🇸" }, "zho": { name: "Chinese", flag: "🇨🇳" } }; 
	
	if(langMapping.hasOwnProperty(lang)) {
		return "<span title=\"" + langMapping[lang].name + "\">" + emojione.unicodeToImage(langMapping[lang].flag) + "</span>";
	}
	else {
		return "";
	}
}

$(document).ready(function() {
	// Fetch latest contents.json file
	$.get("https://raw.githubusercontent.com/dkhamsing/open-source-ios-apps/master/contents.json", function(data) {
		// Set a global variable for easier debugging
		d = data;

		// Update app count
		$("#app-count").text(data.projects.length);

		// Create and add table of contents items
		categoryElements = {};
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
			
			if(currentProject.category.constructor !== Array) {
				currentProject.category = [currentProject.category];
			}
			for(var j = 0; j < currentProject.category.length; j++) {
				var licenseMap = { "mit": "https://opensource.org/licenses/MIT", "mpl-2.0": "https://opensource.org/licenses/MPL-2.0", "gpl-3.0": "https://opensource.org/licenses/BSD-3-Clause", "lgpl-3.0": "https://opensource.org/licenses/LGPL-3.0", "unlicense": "http://unlicense.org/", "bsd-2-clause": "https://opensource.org/licenses/BSD-2-Clause", "isc": "https://opensource.org/licenses/ISC", "lgpl-2.1": "https://opensource.org/licenses/LGPL-2.1", "gpl-2.0": "https://opensource.org/licenses/GPL-2.0", "apache-2.0": "https://opensource.org/licenses/Apache-2.0", "cc0-1.0": "https://creativecommons.org/publicdomain/zero/1.0/deed.en", "artistic-2.0": "https://opensource.org/licenses/Artistic-2.0", "bsd-3-clause": "https://opensource.org/licenses/BSD-3-Clause", "agpl-3.0": "https://opensource.org/licenses/AGPL-3.0", "epl-1.0": "https://opensource.org/licenses/EPL-1.0" };
				
				$("#category-" + currentProject.category[j]).append($("<div class=\"list-group-item\"><h4 class=\"list-group-item-heading\">" + currentProject.title + "</h4><p class=\"list-group-item-text\">" + (typeof currentProject.description != "undefined" ? currentProject.description + " " : "") + langString(currentProject.lang) + "<span class=\"stars\" title=\"" + currentProject.stars + " Stars\">" + starString(currentProject.stars) + "</span>" + (typeof currentProject.itunes != "undefined" ? "<span title=\"Available on the App Store\">" + emojione.unicodeToImage("📱") + "</span>" : "") + "</p><p class=\"list-group-item-text details\">" + (typeof currentProject.itunes == "undefined" ? "" : "iTunes: <a href=\"" + currentProject.itunes + "\">" + currentProject.itunes + "</a><br />") + "Source: <a href=\"" + currentProject.source + "\">" + currentProject.source + "</a><br />License: " + (licenseMap.hasOwnProperty(currentProject.license) ? "<a href=\"" + licenseMap[currentProject.license] + "\">" + currentProject.license + "</a>" : currentProject.license) + "<br />Suggested by <a href=\"https://github.com/" + currentProject.suggested_by + "\">" + currentProject.suggested_by + "</a> on <span class=\"text-info\">" + (new Date(currentProject.date_added)).toDateString() + "</span></p></div>"));
				// Increment category badge
				var badge = categoryElements[currentProject.category[j]].children("h4").children(".badge");
				badge.html(Number(badge.html()) + 1);
			}
		}

		// Convert shortcodes and unicode characters to nice looking emojis
		$(document.body).html(emojione.toImage($(document.body).html()));
		// Workaround for stars not being updated for some reason
		$(".stars").each(function() {
			$(this).html(emojione.toImage($(this).html()));
		});
		
		// Workaround for when the file is being loaded offline
		$(".emojione[src]").each(function() {
			if($(this).attr("src").startsWith("//")) {
				$(this).attr("src", "https:" + $(this).attr("src"));
			}
		});

		// Add app show more links
		$("#main-content .list-group-item").click(function() {
			$(this).children(".details").toggle("blind");
		});
	}, "json").fail(function() {
		// TODO Handle error gracefully
	});

	// Register event to to top padding
	$(window).resize(updateNavigationPadding);
	// Check the nav size now
	updateNavigationPadding();
});