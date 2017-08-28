import * as m from "mithril";
import { redirect } from "redux-first-router";
import { Leaderboards } from "lib/constants";
import { connect } from "lib/store/connect";
import Entry from "./Entry";
import Link from "components/misc/Link";
import "./leaderboard.scss";

const isSelected = (expected, value) => expected === value ? "selected" : undefined;

const Leaderboard = {
    view({ attrs }) {
        return (
            <div className="leaderboard">
                <div className="leaderboard-header">
                    <h1 className="leaderboard-title">Top Skilled Players</h1>
                    <div className="leaderboard-description">
                        <p>
                            We use the ranked system's 'skill' and an 'uncertainty' variables to calculate a downward adjusted skill rating
                            (aka "you're at least this good" value). That way we can ensure that players with identical skill but more games will be ranked higher.
                            For more info on the current rank system, head over to the <a href="/faq">FAQ</a>.
                        </p>
                        <p className="is-highlight">
                            Any accounts proven to abuse the system will be removed from the leaderboard. This includes queueing with coppers or hackers, hacking themselves or playing exclusively imbalanced gamemodes (<a href="https://medium.com/@r6db/on-excluding-accounts-from-the-leaderboard-596cc217b2af">details and reasoning</a>). If you have questions, please contact us per <a href="mailto:info@r6db.com">email</a> or <a href="https://twitter.com/Rainbow6_DB">Twitter</a> for help.
                        </p>
                    <p>the Leaderboard updates every 24h.</p>
                    </div>
                    <p className="leaderboard-region">
                        <label
                            className="leaderboard-regionlabel" htmlFor="regionselect">
                            Board
                        </label>
                        <select
                            id="regionselect"
                            className="leaderboard-regionselect"
                            onchange={m.withAttr("value", attrs.changeBoard)}>
                            {
                                Object.keys(Leaderboards)
                                    .map(l => {
                                        const lb = Leaderboards[l];
                                        return (<option
                                            key={lb.id}
                                            selected={isSelected(lb.id, attrs.board)}
                                            value={lb.id}>
                                            {lb.label}</option>);
                                    })
                            }
                        </select>
                    </p>
                </div>
                <div className="leaderboard-entries">
                    {attrs.entries.map((x, i) =>
                        <Entry isTopEntry={i < 3} pos={i + 1} {...x} key={x.id} />)}
                </div>
                <Link to="/leaderboard/CHANKA">
                    <img src="https://r6db.com/assets/chanky.png" id="chanky" alt="chanky"/>
                </Link>
            </div>
        );
    }
};

const mapStateToProps = (getState) => {
    const { leaderboard, location: { payload: { board } } } = getState();
    return {
        board,
        entries: leaderboard[board] || []
    }
}
const mapDispatchToProps = (dispatch) => ({
    changeBoard: board => dispatch({ type: "LEADERBOARD", payload: { board } })
})

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboard);