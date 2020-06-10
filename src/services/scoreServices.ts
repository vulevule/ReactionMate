import { ReactionTimeType } from "../model/Types";
import { User } from './../model/User';

const api = process.env.REACT_APP_API_URL

export interface SaveScoreData {
    type: ReactionTimeType;
    token?: string;
    date: Date;
    average: number;
    success: number;
    best: number;
}

export const saveScore = async (data: SaveScoreData) => {
    const { token, type, date, average, success, best } = data
    const loggedUser = await fetch(`${api}/saveScore`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
            type,
            date,
            average,
            best,
            success
        })
    }).then(async resp => {
        if (resp.ok) {
            const data = await resp.json();
            const { created, ...props } = data
            const user: User = {
                token,
                created: new Date(created),
                ...props,
            }
            return [user, resp.status]
        } else {
            const data = await resp.text();
            return [data, resp.status]
        }
    })

    return loggedUser
}
