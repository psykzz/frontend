const m = require("mithril");
const page = require("page");
const { getQuerystring } = require("lib/querystring");
const api = require("lib/api");
const store = require("lib/store");
const { title, State } = require("lib/constants");

const exitAnim = require("lib/exitAnim");
const log = require("lib/log").child(__filename);
const idRegex = /[\da-zA-Z]{8}-[\da-zA-Z]{4}-[\da-zA-Z]{4}-[\da-zA-Z]{4}-[\da-zA-Z]{12}/;
const Searchbar = require("../misc/Searchbar");


const showPlayer = id => e => page("/player/"+id);

module.exports = {
	stats: m.prop(null),			// db stats
	onbeforeremove: exitAnim,
	oncreate: ({dom}) => {
		dom.querySelector(".search-input input").focus();
	},
	oninit: ({ attrs, state }) => {
		log.trace("<Home /> oninit");
		api("getStats")
			.then(state.stats)
			.then(() => m.redraw());
	},
	onremove: ({ state }) => {
		log.trace("<Home /> onremove");
	},
	view: ({ attrs, state }) => (
		<div className="search">
			<h1 className="title is-1 search-title">R6DB</h1>
			<Searchbar search={attrs.store.select("search")} />
			<footer className="search-footer is-center">
				{
					state.stats()
					? (<span>
						{state.stats().usercount} users,
						{state.stats().namecount} names
					</span>)
					: null
				}
				<a href="mailto:info@gitgudscrub.com">info@gitgudscrub.com</a>
			</footer>
		</div>
	)
};