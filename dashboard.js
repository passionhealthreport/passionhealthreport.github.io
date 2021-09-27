function getMatchID(entry, nColumns, uid) {
    let matchId = -1
    for (const [idx, row] of entry.entries()) {
      if (getHash(row[1]) == uid) matchId = idx
    }
    return matchId;
}

function createClient(entry, calculated, nColumns, nNonScoreColumns, uid) {
    // Get matchId from uid
    const matchId = getMatchID(entry, nColumns, uid);

    if (matchId == -1) {
        alert("invalid UID")
        return
    }

    let sum = 0
    let nScoreColumns = nColumns - nNonScoreColumns
    for (let i = 2; i < nScoreColumns+2; i++) {
        sum += parseInt(entry[matchId][i])
    }

    // Normalize score to 0 to 10
    const score = Math.round(sum / nScoreColumns * 10) / 10

    // Stores scores and other information about user
    const [
      name, email,
      q1, q2, q3, q4, q5,
      q6, q7, q8, q9, q10,
      q11, q12, q13, q14,
      q15, _, perceived_score
    ] = entry[matchId]
    client = {
        name, email, score,
        q1, q2, q3, q4, q5,
        q6, q7, q8, q9, q10,
        q11, q12, q13, q14, q15,
        q16: perceived_score,
        avg_score: calculated[matchId][2],
    }

    return client;
}

function getHash(t) {
    let text = t.toString()
    let hash = 0;
    if (text.length == 0) {
        return hash;
    }
    for (let i = 0; i < text.length; i++) {
        var char = text.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

function formatPassionResponseDB(db, nColumns, nAreas) {
    let response = {}
    const levels = ["low", "med", "high", "max"]
    for (let i = 1; i <= nAreas; i++){
        const q = 'q' + i.toString()
        response[q] = {}
        response[q]["explanation"] = db[i][1]
        for (let j = 0; j < levels.length; j++){
            response[q][levels[j]] = {}
            response[q][levels[j]]['main'] = db[i][j+2]

            // "Max" does not have sell text
            if (j == levels.length - 1) {
                response[q][levels[j]]['bonus'] = ""
            } else {
                response[q][levels[j]]['bonus'] = db[i][nColumns-1]
            }
        }
    }

    response['score'] = {}
    for (let i = 0; i < levels.length; i++){
        response['score'][levels[i]] = db[(1+nAreas)*nColumns+i+1]
    }

    return response
}

function formatExplanation(text) {
    return text.replace("\n", "<br/> <br/>")
}

function formatBonusText(text) {
    try {
        text = text.replace("1 ", "<ol><li>")
        text = text.replace("2 ", "</li><li>")
        text = text.replace("3 ", "</li><li>")
        text = text.replace("4 ", "</li><li>")

        let t0 = text.split("5 ")
        let t1 = t0[1].split("\n")
        text = t0[0] + "</li><li>" + t1.shift() + "</ol>"

        t1 = t1.join("<br/>")
        t1 = t1.replace("<br/>", "")
        t1 = t1.replace("<br/>", "")
        t1 = t1.split("- ").join("</li><li>")
        let t2 = t1.split(":")
        let t3 = t2.shift() + ":<ul><li>" + t2.join(":")
        t3 = t3.replace("<br/><br/>", "</ul>")

        text = text + t3
    } catch {
        return text
    }

    return text
}

// function addSellLink(text) {
//     const sellText = "comprehensive self-assessment called the Compass4System"
//     return text.replace(sellText,
//                         "<a href='http://thepassioncentre.com/'>"+sellText+"</a>")
// }

function getScoreCategory(score) {
    if (score < 3){
        return "low"
    } else if (score < 6) {
        return "med"
    } else if (score < 10) {
        return "high"
    } else if (score == 10) {
        return "max"
    }
}

function getClientScores(client, nAreas) {
    let scores = []
    for (let i=1; i<=nAreas; i++){
        scores.push(parseFloat(client['q'+i.toString()]))
    }

    return scores
}
