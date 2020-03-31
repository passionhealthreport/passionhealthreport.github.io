// Global variables
var names = []
var emails = []
var matchData = []
var matchIndexes = []

// The Passion Health Test
var nColumns = 18

// Get information in JSON from google sheets URL
$(function(){
  sheetUrl = 'https://spreadsheets.google.com/feeds/cells/1IUmIxekkrg5uE-XXHNZpKUfSue9ntsEoDw9-imypgxU/od6/public/values?alt=json'
  $.getJSON(sheetUrl, function(data){
    var entry = data.feed.entry;
    names = []
    emails = []

    for (var i = nColumns; i < entry.length; i += nColumns){
      // entry[i].content.$t retrieves the content of each cell
      // Name is in the first column, email is second column
      names.push(entry[i].content.$t);
      emails.push(entry[i+1].content.$t);
    }
  })
});

// Add index of rows within a column that include the query to matchIndexes
function getColumnMatches(column, query) {
  for (i = 0; i < column.length; i++){
    if (column[i].toLowerCase().includes(query)){
      matchIndexes.push(i+1)
    }
  }
}

// NOTE Replaced search bar with unique hashed links
// // Get matches across all rows and redirect user to the first match
// function getMatches(query) {
//   query = query.toLowerCase()

//   matchIndexes = []

//   getColumnMatches(names, query)
//   getColumnMatches(emails, query)

//   // Remove duplicate indicies
//   matchIndexes = [...new Set(matchIndexes)]

//   // Remove index 0 (column names), from matchIndexes
//   var index = matchIndexes.indexOf(0);
//   if (index > -1) {
//     matchIndexes.splice(index, 1);
//   }

//   window.location = './dashboard.html?matchId='+matchIndexes[0];
// }
