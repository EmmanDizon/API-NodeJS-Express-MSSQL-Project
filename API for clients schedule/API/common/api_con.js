const axios = require('axios')

const connect = async (url_action, options, params, retryFn) => {
    let url = url_action;

    if (options) {
        if (!options.headers.Accept)
            options.headers.Accept = 'application/json'

        if (!options.headers['Content-Type'])
            options.headers['Content-Type'] = 'application/json'
    }

    // process parameters
    const p = params ? params : {};

    if (options.method == 'GET')
        url += '?' + objectToQueryString(p);
    else
        options.data = JSON.stringify(p);

    let response = [];
    let isConnectionProblem = false;

    try {
        const requestTimeout = options.request_timeout || 60000;

        try {
            options.url = url;
            options.timeout = requestTimeout;

            await axios(options)
                .then(function (res) {
                    response = res.data
                });
        }
        catch (err) {
            if (err.message === 'Timeout' || err.message === 'Network request failed') {
                isConnectionProblem = true;
            }
            else {
                throw err
            }
        }
    }
    catch (err) {
        console.log(err);
        isConnectionProblem = true;
    }

    if (isConnectionProblem) return;

    return response;
}

const objectToQueryString = (obj) => {
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
}

module.exports = {
    connect
}