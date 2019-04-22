export const SpamSchema = {
    // "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Spam Schema",
    "type": "object",
    "properties": {
        "punishment": {
           "$ref": "#/definitions/punishment"
        },
        "punishment_duration": {
            "$ref": "#/definitions/punishment_duration"
        },
        "clean_count": {
            "$ref": "#/definitions/clean_count"
        },
        "clean_duration": {
            "$ref": "#/definitions/clean_duration"
        }
    },
    "patternProperties": {
        "^[0-9]+$": {
            "type": "object",
            "properties": {
                "punishment": {
                    "$ref": "#/definitions/punishment"
                },
                "punishment_duration": {
                    "$ref": "#/definitions/punishment_duration"
                },
                "clean_count": {
                    "$ref": "#/definitions/clean_count"
                },
                "clean_duration": {
                    "$ref": "#/definitions/clean_duration"
                },
                "max_links": {
                    "$ref": "#/definitions/rule"
                },
                "max_messages": {
                    "$ref": "#/definitions/rule"
                },
                "max_newlines": {
                    "$ref": "#/definitions/rule"
                },
                "max_mentions": {
                    "$ref": "#/definitions/rule"
                },
                "max_emoji": {
                    "$ref": "#/definitions/rule"
                },
                "max_uppercase": {
                    "$ref": "#/definitions/rule"
                },
                "max_attachments": {
                    "$ref": "#/definitions/rule"
                },
                "max_duplicates": {
                    "$ref": "#/definitions/rule"
                }
            },
            "additionalProperties": false
        }
    },
    "definitions": {
        "rule": {
            "type": "object",
            "properties": {
                "count": {
                    "type": [
                        "integer",
                        "string"
                    ],
                    "min": 0
                },
                "period": {
                    "type": [
                        "integer",
                        "string"
                    ],
                    "min": 0
                }
            },
            "additionalProperties": false,
            "required": [
                "count",
                "period"
            ]
        },
        "punishment": {
            "enum": [
                "NONE",
                "TEMPMUTE",
                "KICK",
                "BAN",
                "MUTE",
                "TEMPBAN"
            ]
        },
        "punishment_duration": {
            "type": [
                "integer",
                "string"
            ]
        },
        "clean_count": {
            "type": [
                "integer",
                "string"
            ]
        },
        "clean_duration": {
            "type": [
                "integer",
                "string"
            ]
        }
    },
    "additionalProperties": false
};

export const CensorSchema = {
    // "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Censor Schema",
    "type": "object",
    "patternProperties": {
        "^[0-9]+$": {
            "type": "object",
            "properties": {
                "zalgo": {
                    "type": "boolean"
                },
                "invites": {
                    "type": "object",
                    "properties": {
                        "enabled": {
                            "type": "boolean"
                        },
                        "whitelist": {
                            "type": "array"
                        },
                        "guild_whitelist": {
                            "type": "array"
                        },
                        "blacklist": {
                            "type": "array"
                        },
                        "guild_blacklist": {
                            "type": "array"
                        }
                    },
                    "additionalProperties": false
                },
                "domains": {
                    "type": "object",
                    "properties": {
                        "enabled": {
                            "type": "boolean"
                        },
                        "whitelist": {
                            "type": "array"
                        },
                        "blacklist": {
                            "type": "array"
                        }
                    },
                    "additionalProperties": false
                },
                "blocked_tokens": {
                    "type": "array"
                },
                "blocked_words": {
                    "type": "array"
                }
            },
            "additionalProperties": false
        }
    }
};

export default {}