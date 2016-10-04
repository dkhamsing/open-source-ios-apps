require_relative 'osia_helper'

j = get_json
apps = j['projects']

i = 0
apps.select {|a| a['screenshots'].nil? }.each do |a|
  # if a['screenshots'].nil?
    puts "#{i + 1}. Screenshots missing for #{a['title']}"
    i = i + 1
  # end
end

# apps.select {|a| a['screenshots']!=nil }.each do |a|
#   s = a['screenshots']
#   if s.count==0
#     puts s
#     puts "#{i + 1}. Screenshots missing for #{a['title']}"
#     i = i + 1
#   end
# end
