require_relative 'osia_helper'

UNIQUES = 'check-unique.txt' # should be unique
LINKS   = 'check-links.txt'  # allow dupes

def apps_archived(apps)
  a = apps.select {|a| a['tags'] != nil }.select {|b| b['tags'].include?'archive'}
  a.sort_by { |k, v| k['title'] }
end

j = get_json
a = j['projects']
archived = apps_archived a
active = a.reject { |x| archived.include? x }

uniques = []
active.each do |z|
  uniques.push z['source']
  uniques.push z['itunes'] unless z['itunes'].nil?
  uniques.push z['screenshots'] unless z['screenshots'].nil?
end

uniques.each_with_index { |z, i| puts "#{i+1} #{z}" }

puts "Writing #{UNIQUES}"
File.open(UNIQUES, 'w') { |f| f.puts uniques }

links = []
active.each do |z|
  links.push z['homepage'] unless z['homepage'].nil?
  links.push z['title'] unless z['title'].nil?
  links.push z['description'] unless z['description'].nil?
end

c = j['categories']
c.each do |z|
  links.push z['title']
end

links.each_with_index { |z, i| puts "#{i+1} #{z}" }

puts "Writing #{LINKS}"
File.open(LINKS, 'w') { |f| f.puts links }
