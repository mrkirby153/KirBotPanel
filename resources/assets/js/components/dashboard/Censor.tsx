import React from 'react';
import CensorRule from "./censor/CensorRule";

export default class Censor extends React.Component {

    private mock_data: any;

    constructor(props) {
        super(props);
        this.mock_data = [
            {
                _id: '1',
                level: '0',
                data: {
                    invites: {
                        enabled: false,
                        guild_whitelist: ["12345", "6789", "101112"],
                        guild_blacklist: ["12345678"]
                    },
                    domains: {
                        enabled: false,
                        whitelist: ["http://google.com"],
                        blacklist: ["http://example.com"]
                    },
                    blocked_tokens: ["one", "two"],
                    blocked_words: ["three", "four"],
                    zalgo: false
                }
            }
        ];
    }


    render() {
        let components = this.mock_data.map(data => {
            return <CensorRule level={data.level} key={data._id} data={data.data}/>
        });
        return (
            <div>
                {components}
            </div>
        );
    }
}