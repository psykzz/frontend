import * as m from "mithril";
import Profilepic from "components/misc/Profilepic";
import "./playercard.scss";
import { isConsole, platformShorthand } from "lib/constants";

const round = (number, digits) => ((number * digits) | 0) / digits;

const getKd = player => player.stats.kills / player.stats.deaths;
const getWl = player => player.stats.matchesWon / player.stats.matchesLost;

const getAliases = player => {
    const shown = player.aliases.slice(0, 2).map(alias => <li>{alias.name}</li>);
    const rest = player.aliases.length > 2
        ? <li>and {player.aliases.length - 2} more</li>
        : null;
    return (
        <div className="player-aliases">
            <header>known aliases</header>
            <ul>
                {shown}
                {rest}
            </ul>
        </div>);
};
const getStats = player => (
    player.stats
        ? (<div className="player-stats">
            KD: {round(getKd(player), 2)}| WL: {round(getWl(player), 2)}
        </div>)
        : null
);
export default {
    view({attrs, state}) {
        return (
            <div className={`playercard player-${attrs.player.id} is-${attrs.player.role || "user"}`}>
                <a href={attrs.href} className="card-image">
                    <span className="player-level">lvl {attrs.player.level}</span>
                    <Profilepic id={attrs.player.userId || attrs.player.id} delay={attrs.index} />
                </a>
                <div className="card-content">
                    <div className="player-identification">
                        <a href={attrs.href} className="player-name">{attrs.player.name}</a>
                        <div className="player-flair">{attrs.player.flair}</div>
                        <div className="player-id">{attrs.player.id}</div>
                    </div>
                    {getAliases(attrs.player)}
                    <a className="player-link player-extended" href={attrs.extended}>extended (alpha)</a>
                    { isConsole && !attrs.player.userId
                        ? null
                        : <a href={`https://game-rainbow6.ubi.com/en-gb/${ platformShorthand }/player-statistics/${ attrs.player.userId || attrs.player.id }/multiplayer`} className="player-link">
                            › view on Ubisoft
                        </a>
                    }
                </div>
            </div>
        );
    }
};
