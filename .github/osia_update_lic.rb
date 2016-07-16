require_relative 'osia_helper'

require 'octokit'
require 'netrc'

client = Octokit::Client.new(:netrc => true)

j = get_json
apps = j['projects']
updated = []

apps.each do |a|
  s = a['source']
  if s.nil?
    updated.push a
  elsif !(s.include? 'github')
    updated.push a
  else
    begin
        g = s.gsub('https://github.com/', '')
        r = client.repo g, accept: 'application/vnd.github.drax-preview+json'
        lic = r[:license][:key]
        print lic
        print ':'

        a['license'] = lic
        puts a['license']

        updated.push a
      rescue => e
        a['license'] = 'other'
        puts a['license']

        updated.push a
        next
      end
  end
end

j['projects'] = updated

File.open(FILE, 'w') { |f| f.write JSON.pretty_generate(j) }
puts "\nUpdated #{FILE} ⭐️"
