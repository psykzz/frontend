const { title, State } = require("./constants");


const home = {
    title: () => title,
    description: () => "R6DB is a fan-powered database for Rainbow Six: Siege PC"
};

const search = {
    title: name => `Search results for  ${name} | R6DB`,
    description: name => `Search players named ${name} on R6DB`
};

const detail = {
    title: name => `${name} | R6DB`,
    description: name => `Show player details and stats for ${name}`
};

const valueMap = {
    [State.INITIAL]: home,
    [State.SEARCH]: search,
    [State.RESULT]: search,
    [State.DETAIL]: detail
};


export default function (state, name) {
    const mapping = valueMap[state];
    if (mapping) {
        document.title = mapping.title(name);
        const meta = document.getElementById("meta_desc");
        if (meta) {
            meta.content = mapping.description(name);
        }
    }
};