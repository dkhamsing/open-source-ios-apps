require_relative 'osia_helper'

require 'octokit'
require 'netrc'

client = Octokit::Client.new(:netrc => true)

j = get_json
apps = j['projects']
updated = []

apps.each_with_index do |a, index|
  s = a['source']
  if s.nil?
    updated.push a
  elsif !(s.include? 'github')
    updated.push a
  else
    print "#{index+1}/#{apps.count}\n"
    begin
        g = s.gsub('https://github.com/', '')
        r = client.repo g
        a['stars'] = r['stargazers_count']
        a['updated'] = r['pushed_at']
        updated.push a
      rescue => e
        puts "\nerror for #{s}: #{e}"
        updated.push a
        next
      end
  end
end

j['projects'] = updated

File.open(FILE, 'w') { |f| f.write JSON.pretty_generate(j) }
puts "\nUpdated #{FILE} ⭐️"
