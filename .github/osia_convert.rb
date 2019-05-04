require_relative 'osia_helper'
require 'date'

# File constants 
README = "README.md"
ARCHIVE = "ARCHIVE.md"
APPSTORE = "APPSTORE.md"
LATEST = "LATEST.md"

# Shows that a project is archived. 
ARCHIVE_TAG = "archive"

LATEST_APPS_COUNT = 15

##
#
class App
  attr_reader :title
  attr_reader :source
  attr_reader :itunes
  attr_reader :homepage
  attr_reader :description
  attr_reader :tags
  attr_reader :stars
  attr_reader :lang
  attr_reader :date_added
  attr_reader :screenshots
  attr_reader :license

  def initialize(json)
     @title = json["title"]
     @source = json["source"]
     @itunes = json["itunes"]
     @homepage = json["homepage"]
     @description = json["description"]
     @tags = json["tags"]
     @stars = json["stars"]
     @lang = json["lang"]
     @date_added = json["date_added"]
     @screenshots = json["screenshots"]
     @license = json["license"]
  end

end

##
#
def app_store_total(source)
  apps = source["projects"]
  apps = select_app_store_apps(apps)

  count = 1
  apps.each do |app|
    tags = app["tags"]
    if tags.nil?
      count = count + 1
    else
      unless tags.include?(ARCHIVE_TAG)
        count = count + 1
      end
    end
  end
  count
end

##
#
def assembly_apps(apps, appstoreonly)
  output = ""
  apps.each do |app|
    title = "[#{app.title}](#{app.source})"

    if app.description.nil?
      title << " "
    else
      title << ": #{app.description} " if app.description.size > 0
    end

    unless app.itunes.nil?
      title << "[` App Store`](#{app.itunes}) "
    end

    if appstoreonly
      next if app.itunes.nil?
    end

    output << "- #{title} \n"
    output << "  <details>\n\t<summary>"

    details = ""

    unless app.tags.nil?
      details << "<code>swift</code> " if app.tags.include? "swift"
      app.tags.each do |tag|
        details << "<code>#{tag.downcase}</code> " if tag.downcase != "swift"
      end
    end

    unless app.lang.nil?
      details << "🌐"
      details << " "
    end  

    unless app.stars.nil?
      details << output_stars(app.stars)
    end
    output << details

    output << "</summary>"

    details_list = []
    unless app.homepage.nil?
      details_list.push app.homepage
    end

    unless app.date_added.nil?
      date = DateTime.parse(app.date_added)
      formatted_date = date.strftime "%B %e, %Y"
      details_list.push "Added #{formatted_date}"
    end

    unless app.license.nil?
      license = app.license == "other" ? "`#{app.license}`" : "[`#{app.license}`](http://choosealicense.com/licenses/#{app.license}/)"
      details_list.push "License: #{license}"
    end

    details = "\n\n\t"
    details << details_list[0]
    details_list[1..-1].each { |x| details << "<br>  #{x}" }

    unless app.screenshots.nil? || app.screenshots.empty?
      details << "<br>"
      details << "\n\t"
      app.screenshots.each_with_index do |s, i|
        details << "<a href='#{app.screenshots[i]}'><code>Screenshot #{i+1}</code></a> "
      end
    end

    details << "\n  "
    details << "</details>\n\n"
    output << details
  end
  output
end

##
#
def assembly_badges(count)
  date = DateTime.now
  date_display = date.strftime "%B %e, %Y"
  date_display = date_display.gsub ' ', '%20'

  badges = ""
  badges << "![](https://img.shields.io/badge/Projects-#{count}-green.svg)"
  badges << " "
  badges << "[![](https://img.shields.io/badge/Twitter-@opensourceios-blue.svg)](https://twitter.com/opensourceios)"
  badges << " "
  badges << "![](https://img.shields.io/badge/Updated-#{date_display}-lightgrey.svg)"
  return badges
end

