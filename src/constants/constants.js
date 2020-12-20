const LOCAL = {
    TITLE: 'where art meets music',
    LINK_FORM_PLACEHOLDER: 'Paste your Spotify playlist link',
    LINK_REGEX: /(https:\/\/open\.spotify\.com\/playlist\/|spotify:playlist:)([a-zA-Z0-9]+)(.*)/,
    LINK_INVALID: 'Link invalid'
}

const Constants = {
    LOCAL
}

Constants.install = function (Vue) {
    Vue.prototype.$LOCAL = key => Constants.LOCAL[key]
}

export default Constants