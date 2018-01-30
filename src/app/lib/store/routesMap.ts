import { redirect } from "redux-first-router";
import { LEADERBOARDS } from "lib/constants";
import * as api from "../api";
import * as analytics from "../analytics";
import setMeta from "lib/meta";
export default {
    HOME: {
        path: "/",
        thunk: (dispatch, getState) => {
            analytics.pageView("Home");
            setMeta({
                title: `Home`,
                description: `Find any player in Rainbow Six: Siege`,
                type: "website",
            });
        },
    },
    ABOUT: {
        path: "/about",
        thunk: (dispatch, getState) => {
            analytics.pageView("About");
            setMeta({
                title: `About`,
                description: `About R6DB`,
                type: "website",
            });
        },
    },
    MAINTENANCE: {
        path: "/rip",
    },
    SEARCH: {
        path: "/search/:platform/:query",
        thunk: async (dispatch, getState) => {
            const { location } = getState();
            const { query, platform } = location.payload;
            analytics.search(query);
            dispatch({ type: "PLATFORM", payload: platform });
            api
                .findPlayer(query, platform)
                .then(result => {
                    setMeta({
                        title: `Search ${platform} for ${query}`,
                        description: `Find ${query} in the community database for Rainbow Six: Siege`,
                    });
                    analytics.pageView("Search");
                    dispatch({
                        type: "SEARCH_FETCHED",
                        payload: { query, platform, result },
                    });
                })
                .catch(error => {
                    if (error.message === "MAINTENANCE") {
                        return dispatch(redirect({ type: "MAINTENANCE" }));
                    }
                    dispatch({
                        type: "SEARCH_FAILED",
                        payload: { query, error },
                    });
                });
        },
    },
    CHANKABOARD: {
        path: "/chankaboard/:platform",
        thunk: async (dispatch, getState) => {
            const { platform } = getState().location.payload;
            dispatch({ type: "PLATFORM", payload: platform });
            api
                .getLeaderboard("operatorpvp_tachanka_turretkill", platform)
                .then(entries => {
                    setMeta({
                        title: "LMG kills leaderboard",
                        description: "top 100 Tachanka players in our database",
                        type: "website",
                    });
                    analytics.pageView("Leaderboard");
                    dispatch({
                        type: "CHANKABOARD_FETCHED",
                        payload: { entries },
                    });
                })
                .catch(error => {
                    if (error.message === "MAINTENANCE") {
                        return dispatch(redirect({ type: "MAINTENANCE" }));
                    }
                    dispatch({ type: "CHANKABOARD_FAILED", payload: { entries: [], error } });
                });
        },
    },
    LEADERBOARD: {
        path: "/leaderboard/:platform/:board",
        thunk: async (dispatch, getState) => {
            const { board: b, platform } = getState().location.payload;
            const board = (b || "").toUpperCase();

            if (!board || board === "CHANKA") {
                return redirect(`/chankaboard/${platform}`);
            }
            const lbConfig = LEADERBOARDS[board];
            dispatch({ type: "PLATFORM", payload: platform });
            api
                .getLeaderboard(lbConfig.board, platform)
                .then(entries => {
                    setMeta({
                        title: `${lbConfig.label} leaderboard`,
                        description: `find the top 100 players (${lbConfig.label}) in our Database`,
                        type: "website",
                    });
                    analytics.pageView("Leaderboard");
                    dispatch({
                        type: "LEADERBOARD_FETCHED",
                        payload: { board, entries },
                    });
                })
                .catch(error => {
                    if (error.message === "MAINTENANCE") {
                        return dispatch(redirect({ type: "MAINTENANCE" }));
                    }
                    dispatch({
                        type: "LEADERBOARD_FAILED",
                        payload: { board, error },
                    });
                });
        },
    },
    FAQ: {
        path: "/faq",
        thunk: (dispatch, getState) => {
            setMeta({
                title: `FAQ`,
                description: ``,
                type: "website",
            });
            analytics.pageView("FAQ");
        },
    },
    SIMPLE: {
        path: "/simple/:id",
        thunk: playerThunk,
    },
    PLAYER: {
        path: "/player/:id",
        thunk: playerThunk,
    },
    PLAYERTABS: {
        path: "/player/:id/:tab",
        thunk: playerThunk,
    },
    COMPARISON: {
        path: "/compare",
        thunk: async (dispatch, getState) => {
            const players = getState().players;

            dispatch({ type: "loading", payload: "loading players" });
            const query = getState().location.query || {};

            const ids = [].concat(query.ids || []);

            let idList = ids.map(x => x.toLowerCase().trim()).filter(x => players[x] == undefined);
            api
                .getPlayers(idList)
                .then(x => {
                    dispatch({ type: "PLAYERS_FETCHED", payload: x.map(p => ({ id: p.id, player: p })) });
                    setMeta({
                        title: `Comparison`,
                        description: `compare stats for ${x.length} players`,
                    });
                    analytics.pageView("Comparison");
                })
                .catch(err => {
                    if (err.message === "MAINTENANCE") {
                        return dispatch(redirect({ type: "MAINTENANCE" }));
                    }
                    dispatch({
                        type: "PLAYERS_FAILED",
                    });
                    throw err;
                });
        },
    },
};

async function playerThunk(dispatch, getState) {
    const { platform } = getState();
    const { id, tab } = getState().location.payload;
    api
        .getPlayer(id, { platform })
        .then(function(player) {
            dispatch({ type: "PLAYER_FETCHED", payload: { id, player } });
            analytics.pageView("Player");
            if (player.flags.noAliases === false) {
                setMeta({
                    title: `${player.name}`,
                    type: "profile",
                });
            } else {
                setMeta({
                    title: `account ${id}`,
                    description: `${id} account details in the community database for Rainbow Six: Siege`,
                });
            }
        })
        .catch(error => {
            if (error.message === "MAINTENANCE") {
                return dispatch(redirect({ type: "MAINTENANCE" }));
            }
            dispatch({ type: "PLAYER_FAILED", payload: { id, error } });
        });
}
