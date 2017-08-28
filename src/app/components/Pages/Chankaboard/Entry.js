import * as m from "mithril";
import Profilepic from "components/misc/Profilepic";
import Link from "components/misc/Link";
import { isConsole, platformShorthand } from "lib/constants";

const showPlayer = id => `/profile/${id}/simple`;
const showExtended = id => `/profile/${id}`


export default {
    view({ attrs }) {
        return (
            <div className={`entry playercard player-${attrs.id} ${attrs.isTopEntry ? 'is-top' : ''}`}>
                <div className="entry-background"></div>
                <Link to={showPlayer(attrs.id)} className="playercard-image">
                    {
                        attrs.isTopEntry
                            ? <Profilepic id={attrs.userId || attrs.id} delay={0} />
                            : null
                    }
                    <div className="entry-position">
                        <span>{attrs.pos}</span>
                    </div>
                </Link>
                <div className="playercard-content">
                    <a href={showPlayer(attrs.id)} className="playercard-left">
                        <header className="playercard-name">{attrs.name}</header>
                    </a>
                    <div className="playercard-center">
                        <span className="entry-valuelabel">kills</span>
                        <span className="entry-value">
                            {Number.parseInt(attrs.value)}
                        </span>
                    </div>
                    <div className="playercard-right">
                        <Link className="playercard-link player-simple" to={showPlayer(attrs.id)}>
                            profile
                            </Link>
                        <Link className="playercard-link player-extended" to={showExtended(attrs.id)}>
                            extended (beta)
                            </Link>
                        { isConsole && !attrs.userId
                            ? null
                            : <a href={`https://game-rainbow6.ubi.com/en-gb/${ platformShorthand }/player-statistics/${ attrs.userId || attrs.id }/multiplayer`} className="playercard-link player-ubi">
                                Ubisoft
                            </a>
                        }
                    </div>
                </div>
            </div>
        );
    }
};
