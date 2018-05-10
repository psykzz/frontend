import * as React from "react";
import { hot } from "react-hot-loader";
import UserInput from "components/misc/UserInput";
import Searchbar from "components/misc/Searchbar";
import Icon, { GLYPHS } from "components/misc/Icon";
import Page, { PageHead, PageContent } from "components/misc/Page";
import Ad from "components/misc/Ad";
import "./account.scss";

import * as r6api from 'r6api';

import background from "assets/backgrounds/chimera1.jpg";

const URLS = {
    PC: 'https://uplayconnect.ubi.com/ubiservices/v2/profiles/sessions',
}

function Account(props) {
    return (
        <Page className="account">
            <PageHead image={background} position="75% 40%">
                <div className="container">
                    <h1 className="header">Account Management</h1>
                </div>
            </PageHead>
            <PageContent>
                <div className="container container--small">
                    <div>
                        <div className="blocker">All account details are kept locally to authorize requests.</div>
                        <form>
                            <UserInput type="text" name="username" 
                                value={localStorage.username}
                                placeholder="Username" label="Username" 
                                onChange={(newValue) => {
                                    localStorage.username = newValue;
                            }} />
                            <UserInput type="password" name="password" 
                                value={localStorage.password}
                                placeholder="Password" label="Password" 
                                onChange={(newValue) => {
                                    localStorage.password = newValue;
                            }} />

                            <button onClick={async () => {
                                const token = "Basic " + new Buffer(localStorage.username + ":" + localStorage.password, "utf8").toString("base64");
                                const headers = new Headers();
                                headers.set('Authorization', token);
                                headers.set('Origin', "r6db.com");

                                const res = await fetch(`https://cors-anywhere.herokuapp.com/${URLS.PC}`, {
                                    method: "POST",
                                    headers: headers,
                                    body: JSON.stringify({ rememberMe: true }),
                                    mode: 'no-cors',
                                });
                                console.log(res);
                            }}>Test Login</button>
                        </form>
                        
                    </div>
                </div>
            </PageContent>
        </Page>
    );
}

export default hot(module)(Account);
