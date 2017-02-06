require_relative 'osia_helper'

j = get_json
c = j['categories']
apps = j['projects']

def failed(cat, app)
  puts "‼️  #{cat} is not a valid category for #{app}"
  exit 1
end

def verify(cat, allowed, app)
  failed(cat, app) unless allowed.include? cat
end

allowed_categories = osia_allowed_categories(c)

apps.each do |a|
  cat = a['category-ids']

  if cat.nil?
    puts "missing category for #{a}"
    exit 1
  end

  if cat.class == String
    verify(cat, allowed_categories, a)
  elsif cat.class == Array
    cat.each { |d| verify(d, allowed_categories, a) }
  end
end

puts 'categories validated ✅'
