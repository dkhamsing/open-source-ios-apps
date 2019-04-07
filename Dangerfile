# Check links
def ab_results(file)
  require 'json'
  results = File.read file
  j = JSON.parse results
  if j['error']==true
    warn j['title']
    markdown j['message']
  end
end

ab_results 'ab-results-check-info.txt-markdown-table.json'
ab_results 'ab-results-check-links.txt-markdown-table.json'
ab_results 'ab-results-check-unique.txt-markdown-table.json'
