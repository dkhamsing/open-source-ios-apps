require 'json'

j = JSON.parse(File.read 'contents.json')
c = j['categories']
a = j['projects']

def failed(cat, app)
  puts "‼️  #{cat} is not a valid category for #{app}"
  exit 1
end

def verify(cat, allowed, app)
  failed(cat, app) unless allowed.include? cat
end

allowed_categories = c.sort_by { |h| h['title']}.map { |x| x['id']}

a.each do |a|
  cat = a['category']

  if cat.nil?
    # failed(cat, a)
    puts "missing category for #{a}"
    exit 1
  end

  if cat.class == String
    verify(cat, allowed_categories, a)
  elsif cat.class == Array
    cat.each { |c| verify(c, allowed_categories, a) }
  end
end

puts 'categories validated ✅'
