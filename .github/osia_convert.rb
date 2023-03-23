require_relative 'osia_helper'
require 'date'

# Constants

README = 'README.md'
ARCHIVE = 'ARCHIVE.md'
APPSTORE = 'APPSTORE.md'
LATEST = 'LATEST.md'

ARCHIVE_TAG = 'archive'

LATEST_NUM = 30

SHOW_TWITTER = false

# Helpers

def app_store_total(j)
  apps = j['projects']
  s = apps.reject { |x| x['itunes'].nil? }

  count = 1
  s.each do |x|
    tags = x['tags']
    if tags.nil?
      t = "#{count} "
      count = count + 1
    else
      unless tags.include?(ARCHIVE_TAG)
        t = "#{count} #{tags}"
        count = count + 1
      end
    end
  end

  count
end

def apps_archived(apps)
  a = apps.select { |a| a['tags'] != nil }.select { |b| b['tags'].include?(ARCHIVE_TAG) }
  a.sort_by { |k, v| k['title'].downcase }
end

def apps_for_cat(apps, id)
  f = apps.select do |a|

    tags = a['tags']
    if tags.nil?
      true
    else
      !(tags.include?(ARCHIVE_TAG))
    end
  end

  s = f.select do |a|
    cat = a['category-ids']
    cat.class == Array ? cat.include?(id) : (cat == id)
  end
  s.sort_by { |k, v| k['title'].downcase }
end

def apps_latest(apps, num)
  a = apps.select { |a| a['date_added'] != nil }
    .sort_by { |k, v| DateTime.parse(k['date_added']) }
    .reverse

  a[0..num - 1]
end

def apps_updated(apps, num)
  a = apps.select { |a| a['updated'] != nil }
  .sort_by { |k, v| DateTime.parse(k['updated']) }
  .reverse

  a[0..num - 1]
end

def output_apps(apps, appstoreonly)
  o = ''
  apps.each do |a|
    name = a['title']
    link = a['source']
    itunes = a['itunes']
    homepage = a['homepage']
    desc = a['description']
    tags = a['tags']
    stars = a['stars']
    date_updated = a['updated']
    screenshots = a['screenshots']
    license = a['license']

    lines = []

    line = []
    line.push "[#{name}](#{link})"

    unless desc.nil?
      line.push ": #{desc}" if desc.size>0
    end

    lines.push line

    line = []
    unless homepage.nil?
      line.push "<a href=#{homepage}>`#{homepage}`</a>"
    end

    lines.push line

    line = []
    unless itunes.nil?
      line.push "[` App Store`](#{itunes})"
    end

    if appstoreonly
      next if itunes.nil?
    end

    unless screenshots.nil? || screenshots.empty?
      screenshots.each_with_index do |s, i|
        line.push " <a href='#{screenshots[i]}'>`Screenshot #{i+1}`</a> "
      end
    end

    lines.push line

    line = []

    unless date_updated.nil?
      date = DateTime.parse(date_updated)
      formatted_date = date.strftime "%Y"
      line.push " `#{formatted_date}` "
    end

    # unless license.nil?
    #   license_display = license == 'other' ? "" : "[`#{license}`](http://choosealicense.com/licenses/#{license}/)"
    #   line.push << " #{license_display} "
    # end

    unless tags.nil?
      line.push '`swift` ' if tags.include? 'swift'
      tags.each do |t|
        line.push "`#{t.downcase}` " if t.downcase != 'swift'
      end
    end

   lines.push line

   line = []
   unless stars.nil?
    line.push " ☆`#{stars}` " if stars > 0
   end

   lines.push line

   lines.each_with_index do |item, i|
     temp = ''
     item.each { |x| temp << "#{x}" }
     unless temp.empty?
       if i == 0
         o << "\n- #{temp}"
       else
         o << "\n  - #{temp}"
       end
     end
   end

   # o << "\n"
  end
  o
end

