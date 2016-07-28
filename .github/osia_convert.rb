require_relative 'osia_helper'
require 'date'

README = 'README.md'

ARCHIVE = 'ARCHIVE.md'
ARCHIVE_TAG = 'archive'

def apps_archived(apps)
  a = apps.select {|a| a['tags'] != nil }.select {|b| b['tags'].include?ARCHIVE_TAG}
  a.sort_by { |k, v| k['title'] }
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
    cat = a['category']
    cat.class == Array ? cat.include?(id) : (cat == id)
  end
  s.sort_by { |k, v| k['title'].downcase }
end

def output_apps(apps)
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

      o << "- #{name}"

      if desc.nil?
        o << ' '
      else
        o << ": #{desc} " if desc.size>0
      end

      unless itunes.nil?
        o << "[` App Store`](#{itunes}) "
      end

      unless tags.nil?
        o << '`Swift` ' if tags.include? 'swift'
      end

      unless lang.nil?
        o << output_flag(lang)
      end

      unless stars.nil?
        o << output_stars(stars)
      end

      o << "\n"

      show_details = !homepage.nil? || !screenshots.nil? || !license.nil? || !date_added.nil?

      if (!show_details)
        o << "  - #{link}\n"
      else
        details = "  <details><summary>#{link}</summary>\n"

        details_list = []
        unless date_added.nil?
          date = DateTime.parse(date_added)
          formatted_date = date.strftime "%B %e, %Y"
          details_list.push "Added #{formatted_date}"
        end

        unless license.nil?
          details_list.push "License: `#{license}`"
        end

        unless homepage.nil?
          details_list.push homepage
        end

        details << '  '
        details << details_list[0]
        details_list[1..-1].each { |x| details << "  - #{x}" }

        unless screenshots.nil?
          screenshots.each_with_index do |s, i|
            details << "  ![#{name} image #{i+1}](#{screenshots[i]})" unless screenshots.nil?
          end
        end

        details << "\n  </details>\n"
        o << details
      end
  end
  o
end

def output_flag(lang)
  case lang
  when 'ger'
    '🇩🇪'
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

def write_readme(j)
  t    = j['title']
  desc = j['description']
  h    = j['header']
  f    = j['footer']
  cats = j['categories']
  apps = j['projects']

  date = DateTime.now
  date_display = date.strftime "%B %e, %Y"

  output = '# ' + t
  output << "\n\n"
  output << desc
  output << "\n\nA collaborative list of **#{apps.count}** open-source `iOS`, `watchOS` and `tvOS` apps, your [contribution](https://github.com/dkhamsing/open-source-ios-apps/blob/master/.github/CONTRIBUTING.md) is welcome :smile: "
  output << "(last update *#{date_display}*)."

  output << "\n \nJump to \n \n"

  cats.each do |c|
    title = c['title']
    m = title.match /\[.*?\]/
    title = m[0].sub('[', '').sub(']', '') unless m.nil?
    temp = "#{'  ' unless c['parent']==nil }- [#{title}](\##{c['id']}) \n"
    output << temp
  end

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
    output << output_apps(cat_apps)
  end

  output << "\n"
  output << f

  File.open(README, 'w') { |f| f.write output }
  puts "wrote #{README} ✨"
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
    # output <<
  end

  output << "\n"
  output << f

  file = ARCHIVE
  File.open(file, 'w') { |f| f.write output }
  puts "wrote #{file} ✨"
end

j = get_json

write_readme(j)
write_archive(j)
