import React, { ReactElement } from 'react';

export const upperCaseFirst = (str: string) =>
    `${str.charAt(0).toUpperCase()}${str.substr(1).toLowerCase()}`;

export const nl2br = (text: string) => {
    const res: Array<string | ReactElement> = [];
    text.split('\n').forEach((x, i) => {
        if (i !== 0) {
            res.push(<br key={`br-${i}`} />);
        }

        res.push(x);
    });

    return res;
};
