import * as m from "mithril";
import Stats from "./stats";
import Operators from "./operators";
import Ranks from "./ranks";
import Tabs from "components/misc/Tabs";
import NotFound from "../Errors/NotFound";
import NoPlaytime from "../Errors/NoPlaytime";
import NoAliases from "../Errors/NoAliases";
import IdCard from "./IdCard";
import "./profile.scss";

export default {
    view({ attrs, state }) {
        if (attrs.loading) {
            return (<div className="profile"></div>)
        } else if (!attrs.data || !attrs.data.id) {
            return <NotFound />;
        } else if (attrs.data.flags && attrs.data.flags.noPlaytime) {
            return <NoPlaytime {...attrs.data} />;
        } else if (attrs.data.flags && attrs.data.flags.noAliases) {
            return <NoAliases {...attrs.data} />;
        } else {
            const tabHeaders = {
                stats: { label: "Stats" },
                ops: { label: "Operators" },
                ranks: { label: "Ranks" }
            }
            return (
                <div className={`profile ${attrs.data.id}`}>
                    <IdCard {...attrs.data} />
                    <Tabs headers={tabHeaders}>
                        <Stats key="stats" {...attrs.data} />
                        <Operators key="ops" {...attrs.data} />
                        <Ranks key="ranks" {...attrs.data} />
                    </Tabs>
                </div>
            );
        }
    }
};
