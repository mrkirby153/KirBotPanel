import React, {useEffect, useState} from 'react';
import axios from 'axios';
import toastr from 'toastr';
import {Guild} from "./types";

const AdminSettings: React.FC = () => {

    const [server, setServer] = useState<string>('');
    const [key, setKey] = useState<string>('');
    const [value, setValue] = useState<string>('');

    const [guilds, setGuilds] = useState<Guild[]>([]);

    useEffect(() => {
        axios.get('/api/admin/guilds').then(resp => {
            setGuilds(resp.data);
        });
    }, []);

    const selectedServer = guilds.find(p => p.id == server);


    const onServerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setServer(e.target.value);
        setKey('');
        setValue('');
    };

    const onKeyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setKey(e.target.value);

        if(selectedServer) {
            let setting = selectedServer.settings.find(s => s.key == e.target.value);
            if(setting) {
                if (typeof setting.value == 'object') {
                    setValue(JSON.stringify(setting.value));
                } else {
                    setValue(setting.value);
                }
            } else {
                setValue('');
            }
        } else {
            setValue('');
        }
    };

    const saveSetting = () => {
        axios.patch('/api/admin/setting', {
            guild: server,
            key: key,
            value: value
        }).then(resp => {
            toastr.success('Setting saved');
            setGuilds(resp.data);
        })
    };

    const deleteSetting = () => {
        axios.patch('/api/admin/setting', {
            guild: server,
            key: key,
            value: null
        }).then(resp => {
            toastr.success('Setting deleted!');
            setGuilds(resp.data);
            setKey('');
            setValue('');
        })
    };

    const guildElements = guilds.map(guild => {
        return (
            <option key={guild.id} value={guild.id}>{guild.name}</option>
        )
    });

    const keyElements = selectedServer? selectedServer.settings.map(setting => {
        return (
            <option key={setting.id} value={setting.key}>{setting.key}</option>
        )
    }) : [];

    return (
        <div className="card">
            <div className="card-header">
                Admin
            </div>
            <div className="card-body">
                <div className="form-row">
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="server-text"><b>Server ID</b></label>
                            <input type="text" id="server-text" className="form-control" value={server}
                                   onChange={onServerChange}/>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="server-select"><b>Server</b></label>
                            <select id="server-select" className="form-control" value={server}
                                    onChange={onServerChange}>
                                <option value={''}>Select a server</option>
                                {guildElements}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="property"><b>Key</b></label>
                            <input type="text" className="form-control" placeholder="Key" value={key}
                                   onChange={onKeyChange} disabled={!server}/>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="property"><b>Setting</b></label>
                            <select id="property" className="form-control" value={key}
                                    onChange={onKeyChange} disabled={!server}>
                                <option value={''}>Select a property</option>
                                {keyElements}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-12">
                        <div className="form-group">
                            <label htmlFor="value"><b>Value</b></label>
                            <textarea className="form-control" onChange={e => setValue(e.target.value)} value={value}
                                      disabled={!key}/>
                        </div>
                    </div>
                </div>

                <div className="btn-group">
                    <input type="button" className="btn btn-success" value={'Save'} onClick={saveSetting}/>
                    <input type="button" className="btn btn-danger" value={'Delete'} onClick={deleteSetting}/>
                </div>
            </div>
        </div>
    )
};

export default AdminSettings;