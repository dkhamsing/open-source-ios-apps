require 'delete_my_tweets'

c = {
               "consumer_key" => "X7TNI7gi1Bo3l3hRwShZr6Q5l",
            "consumer_secret" => "clafmSRaf7AnnusNMaZEhMajEESfhw3XTGBfTwlfgBcjwRSHcn",
               "access_token" => ENV['TWITTER_ACCESS_TOKEN'],
        "access_token_secret" => ENV['TWITTER_ACCESS_TOKEN_SECRET'],
                     "filter" => {
            "exclude" => [
                "Add",
                "add"
            ]
        }
    }

DeleteMyTweets.twitter_delete(c) do |o|
  puts o
end
puts 'all done 🐤'
