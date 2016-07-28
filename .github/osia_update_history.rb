require_relative 'osia_helper'

require 'awesome_print'
require 'colored'

HISTORY = 'git_history'

def get_author(a)
  a = a.gsub 'Author:', ''

  u =
  if a.include? 'users.noreply.github.com>'
    m = /<.*?@/.match a
    '@' + m[0].sub('@','')
  else
    m = /.*</.match a
    m[0]
  end

  t = u.sub('<', '').strip

  t
end

j = get_json
apps = j['projects']
updated = []

c = File.read HISTORY
history = JSON.parse c

apps.each_with_index do |a, i|
  t = a['title']

  puts "#{i + 1}/#{apps.count}. Updating #{t}".yellow

  h = history[t]

  # TODO: skip entries with history

  if h.size==0
    updated.push a
  else
    lines = h.split "\n"

    d=''
    u=''
    lines.reverse.each do |x|
      # puts x
      if d=='' || u==''
        if x.include? 'Date:'
          d = x.gsub('Date:','').strip
          # d = x.gsub 'Date:',''
          # puts d
        end

        if x.include? 'Author:'
          u = get_author(x)
        end

      end
    end

    a['date_added'] = d
    a['suggested_by'] = u
    updated.push a

  end
end

j['projects'] = updated

File.open(FILE, 'w') { |f| f.write JSON.pretty_generate(j) }
puts "\nUpdated #{FILE} ⭐️"
