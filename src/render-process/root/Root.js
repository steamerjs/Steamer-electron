if (process.env.NODE_ENV !== 'production') {
    window.console.dev = function(msg) {
        console.log(msg)
    }
    module.exports = require('./Root.hot')
}
else {
    window.console.dev = function(){}
    module.exports = require('./Root.prod')
}