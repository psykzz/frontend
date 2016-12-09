import m from "mithril";
import page from "page";
import Home from "./Home";
import Search from "./Search";
import Detail from "./Detail";
import Loading from "./misc/Loading";


import debounce from "lodash/debounce";
import store from "lib/store";
import { State } from "lib/constants";
import setMeta from "lib/meta";

import Log from "lib/log";
const log = Log.child(__filename);
const idRegex = /[\da-zA-Z]{8}-[\da-zA-Z]{4}-[\da-zA-Z]{4}-[\da-zA-Z]{4}-[\da-zA-Z]{12}/;

const optional = (pred, cb) => pred ? cb() : null;

const init = ({state}) => {
    page("/", function (ctx) {
        if (ctx.pathname.slice(0, 10) === "/#/player/") {
            log.trace("got a legacy url");
            const id = ctx.pathname.slice(11).split(/[\/?#]/)[0];
            page.redirect("/player/" + id);
            return;
        }
        log.debug("router mount <Home />");
        store.merge({
            appstate: State.INITIAL,
            loading: false,
            search: {
                query: "",
                exact: false
            }
        });
        state.component = Home;
        setMeta(State.INITIAL);
        ga("set", "page", ctx.path);
        ga("send", "pageview");
    });
    page("/search/:query", function (ctx) {
        log.debug("router mount <Search />");
        const exact = ctx.querystring.indexOf("exact=true") !== -1 ? true : false;
        if (ctx.params.query && ctx.params.query.length > 2) {
            log.trace("search context", ctx);
            const isSameState = (store.get("appstate") !== State.RESULT
                || store.get(["search", "query"]) !== ctx.params.query
                || store.get(["search", "exact"]) !== exact);

            if (isSameState) {
                store.merge({
                    appstate: State.SEARCH,
                    loading: true,
                    search: {
                        query: ctx.params.query,
                        exact
                    }
                });
                state.component = Search;
            } else {
                log.trace("search is identical. skipping request");
            }
            setMeta(State.SEARCH, ctx.params.query);
            ga("set", "page", ctx.path);
            ga("send", "pageview");
            store.set("detail", null);
        } else {
            page.redirect("/");
        }
    });
    page("/player/:id", function (ctx) {
        log.debug("router mount <Detail />");
        store.merge({
            appstate: State.DETAIL,
            loading: true,
            detail: ctx.params.id
        });
        state.component = Detail;
        ga("set", "page", ctx.path);
        ga("send", "pageview");
    });
    page("*", function (ctx) {
        if (ctx.path.startsWith("//")) {
            log.trace("trying to redirect path", ctx);
            page.redirect(ctx.path.substr(1));
        } else {
            log.warn("route not found", ctx);
            page.redirect("/");
        }
    });
    page.start();


    /**
     * we listen to the hashchange manually,
     * because page doesn't trigger on querystring changed
     * and we need to have the correct appstate
     */
    const onHashChange = e => {
        log.trace("hash has changed. running page");
        page(window.location.hash);
    };
    // window.addEventListener("hashchange", onHashChange);
    store.on("update", debounce(function () {
        log.trace("state changed, redrawing");
        m.redraw();
    }, 200));
};


export default {
    component: Home,
    oninit: init,
    view({ state }) {
        return (
            <div className={`app ${store.get("appstate")}`}>
                <div className="app-background">
                    <img src="/assets/nippon.jpg" className="clear" />
                    <img src="/assets/nippon-blurred.jpg" className="blur" />
                </div>
                <div className="app-page">
                    <state.component store={store} />
                </div>
                {
                    store.get("loading")
                        ? <Loading />
                        : ""
                }
            </div>
        );
    } 
};
