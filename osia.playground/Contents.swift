import Foundation

let fileURL = Bundle.main.url(forResource: "contents", withExtension: "json")
let data = try Data(contentsOf: fileURL!)
do {
    
    let j: NSDictionary = try JSONSerialization.jsonObject(with: data as Data, options: JSONSerialization.ReadingOptions.mutableContainers) as! NSDictionary
    
    print (j.allKeys)
    
} catch {
    
}

