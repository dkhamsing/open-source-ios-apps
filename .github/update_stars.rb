require 'json'

require 'octokit'
require 'netrc'

FILE = 'contents.json'

c = File.read FILE
j = JSON.parse c

client = Octokit::Client.new(:netrc => true)

apps = j['projects']
updated = []

apps.each do |a|
  s = a['source']
  if s.nil?
    updated.push a
  elsif !(s.include? 'github')
    updated.push a
  else
    print '.'
    begin
        g = s.gsub('https://github.com/', '')
        r = client.repo g
        stars = r['stargazers_count']
        a['stars'] = stars
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
