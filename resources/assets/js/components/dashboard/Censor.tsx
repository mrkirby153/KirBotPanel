import React from 'react';
import CensorRule from "./censor/CensorRule";
import {deepClone, makeId} from "../../utils";


interface CensorState {
    data: any
}

export default class Censor extends React.Component<{}, CensorState> {

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
        this.state = {
            data: this.explodeJson(this.mock_data)
        }
    }

    explodeJson = (data) => {
        data.forEach(e => {
            e._id = makeId(5)
        });
        return data;
    };

    onChange = (index, newData) => {
        let newState = deepClone(this.state.data);
        let newObj = {
            _id: this.state.data[index]._id,
            level: this.state.data[index].level,
            data: newData
        };
        newState.splice(index, 1, newObj);
        this.setState({
            data: newState
        })
    };


    render() {
        let components = this.state.data.map((data, index) => {
            return <CensorRule level={data.level} key={data._id} data={data.data}
                               onChange={data => this.onChange(index, data)}/>
        });
        return (
            <div>
                {components}
            </div>
        );
    }
}