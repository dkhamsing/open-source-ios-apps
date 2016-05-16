require_relative 'osia_helper'

j = get_json
c = j['categories']

c.sort_by { |h| h['title']}
  .each { |x| puts x['id']}
