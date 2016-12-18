const search = require('../util/search');
const join = require('bluebird').join;
const Promise = require('bluebird');

function searchAll(req, res, next) {
    const keyword = req.query.keyword;
    if (!keyword) {
        return next();
    }
    let liveJson = [];
    Promise.map(Object.keys(search), prop => search[prop](keyword).reflect())
        .each(inspection => {
            liveJson = inspection.isFulfilled() ? liveJson.concat(inspection.value()) : liveJson;
        })
        .then(() => liveJson.sort((o1, o2) => {
            if (o1.onlineFlag !== o2.onlineFlag) {
                return o2.onlineFlag ? 1 : -1;
            }
            return o2.audienceNumber - o1.audienceNumber;
        }))
        .then(console.log);
}

searchAll({
    query: {
        keyword: 1
    }
})