require_relative 'osia_helper'

OUTPUT = 'check-links.txt'
HP     = 'check-homepages.txt'

def apps_archived(apps)
  a = apps.select {|a| a['tags'] != nil }.select {|b| b['tags'].include?'archive'}
  a.sort_by { |k, v| k['title'] }
end

j = get_json
a = j['projects']
archived = apps_archived a
active = a.reject { |x| archived.include? x }

links = []
active.each do |z|
  links.push z['source']
  links.push z['itunes'] unless z['itunes'].nil?
end

links.each_with_index { |z, i| puts "#{i+1} #{z}" }

puts "Writing #{OUTPUT}"
File.open(OUTPUT, 'w') { |f| f.puts links }

hp = []
active.each do |z|
  hp.push z['homepage'] unless z['homepage'].nil?
end

hp.each_with_index { |z, i| puts "#{i+1} #{z}" }

puts "Writing #{HP}"
File.open(HP, 'w') { |f| f.puts hp }
