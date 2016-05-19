require 'json'

FILE = 'contents.json'

def get_json
  JSON.parse(File.read FILE)
end

def osia_allowed_categories(c)
    c.sort_by { |h| h['title']}.map { |x| x['id']}
end