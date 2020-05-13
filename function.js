const axios = require('axios')


// Loop over URLS to fetch information from servers //
searchQueries = async (data) => {

    let results = []

    // Iterate over urls //
    for (let i = 0; i < data.length; i++) {

        try {
            // Make GET requests using Axios and push to results array //
            const res = await axios.get(data[i], { headers: { 'User-Agent': 'followandleadca@gmail.com' } });
            results.push(res.data);

        } catch (e) {
            // If unable to reach data source push notice //
            const err = {
                message: "Unable to reach" + data[i] 
            }

            results.push(err)

        } finally {
            continue;
        }
    }

    return results

}


// Function that validates URLs, Makes requests then restructures responses //

Queries = async (list) => {

        let response = []
        let validList = []

        // Loop over URLs and check for valid URL //
        list.map( e => {
            const valid = /^(ftp|http|https):\/\/[^ "]+$/.test(e);

            if(valid){
                validList.push(e)
            } else {
                // If invalid URL push message to response array //
                response.push({message: "invalid url"})
            }

        })


    // Fetch information from valid URLS //
    const queries = await searchQueries(validList)


    // Iterate through responses //
    queries.map(e => {

        // Create default entry object //
        let obj = {
            title: "",
            authors: []
        }

        // Determine which API the response is from based on response structure //
        Object.keys(e).map(l => {
            if ((l === "result") || (l === "message")) {

                // If the response is from Crossref iterate through keys looking for 'title' & 'author' //

                const payload = e[l]
                Object.keys(payload).map(z => {
                    if (z === "title") {

                        obj.title = payload[z].toString()

                    } else if (z === 'author') {

                        payload[z].map(e => {
                            // Update response key names to desired format and slice ORCID number from URL // 
                            const orcid = e.ORCID
                            const id = orcid.slice(17)
                            const author = {
                                first_name: e.given,
                                last_name: e.family,
                                orcid: id
                            }

                            obj.authors.push(author)
                        })
                    } else {
                        // NCBI uses an integer key for the data, check from the key that is a number //
                        var isnum = /^\d+$/.test(z);
                        if (isnum) {

                            const payloadData = payload[z]

                            // Iterate through data keys and find 'title' and 'author' //
                            Object.keys(payloadData).map(y => {
                                if (y === "title") {
                                    obj.title = payloadData[y].toString()
                                } else if (y === "authors") {
                                    let authorsListFormat = []

                                    // Split author format from  into "first_name" and "last_name" format //

                                    payloadData[y].map(e => {
                                        const author = {
                                            first_name: e.name.split(' ').pop(),
                                            last_name: e.name.split(' ').slice(0, -1).toString(),
                                            orcid: null
                                        }
                                        obj.authors.push(author)
                                    })
                                }
                            })
                        }
                    }
                })
            } else {
                // If invalid URL update entry obj title field //
                obj.title = "Unable to reach server"
            }
        })
        // Push formatted entry object to response array //
        response.push(obj)
    })
    console.log(response)
    return response
}

exports.Queries =  Queries