export default (state = false, action) => {
    switch (action.type) {
        case "MENU_TOGGLE":
            return !state;
        case "MENU_OPEN":
            return true;
        case "HOME":
        case "LEADERBOARD":
        case "SEARCH":
        case "PROFILE":
        case "ACCOUNT":
        case "PLAYER":
        case "FAQ":
        case "COMPARISON":
        case "FAVORITES":
        case "MENU_CLOSE":
            return false;
        default:
            return state;
    }
};
