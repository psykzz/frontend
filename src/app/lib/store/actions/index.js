import * as api from "lib/api";

export const init = (dispatch, getState) => {};

export const toPlayer = id => ({ type: "PLAYER", payload: { id } });
export const toPlayerTab = (id, tab) => ({ type: "PLAYERTABS", payload: { id, tab } });
export const toProfile = id => ({ type: "PROFILE", payload: { id } });

export const toChanka = platform => ({ type: "CHANKABOARD", payload: { platform } });

export const updatePlayer = id => dispatch => {
    dispatch({ type: "LOADING", payload: "updating player data" });
    api
        .getPlayer(id, { update: true })
        .then(function(player) {
            dispatch({ type: "PLAYER_FETCHED", payload: { id, player } });
            dispatch({ type: "loading", payload: false });
        })
        .catch(error => {
            console.error(error);
            dispatch({ type: "PLAYER_FAILED", payload: { id, error } });
            dispatch({ type: "loading", payload: false });
        });
};
