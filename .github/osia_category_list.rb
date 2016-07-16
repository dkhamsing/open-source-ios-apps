require_relative 'osia_helper'

j = get_json
c = j['categories']

osia_allowed_categories(c).each { |cat| puts cat }