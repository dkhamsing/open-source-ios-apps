require 'json'
require 'pp'

if ARGV.count == 0
  puts "Usage: ruby inspect.rb <project number>"
  exit
end

c = File.read 'contents.json'
j = JSON.parse c

projects = j['projects']

proj = ARGV[0].to_i
pp projects[proj]