def output_badges(count, twitter)
  date = DateTime.now
  date_display = date.strftime "%B %e, %Y"
  date_display = date_display.gsub ' ', '%20'

  b = "![](https://img.shields.io/badge/Projects-#{count}-green.svg)"

  if twitter
    b << " [![](https://img.shields.io/badge/Twitter-@opensourceios-blue.svg)](https://twitter.com/opensourceios)"
  end

  b << " ![](https://img.shields.io/badge/Updated-#{date_display}-lightgrey.svg)"
  return b
end

def write_archive(j, subtitle)
  t = j['title']
  apps = j['projects']
  archived = apps_archived apps
  footer = j['footer']

  output = "\# #{t} Archive\n\n"
  output << subtitle
  output << "\n"

  archived.each do |a|
    t = a['title']
    s = a['source']
    output << "- [#{t}](#{s})\n"
  end

  output << "\n"
  output << footer

  file = ARCHIVE
  File.open(file, 'w') { |f| f.write output }
  puts "wrote #{file} ✨"
end

def write_latest(j, num, sub1, sub2)
  t = j['title']
  apps = j["projects"]
  footer = j['footer']
  latest = apps_latest(apps, num)

  output = "\# #{t} Latest\n\n"
  output << sub1
  output << "\n"

  count = 1
  latest.each do |a|
    t = a['title']
    s = a['source']
    output << "#{count}. [#{t}](#{s})\n"
    count = count + 1
  end

  updated = apps_updated(apps, num)

  output << "\n"
  output << sub2
  output << "\n"

  count = 1
  updated.each do |a|
    t = a['title']
    s = a['source']
    output << "#{count}. [#{t}](#{s})\n"
    count = count + 1
  end

  output << "\n"
  output << footer

  file = LATEST
  File.open(file, 'w') { |f| f.write output }
  puts "wrote #{file} ✨"
end

def write_list(j, file, subtitle, appstoreonly = false)
  t = j['title']
  desc = j['description']
  h = j['header']
  f = j['footer']
  cats = j['categories']
  apps = j['projects']

  sponsor = j['sponsor']

  output = '# ' + t
  output << "\n\n"
  output << desc

  output << "\n\n#{subtitle}\n\n"

  if appstoreonly == false
    output << output_badges(apps.count, SHOW_TWITTER)

    unless sponsor.length == 0
      output << "\n\n"
      output << sponsor
      output << "\n"
    end
  end

  output << "\n\nJump to\n\n"

  cats.each do |c|
    title = c['title']
    m = title.match /\[.*?\]/
    title = m[0].sub('[', '').sub(']', '') unless m.nil?
    temp = "#{'  ' unless c['parent'] == nil }- [#{title}](\##{c['id']}) \n"
    output << temp
  end

  output << "- [Thanks](#thanks)\n"
  output << "- [Contact](#contact)\n"

  output << "\n"
  output << h
  output << "\n"

  cats.each do |c|
    temp = "\n#\##{'#' unless c['parent']==nil } #{c['title']} \n \n"

    d = c['description']
    temp << "#{d} — " unless d.nil?

    temp << "[back to top](#readme) \n \n"
    output << temp

    cat_apps = apps_for_cat(apps, c['id'])
    output << output_apps(cat_apps, appstoreonly)
  end

  output << "\n"
  output << f

  File.open(file, 'w') { |f| f.write output }
  puts "wrote #{file} ✨"
end

# Script begins

j = get_json


subtitle_readme = j['subtitle']
write_list(j, README, subtitle_readme)

subtitle_app_store = "List of **#{app_store_total j}** open-source apps published on the App Store (complete list [here](https://github.com/dkhamsing/open-source-ios-apps))."
write_list(j, APPSTORE, subtitle_app_store, true)

subtitle_archive = "This is an archive of the [main list](https://github.com/dkhamsing/open-source-ios-apps) for projects that are no longer maintained / old.\n\n"
write_archive(j, subtitle_archive)

subtitle_latest = "## Lastest additions to the [main list](https://github.com/dkhamsing/open-source-ios-apps)\n"
subtitle_updated = "## Most recently updated\n"
write_latest(j, LATEST_NUM, subtitle_latest, subtitle_updated)
