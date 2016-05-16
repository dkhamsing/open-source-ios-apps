require 'json'

FILE = 'contents.json'

def get_json
  JSON.parse(File.read FILE)
end
