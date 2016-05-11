require 'json'

OUTPUT = 'README.md'

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
  end
end

def output_flag(lang)
  case lang
  when 'jpn'
    '🇯🇵'
  when 'ltz'
    '🇱🇺'
  when 'por'
    '🇧🇷'
  when 'spa'
    '🇪🇸'
  when 'zho'
    '🇨🇳'
  end
end

def apps_for_cat(apps, id)
  s = apps.select do |a|
    cat = a['category']
    cat.class == Array ? cat.include?(id) : (cat == id)
  end
  s.sort_by { |k, v| k['title'] }
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

      o << "- #{name}"

      if desc.nil?
        o << ' '
      else
        o << ": #{desc} " if desc.size>0
      end

      unless tags.nil?
        o << "🔶" if tags.include? 'swift'
      end

      unless lang.nil?
        o << output_flag(lang)
      end

      unless stars.nil?
        o << output_stars(stars)
      end

      o << "\n"
      o << "  - #{link}\n"
      o << "  - #{homepage}\n" unless homepage.nil?
      o << "  - #{itunes}\n" unless itunes.nil?
  end
  o
end

c = File.read 'contents.json'
j = JSON.parse c

t    = j['title']
desc = j['description']
h    = j['header']
f    = j['footer']
cats = j['categories']
apps = j['projects']

output = '# ' + t
output << "\n\n"
output << desc
output << "\n \nJump to \n \n"

cats.each do |c|
  temp = "#{'  ' unless c['parent']==nil }- [#{c['title']}](\##{c['id']}) \n"
  output << temp
end

output << "- [Bonus](#bonus) \n"

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

File.open(OUTPUT, 'w') { |f| f.write output }
puts "wrote #{OUTPUT} ✨"
