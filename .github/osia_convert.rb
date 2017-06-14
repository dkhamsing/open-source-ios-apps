require_relative 'osia_helper'
require 'date'

README = 'README.md'

ARCHIVE = 'ARCHIVE.md'
ARCHIVE_TAG = 'archive'

APPSTORE = 'APPSTORE.md'

def apps_archived(apps)
  a = apps.select {|a| a['tags'] != nil }.select {|b| b['tags'].include?ARCHIVE_TAG}
  a.sort_by { |k, v| k['title'].downcase }
end

def apps_for_cat(apps, id)
  f = apps.select do |a|

    tags = a['tags']
    if tags.nil?
      true
    else
      !(tags.include? ARCHIVE_TAG)
    end
  end

  s = f.select do |a|
    cat = a['category-ids']
    cat.class == Array ? cat.include?(id) : (cat == id)
  end
  s.sort_by { |k, v| k['title'].downcase }
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
    lang = a['lang']

    date_added = a['date_added']
    screenshots = a['screenshots']
    license = a['license']

    t = "#{name}"

    if desc.nil?
      t << ' '
    else
      t << ": #{desc} " if desc.size>0
    end

    unless itunes.nil?
      t << "[` App Store`](#{itunes}) "
    end

    if appstoreonly
      next if itunes.nil?
    end

    o << "- #{t} \n"

    o <<  "  <details><summary>"

    details = if tags.nil?
      '<code>objc</code> '
    else
      ''
    end

    unless tags.nil?
      details << '<code>swift</code> ' if tags.include? 'swift'

      tags.each do |t|
        details << "<code>#{t.downcase}</code> " if t.downcase!='swift'
      end
    end

    unless lang.nil?
      details << output_flag(lang)
      details << ' '
    end

    unless stars.nil?
      details << output_stars(stars)
    end
    o << details

    o << "</summary>"

    details_list = []

    details_list.push link

    unless homepage.nil?
      details_list.push homepage
    end

    unless date_added.nil?
      date = DateTime.parse(date_added)
      formatted_date = date.strftime "%B %e, %Y"
      details_list.push "Added #{formatted_date}"
    end

    unless license.nil?
      license_display = license=='other'? "`#{license}`" : "[`#{license}`](http://choosealicense.com/licenses/#{license}/)"
      details_list.push "License: #{license_display}"
    end

    details = "\n\n  "
    details << details_list[0]
    details_list[1..-1].each { |x| details << "<br>  #{x}" }

    unless screenshots.nil?
      details << "\n  <div>"
      screenshots.each_with_index do |s, i|
        details << "<img height='300' alt='#{name} image #{i+1}' src='#{screenshots[i]}'> "
      end
      details << "\n</div>"
    end

    details << "\n  </details>\n\n"
    o << details
  end
  o
end

def output_badges(count)
  date = DateTime.now
  date_display = date.strftime "%B %e, %Y"
  date_display = date_display.gsub ' ', '%20'

  b = "![](https://img.shields.io/badge/Projects-#{count}-green.svg) [![](https://img.shields.io/badge/Twitter-@opensourceios-blue.svg)](https://twitter.com/opensourceios) ![](https://img.shields.io/badge/Updated-#{date_display}-lightgrey.svg)"
  b
end

def output_flag(lang)
  case lang
  when 'deu'
    '🇩🇪'
  when 'fra'
    '🇫🇷'
  when 'jpn'
    '🇯🇵'
  when 'ltz'
    '🇱🇺'
  when 'nld'
    '🇳🇱'
  when 'por'
    '🇵🇹'
  when 'spa'
    '🇪🇸'
  when 'rus'
    '🇷🇺'
  when 'zho'
    '🇨🇳'
  else
    ''
  end
end

def output_stars(number)
  case number
  when 100...200
    '🔥'
  when 200...500
    '🔥🔥'
  when 500...1000
    '🔥🔥🔥'
  when 1000...2000
    '🔥🔥🔥🔥'
  when 2000...100000
    '🔥🔥🔥🔥🔥'
  else
    ''
  end
end

def write_list(j, file, appstoreonly = false)
  t    = j['title']
  subt = j['subtitle']
  desc = j['description']
  h    = j['header']
  f    = j['footer']
  cats = j['categories']
  apps = j['projects']

  output = '# ' + t
  output << "\n\n"

  if appstoreonly == false
    output << desc
    output << "\n\n#{subt}\n\n"
    output << output_badges(apps.count)
  else
    output << 'List of open-source apps published on the App Store (complete list [here](https://github.com/dkhamsing/open-source-ios-apps))'
  end

  output << "\n\nJump to\n\n"

  cats.each do |c|
    title = c['title']
    m = title.match /\[.*?\]/
    title = m[0].sub('[', '').sub(']', '') unless m.nil?
    temp = "#{'  ' unless c['parent']==nil }- [#{title}](\##{c['id']}) \n"
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

def write_archive(j)
  t    = j['title']
  desc = "This is an archive of the [main list](https://github.com/dkhamsing/open-source-ios-apps) for projects that are no longer maintained / old.\n\n"
  f    = "## Contact\n\n- [github.com/dkhamsing](https://github.com/dkhamsing)\n- [twitter.com/dkhamsing](https://twitter.com/dkhamsing)\n"
  apps = j['projects']
  archived = apps_archived apps

  output = "\# #{t} Archive\n\n"
  output << desc

  archived.each do |a|
    t = a['title']
    s = a['source']
    output << "- #{t} #{s}\n"
  end

  output << "\n"
  output << f

  file = ARCHIVE
  File.open(file, 'w') { |f| f.write output }
  puts "wrote #{file} ✨"
end

j = get_json

write_list(j, README)
write_archive(j)
write_list(j, APPSTORE, true)
