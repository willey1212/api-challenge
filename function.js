const axios = require('axios')

searchQueries = async (data) => {

    let results = []

    for (let i = 0; i < data.length; i++) {

        try {

            const res = await axios.get(data[i], { headers: { 'User-Agent': 'followandleadca@gmail.com' } });
            results.push(res.data);

        } catch (e) {

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

Queries = async (list) => {

        let response = []
        let validList = []

        list.map( e => {
            const valid = /^(ftp|http|https):\/\/[^ "]+$/.test(e);

            if(valid){
                validList.push(e)
            } else {
                response.push({message: "invalid url " + e})
            }

        })



    const queries = await searchQueries(validList)



    queries.map(e => {

        let obj = {
            title: "",
            authors: []
        }

        Object.keys(e).map(l => {
            if ((l === "result") || (l === "message")) {

                const payload = e[l]

                Object.keys(payload).map(z => {
                    if (z === "title") {

                        obj.title = payload[z].toString()

                    } else if (z === 'author') {

                        payload[z].map(e => {
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
                        var isnum = /^\d+$/.test(z);
                        if (isnum) {

                            const payloadData = payload[z]

                            Object.keys(payloadData).map(y => {
                                if (y === "title") {
                                    obj.title = payloadData[y].toString()
                                } else if (y === "authors") {
                                    let authorsListFormat = []
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
                obj.title = "Unable to reach server"
            }
        })
        response.push(obj)
    })
    console.log(response)
}

exports.Queries =  Queries