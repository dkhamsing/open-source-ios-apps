var themes = [{ name: "Cerulean", description: "A calm blue sky" }, { name: "Cosmo", description: "An ode to Metro" }, { name: "Cyborg", description: "Jet black and electric blue" }, { name: "Darkly", description: "Flatly in night mode" }, { name: "Flatly", description: "Flat and modern" }, { name: "Journal", description: "Crisp like a new sheet of paper" }, { name: "Lumen", description: "Light and shadow" }, { name: "Paper", description: "Material is the metaphor" }, { name: "Readable", description: "Optimized for legibility" }, { name: "Sandstone", description: "A touch of warmth" }, { name: "Simplex", description: "Mini and minimalist" }, { name: "Slate", description: "Shades of gunmetal gray" }, { name: "Spacelab", description: "Silvery and sleek" }, { name: "Superhero", description: "The brave and the blue" }, { name: "United", description: "Ubuntu orange and unique font" }, { name: "Yeti", description: "A friendly foundation" }];
var _settings = {};

function updateNavigationPadding() {
    $(document.body).css("padding-top", $("#main-nav").outerHeight());
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

function screenshotsString(screenshots) {
	if(typeof screenshots == "undefined") return "";

	var output = "<br />Screenshots:<div class=\"screenshot-container\">";
	for(var i = 0; i < screenshots.length; i++) {
		output += "<a href=\"#\"><input name=\"screenshot-src\" type=\"hidden\" value=\"" + screenshots[i] + "\"></a>";
	}
	output += "</div>";
	return output;
}

// Currently only inline links are supported
function handleLinks(str) {
	return str.replace(/\[(.*?)\]\((.*?)\)/g, "<a href=\"$2\" target=\"blank\">$1</a>");
}

jQuery.cachedScript = function( url, options ) {
  // Allow user to set any option except for dataType, cache, and url
  options = $.extend( options || {}, {
    dataType: "script",
    cache: true,
    url: url
  });

  // Use $.ajax() since it is more flexible than $.getScript
  // Return the jqXHR object so we can chain callbacks
  return jQuery.ajax( options );
};

// Create and add apps
function generateApps(start) {
  if(start > data.projects.length) return;

  var licenseMap = { "mit": "https://opensource.org/licenses/MIT", "mpl-2.0": "https://opensource.org/licenses/MPL-2.0", "gpl-3.0": "https://opensource.org/licenses/BSD-3-Clause", "lgpl-3.0": "https://opensource.org/licenses/LGPL-3.0", "unlicense": "http://unlicense.org/", "bsd-2-clause": "https://opensource.org/licenses/BSD-2-Clause", "isc": "https://opensource.org/licenses/ISC", "lgpl-2.1": "https://opensource.org/licenses/LGPL-2.1", "gpl-2.0": "https://opensource.org/licenses/GPL-2.0", "apache-2.0": "https://opensource.org/licenses/Apache-2.0", "cc0-1.0": "https://creativecommons.org/publicdomain/zero/1.0/deed.en", "artistic-2.0": "https://opensource.org/licenses/Artistic-2.0", "bsd-3-clause": "https://opensource.org/licenses/BSD-3-Clause", "agpl-3.0": "https://opensource.org/licenses/AGPL-3.0", "epl-1.0": "https://opensource.org/licenses/EPL-1.0" };

  var i;
  var expectedListGroupItems = $(".list-group-item").length;
  for(i = start; i < Math.min(start + 100, data.projects.length); i++) {
    var currentProject = data.projects[i];

    for(var j = 0; j < currentProject["category-ids"].length; j++) {
      expectedListGroupItems++;
      $("#category-" + currentProject["category-ids"][j]).append($("<div class=\"list-group-item\"><h4 class=\"list-group-item-heading\">" + currentProject.title + "</h4><div class=\"list-group-item-text\">" + (typeof currentProject.description != "undefined" ? currentProject.description + " " : "") + langString(currentProject.lang) + starString(currentProject.stars) + (typeof currentProject.itunes != "undefined" ? "<a class=\"app-store-button\" href=\"" + currentProject.itunes + "\" target=\"_blank\"><span class=\"fa fa-apple\"></span><span class=\"hidden-s hidden-xs\">&nbsp;Available on the App Store</span></a>" : "") + "</div><div class=\"list-group-item-text details\">" + "Source: <a href=\"" + currentProject.source + "\" target=\"_blank\">" + currentProject.source + "</a><br />License: " + (licenseMap.hasOwnProperty(currentProject.license) ? "<a href=\"" + licenseMap[currentProject.license] + "\" target=\"_blank\">" + currentProject.license + "</a>" : currentProject.license) + "<br />Suggested by <a href=\"https://github.com/" + (currentProject.suggested_by.indexOf("@") == 0 ? currentProject.suggested_by.substr(1) : currentProject.suggested_by) + "\" target=\"_blank\">" + currentProject.suggested_by + "</a> on <span class=\"text-info\">" + (new Date(currentProject.date_added)).toDateString() + "</span>" + screenshotsString(currentProject.screenshots) + "</div></div>"));
      // Increment category badge
      var badge = categoryElements[currentProject["category-ids"][j]].children(".toc-item-content").children("h4").children(".badge");
      badge.html(Number(badge.html()) + 1);
    }
  }

  var progress = Math.round(i / data.projects.length * 80);
  $("#splash-page .progress-bar[name=secondary-progress-bar]").attr("aria-valuenow", progress).width(progress + "%").html("<span class=\"sr-only\">" + progress + "% Complete</span>");
  progress = 50 + Math.round(i / data.projects.length * 40);
  $("#splash-page .progress-bar[name=primary-progress-bar]").attr("aria-valuenow", progress).width(progress + "%").html("<span class=\"sr-only\">" + progress + "% Complete</span>");
  $("#splash-page *[name=primary-progress-text]").html(progress + "% Complete");

  setTimeout(function() {
    if(i < data.projects.length) {
      generateApps(i);
    }
    else {
      endGenerateWebpage();
    }
  }, 600);
}

function beginGenerateWebpage() {
  $("#splash-page *[name=secondary-progress-text]").html("Generating webpage...");
  $("#splash-page .progress-bar[name=secondary-progress-bar]").attr("aria-valuenow", 0).addClass("disable-width-transition").width(0).html("<span class=\"sr-only\">0% Complete</span>");
  window.setTimeout(function() { $("#splash-page .progress-bar[name=secondary-progress-bar]").removeClass("disable-width-transition"); }, 1);

  // Update app count
  $("#app-count").text(data.projects.length);

  // Create and add table of contents items
  categoryElements = {};
  //var toc = $("<div id=\"toc\" class=\"container\"><h1>Table of Contents</h1></div>");
  for(var i = 0; i < data.categories.length; i++) {
    var currentCategory = data.categories[i];
    var titleMatches = currentCategory.title.match(/\[(.*?)\]/);
    categoryElements[currentCategory.id] = $("<div class=\"toc-item\"><h4 class=\"toc-item-bullet\"></h4><div class=\"toc-item-content\"><h4><a href=\"#category-" + currentCategory.id + "\">" + (titleMatches == null ? currentCategory.title : titleMatches[1]) + "</a> <span class=\"badge\">0</span></h4>" + (typeof currentCategory.description != "undefined" ? "<p>" + currentCategory.description + "</p>" : "") + "</div></div>");
    if(typeof currentCategory.parent != "undefined") {
      categoryElements[currentCategory.parent].children(".toc-item-content").append(categoryElements[currentCategory.id]);
      var title = currentCategory.title;
      var tempCategory = currentCategory;
      while(typeof tempCategory.parent != "undefined") {
        var newId = tempCategory.parent;
        var j = 0;
        do {
          tempCategory = data.categories[j++];
        } while(j < data.categories.length && tempCategory.id != newId);
        if(tempCategory.id != newId) break;
        title = tempCategory.title + " / " + title;
      }
      $("#category-" + currentCategory.parent).after("<div class=\"category-wrapper\" id=\"category-" + currentCategory.id + "\"><div class=\"list-group-item title\"><h2 class=\"list-group-item-heading\">" + title + "</h2>" + (typeof currentCategory.description != "undefined" ? "<p class=\"list-group-item-text\">" + currentCategory.description + "</p>" : "") + "</div></div>");
    }
    else {
      $("#toc").append(categoryElements[currentCategory.id]);
      $("#main-content").append("<div class=\"category-wrapper\" id=\"category-" + currentCategory.id + "\"><div class=\"list-group-item title\"><h2 class=\"list-group-item-heading\">" + currentCategory.title + "</h2>" + (typeof currentCategory.description != "undefined" ? "<p class=\"list-group-item-text\">" + currentCategory.description + "</p>" : "") + "</div></div>");
    }
  }

  // Add icons to toc-item-bullet classes
  $(".toc-item-bullet").addClass("glyphicon glyphicon-menu-right");

  generateApps(0);
}

function endGenerateWebpage() {
  // Convert shortcodes and unicode characters to nice looking emojis
  $(document.body).html(emojione.toImage($(document.body).html()));

  // Convert markdown links to html links
  $(document.body).html(handleLinks($(document.body).html()));

  // Workaround for when the file is being loaded local
  $(".emojione[src]").each(function() {
    if($(this).attr("src").startsWith("//")) {
      $(this).attr("src", "https:" + $(this).attr("src"));
    }
  });

  // Add app show more links
  $("#main-content .list-group-item").click(function() {
    var details = $(this).children(".details").toggle("blind");

    // Load screenshots if necessary
    var container = details.find(".screenshot-container");
    if(container.length && !container.find(".screenshot-thumbnail").length) {
      var srcs = details.find("input[name=screenshot-src]");
      srcs.each(function() {
        $(this).before("<img class=\"screenshot-thumbnail\" src=\"" + $(this).val() + "\">");
      });
    }
  });

  // Prevent details from showing when clicking the app store link
  $(".app-store-button").click(function(e) {
    e.stopPropagation();
  });

  $(".screenshot-container > a").click(function(e) {
    e.stopPropagation();
    e.preventDefault();

    var allImages = $(this).parent().find("img");
    var index = $(this).index();

    // Title
    $("#screenshot .modal-title").html($(this).closest(".list-group-item").children("h4").html() + " Screenshots");

    // Lower navigation
    var paginationContent = "<li name=\"left\"" + (index == 0 ? " class=\"disabled\"" : "") + "><a class=\"glyphicon glyphicon-menu-left\" href=\"#\"></a></li>";
    console.log(allImages);
    for(var i = 0; i < allImages.length; i++) {
      paginationContent += "<li" + (index == i ? " class=\"active\"" : "") + "><a href=\"" + allImages[i].src + "\">" + (i + 1) + "</a></li>";
    }
    paginationContent += "<li name=\"right\"" + (index == allImages.length - 1 ? " class=\"disabled\"" : "") + "><a class=\"glyphicon glyphicon-menu-right\" href=\"#\"></a></li>";
    $("#screenshot .pagination").html(paginationContent);

    function screenshotLeft(pagination) {
      var activeIndex = pagination.children(".active").index();

      if(activeIndex <= 1) return;

      // Update disable class on the arrow buttons
      pagination.children("[name='right']").removeClass("disabled")
      if(activeIndex == 2) {
        pagination.children("[name='left']").addClass("disabled");
      }

      $("#screenshot .modal-body").html("<img src=\"" + $($(pagination).children().removeClass("active")[activeIndex - 1]).addClass("active").children().attr("href") + "\">");
    }

    function screenshotRight(pagination) {
      var activeIndex = pagination.children(".active").index();

      if(activeIndex >= pagination.children().length - 2) return;

      // Update disable class on the arrow buttons
      pagination.children("[name='left']").removeClass("disabled")
      if(activeIndex == pagination.children().length - 3) {
        pagination.children("[name='right']").addClass("disabled");
      }

      $("#screenshot .modal-body").html("<img src=\"" + $($(pagination).children().removeClass("active")[activeIndex + 1]).addClass("active").children().attr("href") + "\">");
    }

    $("#screenshot .pagination a").click(function(e) {
      e.preventDefault();

      // Update active class
      if($(this).parent().attr("name") == "left") {
        screenshotLeft($(this).closest(".pagination"));
      }
      else if($(this).parent().attr("name") == "right") {
        screenshotRight($(this).closest(".pagination"));
      }
      else {
        $(this).parent().addClass("active").siblings().removeClass("active");
        $("#screenshot .modal-body").html("<img src=\"" + ($(this).attr("href")) + "\">");

        // Update disable class on the arrow buttons
        if($(this).parent().index() == 1) {
          $(this).parent().siblings("[name='left']").addClass("disabled");
        }
        else {
          $(this).parent().siblings("[name='left']").removeClass("disabled");
        }

        if($(this).parent().index() == $(this).closest('.pagination').children().length - 2) {
          $(this).parent().siblings("[name='right']").addClass("disabled");
        }
        else {
          $(this).parent().siblings("[name='right']").removeClass("disabled");
        }
      }
    });
    $(document).keypress(function(e) {
      if($("#screenshot:visible").length > 0) {
        if(e.keyCode == 37) {
          screenshotLeft($("#screenshot .pagination"));
        }
        else if(e.keyCode == 39) {
          screenshotRight($("#screenshot .pagination"));
        }
      }
    });

    // Image
    $("#screenshot .modal-body").html("<img src=\"" + $(this).children()[0].src + "\">");

    $("#screenshot").modal("show");
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
    var newTheme = $(this).attr("name");
    $("#bootstrap-theme").attr("href", "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/" + newTheme.toLowerCase() + "/bootstrap.min.css");
    saveSetting("theme", newTheme);
  });

  // Add tooltips
  $(".insert-tooltip").tooltip({ position: top });

  // Open settings dialog when the button is pressed
  $("#setting-button").click(function() { $("#settings").modal("show"); });

  $("#splash-page .progress-bar[name=secondary-progress-bar], #splash-page .progress-bar[name=primary-progress-bar]").attr("aria-valuenow", 100).width("100%").html("<span class=\"sr-only\">100% Complete</span>");
  $("#splash-page *[name=primary-progress-text]").html("100% Complete");

  window.setTimeout(function() {
    $("#splash-page").hide(400, function() {
      $("#main-page").show();
    });
  }, 600);
}

$(document).ready(function() {
  $("#splash-page *[name=secondary-progress-text]").html("Loading external resources...");

  var stylesheets = [{ name: "JQuery UI", url: "https://code.jquery.com/ui/1.12.0/themes/ui-lightness/jquery-ui.css", sri: "sha384-/1lcmz1m9PT8XfpLrMamIugjzUPppiB8az9R1tCZV1qS8qP9p3lCxwyzsmPyufhp" },
    { name: "EmojiOne", url: "https://cdn.jsdelivr.net/emojione/2.2.6/assets/css/emojione.min.css", sri: "sha384-+JoywCPFwbtS2KrNLFu8EJHK+r5KPfqww25+fIBceLuhRk4muZy4TZR/4gXrk3qX" },
    { name: "Google Fonts - Source Sans Pro", url: "https://fonts.googleapis.com/css?family=Source+Sans+Pro", sri: "sha384-bq+H1Q0QI5jWIvo+TdmoK5n1ZNSPrI+HE8+99jKyt7D/Z0uTSXXN60lA3tpJrghy"}];
  for(var i = 0; i < stylesheets.length; i++) {
    $(document.head).append("<link rel=\"stylesheet\" href=\"" + stylesheets[i].url + "\" integrity=\"" + stylesheets[i].sri + "\" crossorigin=\"anonymous\">");
  }
  // Load bootstrap theme
  $(document.head).append("<link id=\"bootstrap-theme\" href=\"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/" + loadSetting("theme").toLowerCase() + "/bootstrap.min.css\" rel=\"stylesheet\">");

  var loadedResources = 0;
  // Subsresource integrity (SRI) is not used currently unfortunately
  // waiting on https://github.com/jquery/jquery/issues/3028
  var scripts = [{ name: "EmojiOne", critical: false, url: "https://cdn.jsdelivr.net/emojione/2.2.6/lib/js/emojione.min.js", sri: "sha384-3dIbh57hmh316KYh5Vdc88SL/zDgH3aYHwwLOYOKhE9pGYRnnLgIJAs3F+jF+W9V" },
  { name: "JQuery UI", critical: true, url: "https://code.jquery.com/ui/1.12.0/jquery-ui.min.js", sri: "sha384-C/LoS0Y+QiLvc/pkrxB48hGurivhosqjvaTeRH7YLTf2a6Ecg7yMdQqTD3bdFmMO" },
  { name: "Font Awesome", critical: false, url: "https://use.fontawesome.com/f64017bd34.js", sri: "sha384-Yq8kRORkW2Q+nDmD/iy6Oq37XXokGZ0fLJg1EcCsuK3G0nqDtBWKggvn98kfCRuQ" },
  { name: "Bootstrap", critical: true, url: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js", sri: "sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" }];
  function updateResourcesProgress() {
    var progress = Math.round(loadedResources / (scripts.length + 1) * 100);
    $("#splash-page .progress-bar[name=secondary-progress-bar]").attr("aria-valuenow", progress).width(progress + "%").html("<span class=\"sr-only\">" + progress + "% Complete</span>");
    progress = Math.round(loadedResources / (scripts.length + 1) * 50);
    $("#splash-page .progress-bar[name=primary-progress-bar]").attr("aria-valuenow", progress).width(progress + "%").html("<span class=\"sr-only\">" + progress + "% Complete</span>");
    $("#splash-page *[name=primary-progress-text]").html(progress + "% Complete");
    if(loadedResources == (scripts.length + 1)) {
      // Wait for the transition to complete and then begin parsing contents.json
      window.setTimeout(beginGenerateWebpage, 600);
    }
  }
  for(var i = 0; i < scripts.length; i++) {
    $.cachedScript(scripts[i].url, { scriptObj: scripts[i] }).always(function(data, textStatus) {
      loadedResources++;
      updateResourcesProgress();
    }).fail(function(jqXHR, textStatus) {
      if(this.scriptObj.critical) {
        console.error("Could not load critical script " + this.scriptObj.name + ". Error message: " + textStatus);
        // TODO Notify user
      }
      else {
        // TODO Notify user
        console.warn("Could not load non-critical script " + this.scriptObj.name + ". Error message: " + textStatus);
      }
    });
  }
  // Fetch latest contents.json file
  // dataType must be specified explicitly to prevent caching
	$.get("https://raw.githubusercontent.com/dkhamsing/open-source-ios-apps/master/contents.json", {}, null, "json").always(function(d) {
    loadedResources++;
    updateResourcesProgress();
    data = d;
  }).fail(function() {
		// TODO Handle error gracefully
	});
});

/*$(document).ready(function() {
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
			var titleMatches = currentCategory.title.match(/\[(.*?)\]/);
			categoryElements[currentCategory.id] = $("<div class=\"toc-item\"><h4 class=\"toc-item-bullet\"></h4><div class=\"toc-item-content\"><h4><a href=\"#category-" + currentCategory.id + "\">" + (titleMatches == null ? currentCategory.title : titleMatches[1]) + "</a> <span class=\"badge\">0</span></h4>" + (typeof currentCategory.description != "undefined" ? "<p>" + currentCategory.description + "</p>" : "") + "</div></div>");
			if(typeof currentCategory.parent != "undefined") {
				categoryElements[currentCategory.parent].children(".toc-item-content").append(categoryElements[currentCategory.id]);
				var title = currentCategory.title;
				var tempCategory = currentCategory;
				while(typeof tempCategory.parent != "undefined") {
					var newId = tempCategory.parent;
					var j = 0;
					do {
						tempCategory = data.categories[j++];
					} while(j < data.categories.length && tempCategory.id != newId);
					if(tempCategory.id != newId) break;
					title = tempCategory.title + " / " + title;
				}
				$("#category-" + currentCategory.parent).after("<div class=\"category-wrapper\" id=\"category-" + currentCategory.id + "\"><div class=\"list-group-item title\"><h2 class=\"list-group-item-heading\">" + title + "</h2>" + (typeof currentCategory.description != "undefined" ? "<p class=\"list-group-item-text\">" + currentCategory.description + "</p>" : "") + "</div></div>");
			}
			else {
				$("#toc").append(categoryElements[currentCategory.id]);
				$("#main-content").append("<div class=\"category-wrapper\" id=\"category-" + currentCategory.id + "\"><div class=\"list-group-item title\"><h2 class=\"list-group-item-heading\">" + currentCategory.title + "</h2>" + (typeof currentCategory.description != "undefined" ? "<p class=\"list-group-item-text\">" + currentCategory.description + "</p>" : "") + "</div></div>");
			}
		}

		// Add icons to toc-item-bullet classes
		$(".toc-item-bullet").addClass("glyphicon glyphicon-menu-right");

		// Create and add apps
		for(var i = 0; i < data.projects.length; i++) {
			var currentProject = data.projects[i];

			for(var j = 0; j < currentProject["category-ids"].length; j++) {
				var licenseMap = { "mit": "https://opensource.org/licenses/MIT", "mpl-2.0": "https://opensource.org/licenses/MPL-2.0", "gpl-3.0": "https://opensource.org/licenses/BSD-3-Clause", "lgpl-3.0": "https://opensource.org/licenses/LGPL-3.0", "unlicense": "http://unlicense.org/", "bsd-2-clause": "https://opensource.org/licenses/BSD-2-Clause", "isc": "https://opensource.org/licenses/ISC", "lgpl-2.1": "https://opensource.org/licenses/LGPL-2.1", "gpl-2.0": "https://opensource.org/licenses/GPL-2.0", "apache-2.0": "https://opensource.org/licenses/Apache-2.0", "cc0-1.0": "https://creativecommons.org/publicdomain/zero/1.0/deed.en", "artistic-2.0": "https://opensource.org/licenses/Artistic-2.0", "bsd-3-clause": "https://opensource.org/licenses/BSD-3-Clause", "agpl-3.0": "https://opensource.org/licenses/AGPL-3.0", "epl-1.0": "https://opensource.org/licenses/EPL-1.0" };

				$("#category-" + currentProject["category-ids"][j]).append($("<div class=\"list-group-item\"><h4 class=\"list-group-item-heading\">" + currentProject.title + "</h4><div class=\"list-group-item-text\">" + (typeof currentProject.description != "undefined" ? currentProject.description + " " : "") + langString(currentProject.lang) + starString(currentProject.stars) + (typeof currentProject.itunes != "undefined" ? "<a class=\"app-store-button\" href=\"" + currentProject.itunes + "\" target=\"_blank\"><span class=\"fa fa-apple\"></span><span class=\"hidden-s hidden-xs\">&nbsp;Available on the App Store</span></a>" : "") + "</div><div class=\"list-group-item-text details\">" + "Source: <a href=\"" + currentProject.source + "\" target=\"_blank\">" + currentProject.source + "</a><br />License: " + (licenseMap.hasOwnProperty(currentProject.license) ? "<a href=\"" + licenseMap[currentProject.license] + "\" target=\"_blank\">" + currentProject.license + "</a>" : currentProject.license) + "<br />Suggested by <a href=\"https://github.com/" + currentProject.suggested_by + "\" target=\"_blank\">" + currentProject.suggested_by + "</a> on <span class=\"text-info\">" + (new Date(currentProject.date_added)).toDateString() + "</span>" + screenshotsString(currentProject.screenshots) + "</div></div>"));
				// Increment category badge
				var badge = categoryElements[currentProject["category-ids"][j]].children(".toc-item-content").children("h4").children(".badge");
				badge.html(Number(badge.html()) + 1);
			}
		}

		// Convert shortcodes and unicode characters to nice looking emojis
		$(document.body).html(emojione.toImage($(document.body).html()));

		// Convert markdown links to html links
		$(document.body).html(handleLinks($(document.body).html()));

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

		$(".screenshot-container > a").click(function(e) {
			e.stopPropagation();
			e.preventDefault();

			var allImages = $(this).parent().find("img");
			var index = $(this).index();

			// Title
			$("#screenshot .modal-title").html($(this).closest(".list-group-item").children("h4").html() + " Screenshots");

			// Lower navigation
			var paginationContent = "<li name=\"left\"" + (index == 0 ? " class=\"disabled\"" : "") + "><a class=\"glyphicon glyphicon-menu-left\" href=\"#\"></a></li>";
			for(var i = 0; i < allImages.length; i++) {
				paginationContent += "<li" + (index == i ? " class=\"active\"" : "") + "><a href=\"" + allImages[i].src + "\">" + (i + 1) + "</a></li>";
			}
			paginationContent += "<li name=\"right\"" + (index == allImages.length - 1 ? " class=\"disabled\"" : "") + "><a class=\"glyphicon glyphicon-menu-right\" href=\"#\"></a></li>";
			$("#screenshot .pagination").html(paginationContent);

			function screenshotLeft(pagination) {
				var activeIndex = pagination.children(".active").index();

				if(activeIndex <= 1) return;

				// Update disable class on the arrow buttons
				pagination.children("[name='right']").removeClass("disabled")
				if(activeIndex == 2) {
					pagination.children("[name='left']").addClass("disabled");
				}

				$("#screenshot .modal-body").html("<img src=\"" + $($(pagination).children().removeClass("active")[activeIndex - 1]).addClass("active").children().attr("href") + "\">");
			}

			function screenshotRight(pagination) {
				var activeIndex = pagination.children(".active").index();

				if(activeIndex >= pagination.children().length - 2) return;

				// Update disable class on the arrow buttons
				pagination.children("[name='left']").removeClass("disabled")
				if(activeIndex == pagination.children().length - 3) {
					pagination.children("[name='right']").addClass("disabled");
				}

				$("#screenshot .modal-body").html("<img src=\"" + $($(pagination).children().removeClass("active")[activeIndex + 1]).addClass("active").children().attr("href") + "\">");
			}

			$("#screenshot .pagination a").click(function(e) {
				e.preventDefault();

				// Update active class
				if($(this).parent().attr("name") == "left") {
					screenshotLeft($(this).closest(".pagination"));
				}
				else if($(this).parent().attr("name") == "right") {
					screenshotRight($(this).closest(".pagination"));
				}
				else {
					$(this).parent().addClass("active").siblings().removeClass("active");
					$("#screenshot .modal-body").html("<img src=\"" + ($(this).attr("href")) + "\">");

					// Update disable class on the arrow buttons
					if($(this).parent().index() == 1) {
						$(this).parent().siblings("[name='left']").addClass("disabled");
					}
					else {
						$(this).parent().siblings("[name='left']").removeClass("disabled");
					}

					if($(this).parent().index() == $(this).closest('.pagination').children().length - 2) {
						$(this).parent().siblings("[name='right']").addClass("disabled");
					}
					else {
						$(this).parent().siblings("[name='right']").removeClass("disabled");
					}
				}
			});
			$(document).keypress(function(e) {
				if($("#screenshot:visible").length > 0) {
					if(e.keyCode == 37) {
						screenshotLeft($("#screenshot .pagination"));
					}
					else if(e.keyCode == 39) {
						screenshotRight($("#screenshot .pagination"));
					}
				}
			});

			// Image
			$("#screenshot .modal-body").html("<img src=\"" + $(this).children()[0].src + "\">");

			$("#screenshot").modal("show");
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
			var newTheme = $(this).attr("name");
			$("#bootstrap-theme").attr("href", "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/" + newTheme.toLowerCase() + "/bootstrap.min.css");
			saveSetting("theme", newTheme);
		});

		// Add tooltips
		$(".insert-tooltip").tooltip({ position: top });

		// Open settings dialog when the button is pressed
		$("#setting-button").click(function() { $("#settings").modal("show"); });
	}, "json").fail(function() {
		// TODO Handle error gracefully
	});

	// Register event to to top padding
	$(window).resize(updateNavigationPadding);
	// Check the nav size now
	updateNavigationPadding();
});*/
