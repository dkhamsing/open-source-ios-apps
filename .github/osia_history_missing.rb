require_relative 'osia_helper'

j = get_json
apps = j['projects']

i = 0
apps.each do |a|
  if a['date_added'].nil?
    puts "#{i + 1}. History missing for #{a['title']}"
    i = i + 1
  end
end
