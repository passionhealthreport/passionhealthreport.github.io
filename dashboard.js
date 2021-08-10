function getMatchID(entry, nColumns, uid) {
    let matchId = -1;
    for (i = nColumns + 1; i < entry.length; i += nColumns) {
        if (getHash(entry[i].content.$t) == uid) {
            matchId = (i - 1) / nColumns;
        }
    }

    return matchId;
}

function getQuestions(entry, nAreas) {
    questions = []
    for(i = 0; i < nAreas; i++) {
        questions.push(entry[i+2].content.$t)
    }

    return questions
}

function createClient(entry, calculated, nColumns, nNonScoreColumns, uid) {
    // Get matchId from uid
    matchId = getMatchID(entry, nColumns, uid);

    if (matchId == -1) {
        alert("invalid UID")
        return
    }

    let sum = 0
    let nScoreColumns = nColumns - nNonScoreColumns
    for (let i = 0; i < nScoreColumns; i++) {
        sum += parseInt(entry[nColumns*matchId+i+2].content.$t)
    }
    // Normalize score to 0 to 10
    let _score = Math.round(sum / nScoreColumns * 10) / 10

    // Stores scores and other information about user
    client = {
        name: entry[nColumns*matchId].content.$t,
        email: entry[nColumns*matchId+1].content.$t,
        score: _score,
        q1: entry[nColumns*matchId+2].content.$t,
        q2: entry[nColumns*matchId+3].content.$t,
        q3: entry[nColumns*matchId+4].content.$t,
        q4: entry[nColumns*matchId+5].content.$t,
        q5: entry[nColumns*matchId+6].content.$t,
        q6: entry[nColumns*matchId+7].content.$t,
        q7: entry[nColumns*matchId+8].content.$t,
        q8: entry[nColumns*matchId+9].content.$t,
        q9: entry[nColumns*matchId+10].content.$t,
        q10: entry[nColumns*matchId+11].content.$t,
        q11: entry[nColumns*matchId+12].content.$t,
        q12: entry[nColumns*matchId+13].content.$t,
        q13: entry[nColumns*matchId+14].content.$t,
        q14: entry[nColumns*matchId+15].content.$t,
        q15: entry[nColumns*matchId+16].content.$t,
        q16: calculated[4*matchId+2].content.$t, // Subjective overall score
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
    response = {}
    levels = ["low", "med", "high", "max"]
    for (i = 1; i <= nAreas; i++){
        q = 'q' + i.toString()
        response[q] = {}
        response[q]["explanation"] = db[i*nColumns+1].content.$t
        for (j = 0; j < levels.length; j++){
            response[q][levels[j]] = {}
            response[q][levels[j]]['main'] = db[i*nColumns+j+2].content.$t

            // "Max" does not have sell text
            if (j == levels.length - 1) {
                response[q][levels[j]]['bonus'] = ""
            } else {
                response[q][levels[j]]['bonus'] = db[(i+1)*nColumns-1].content.$t
            }
        }
    }

    response['score'] = {}
    for (let i = 0; i < levels.length; i++){
        response['score'][levels[i]] = db[(1+nAreas)*nColumns+i+1].content.$t
    }
    console.log(response)

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

        t0 = text.split("5 ")
        t1 = t0[1].split("\n")
        text = t0[0] + "</li><li>" + t1.shift() + "</ol>"

        t1 = t1.join("<br/>")
        t1 = t1.replace("<br/>", "")
        t1 = t1.replace("<br/>", "")
        t1 = t1.split("- ").join("</li><li>")
        t2 = t1.split(":")
        t3 = t2.shift() + ":<ul><li>" + t2.join(":")
        t3 = t3.replace("<br/><br/>", "</ul>")

        text = text + t3
    } catch {
        return text
    }

    return text
}

function addSellLink(text) {
    sellText = "comprehensive self-assessment called the Compass4System"
    return text.replace(sellText,
                        "<a href='http://thepassioncentre.com/'>"+sellText+"</a>")
}

function getScoreCategory(score) {
    if (score < 4){
        return "low"
    } else if (score < 8) {
        return "med"
    } else if (score <= 9.5) {
        return "high"
    } else if (score == 10) {
        return "max"
    }
}

function getPassionHealthCategories(data) {
    categories = []
    for (i=0; i<entryPassionHealthCategory.length; i++){
        categories.push(data[i].content.$t)
    }

    return categories
}

function getClientScores(client, nAreas) {
    scores = []
    for (i=1; i<=nAreas; i++){
        scores.push(client['q'+i.toString()])
    }

    return scores
}