##
#
def write_list(source, file, appstoreonly = false)
  title = source["title"]
  subtitle = source["subtitle"]

  desc = if appstoreonly
    "List of **#{app_store_total(source)}** open-source apps published on the App Store (complete list [here](https://github.com/dkhamsing/open-source-ios-apps))"
  else
    source["description"]
  end

  header = source["header"]
  footer = source["footer"]
  categories = source["categories"]
  apps = source["projects"]

  sponsor = source["sponsor"]

  output = "# " + title
  output << "\n\n"
  output << desc

  if appstoreonly
    output << "\n\n"
    output << assembly_badges(app_store_total(source))
  else
    output << "\n\n#{subtitle}\n\n"
    output << assembly_badges(apps.count)
  end

  if !appstoreonly
    unless sponsor.length == 0
      output << "\n\n#{sponsor}\n"
    end
  end

  output << "\n\nJump to\n\n"

  categories.each do |category|
    title = category["title"]
    m = title.match /\[.*?\]/
    title = m[0].sub("[", "").sub("]", "") unless m.nil?
    temp = "#{"  " unless category["parent"] == nil }- [#{title}](\##{category["id"]})\n"
    output << temp
  end

  output << "- [Thanks](#thanks)\n"
  output << "- [Contact](#contact)\n"
  output << "\n#{header}\n"

  categories.each do |category|
    temp = "\n#\##{'#' unless category["parent"] == nil } #{category["title"]}\n\n"

    description = category['description']
    temp << "#{category} — " unless description.nil?

    temp << "[back to top](#readme)\n\n"
    output << temp

    apps_for_category = select_apps_with_category(apps, category['id']).map { |app| App.new(app) }
    output << assembly_apps(apps_for_category, appstoreonly)
  end

  output << "\n#{footer}"
  write_result(file, output)
end

##
#
def write_archive(source)
  apps = select_archived_apps(source["projects"]).map { |app| App.new(app) }
  description = "This is an archive of the [main list](https://github.com/dkhamsing/open-source-ios-apps) for projects that are no longer maintained / old.\n\n"

  output = "\# #{source["title"]} Archive\n\n"
  output << description
  output << assembly_badges(apps.count)
  output << "\n"

  apps.each do |app|
    output << "- [#{app.title}](#{app.source})\n"
  end

  output << "\n"
  output << source["footer"]

  write_result(ARCHIVE, output)
end

##
#
def write_latest(source)
  # - Maps projects to the App innstance
  # - Selects projects with date_added != nil
  # - Sort the projects
  # - Reverse the sorting order
  apps = source["projects"]
    .map { |app| App.new(app) }
    .select { |app| app.date_added != nil }
    .sort_by { |app| DateTime.parse(app.date_added) }
    .reverse
  
  latest_apps = apps[0..LATEST_APPS_COUNT - 1]

  description = "Shows the latest projects that were added to the [main list](https://github.com/dkhamsing/open-source-ios-apps).\n\n"

  output = "\# #{source["title"]} Latest\n\n"
  output << description
  output << assembly_badges(latest_apps.count)
  output << "\n"
  output << assembly_apps(latest_apps, false)
  output << "\n"
  output << source["footer"]

  write_result(LATEST, output)
end

##
# Converts a given number to a symbolic representation.
# Params
# - number: A number of stars.
# Returns: An appropriate emoji to a given number.
def output_stars(number)
  case number
  when 100...200
    return "⭐"
  when 200...500
    return "⭐⭐"
  when 500...1000
    return "⭐⭐⭐"
  when 1000...2000
    return "⭐⭐⭐⭐"
  when 2000...100000
    return "⭐⭐⭐⭐⭐"
  else
    return ""
  end
end

##
#
def select_archived_apps(apps)
  apps
  .select { |app| app["tags"] != nil }
  .select { |app| app["tags"].include?(ARCHIVE_TAG) }
  .sort_by { |key, value| key["title"].downcase }
end

##
#
def select_app_store_apps(apps)
  return apps.select { |app| app["itunes"] != nil }
end

##
#
def select_apps_with_category(apps, id)
  f = apps.select do |app|
    tags = app["tags"]
    if tags.nil?
      true
    else
      !(tags.include?(ARCHIVE_TAG))
    end
  end

  s = f.select do |app|
    cat = app["category-ids"]
    cat.class == Array ? cat.include?(id) : (cat == id)
  end
  s.sort_by { |k, v| k["title"].downcase }
end

##
# Writes an output to a file.
# Params
# - file: A file for writning.
# - output: An output to write.
def write_result(file, output)
  File.open(file, 'w') { |handler| 
    handler.write(output) 
  }
  puts "Wrote #{file} ✨"
end

##
# A decorative method for writing README.md
def write_readme(source)
  write_list(source, README)
end

##
# A decorative method for writing APPSTORE.md
def write_app_store(source)
  write_list(source, APPSTORE, true)
end

##
# Start point of the script.
source = get_json()
write_readme(source)
write_app_store(source)
write_archive(source)
write_latest(source)
