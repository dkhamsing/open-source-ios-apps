require_relative 'osia_helper'

OUTPUT = 'temp-links'

def apps_archived(apps)
  a = apps.select {|a| a['tags'] != nil }.select {|b| b['tags'].include?'archive'}
  a.sort_by { |k, v| k['title'] }
end

j = get_json
a = j['projects']
archived = apps_archived a
links = a.reject { |x| archived.include? x }.map { |y| y['source']}

links.each_with_index { |z, i| puts "#{i+1} #{z}"}

puts "Writing #{OUTPUT}"
File.open(OUTPUT, 'w') { |f| f.puts links }
