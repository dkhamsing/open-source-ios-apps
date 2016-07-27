require_relative 'osia_helper'

HISTORY = 'git_history'

j = get_json
apps = j['projects']

h = {}
apps.each_with_index do |a, i|
  t = a['title']
  puts "#{i + 1}/#{apps.count}. checking #{t}"
  command = "git log --all --grep='#{t}'"

  begin
    r = `#{command}`
  rescue e
    r = e
  end

  h[t] = r
end

File.open(HISTORY, 'w') { |f| f.write JSON.pretty_generate h }
puts "wrote #{HISTORY} ✨"
