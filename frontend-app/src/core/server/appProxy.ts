import Koa from 'koa';
import koaProxies from 'koa-proxies';

import { ObjectMap } from '@frontend-app/utils/types';

export const proxyFactory = (app: Koa, proxyMap: ObjectMap<string>) => {
    Object.keys(proxyMap).forEach(context => {
        const mappingUrl = proxyMap[context];

        if (!mappingUrl) {
            // eslint-disable-next-line no-console
            console.log(`Invalid mapping url : ${mappingUrl}`);
            return;
        }

        app.use(
            koaProxies(context, {
                target: mappingUrl,
                changeOrigin: true,
                logs: true,
            })
        );
    });
};
