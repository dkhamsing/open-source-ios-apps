require 'json'

c = File.read 'contents.json'
j = JSON.parse c

c = j['categories']

c.sort_by { |h| h['title']}
  .each { |x| puts x['id']}
