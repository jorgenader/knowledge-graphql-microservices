import http, { IncomingMessage, Server, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';

import logger from '@frontend-core/server/logger';
import { SETTINGS } from '@frontend-app/settings';

const createServer = () => {
    const PORT: number = process.env.PORT as any;

    const app = require('./server').default;
    const currentHandler = app.callback();

    const server = http.createServer(currentHandler);

    server.listen(PORT, () => {
        if (process.env.NODE_ENV !== 'production') {
            logger.debug(`Application started on ${PORT}`);
            logger.debug(
                `==> Listening on port ${PORT}. Open up ${process.env.RAZZLE_SITE_URL} in your browser.`
            );
        }
    });
    server.close(error => {
        if (error) {
            logger.error(error);
        }
    });

    return { server, currentHandler };
};

if (process.env.NODE_ENV === 'production') {
    // tslint:disable-next-line:no-var-requires
    const throng = require('throng');

    throng({
        workers: SETTINGS.MAX_WORKERS,
        start: (id: number) => {
            logger.info(`Booting worker: ${id}`);
            createServer();
        },
    });
} else {
    let server: Server;
    let currentHandler: (
        req: IncomingMessage | Http2ServerRequest,
        res: ServerResponse | Http2ServerResponse
    ) => void;
    ({ server, currentHandler } = createServer());

    if (module.hot) {
        logger.info('✅ Server-side HMR Enabled!');

        module.hot.accept('./server', () => {
            logger.info('🔁  HMR Reloading `./server`...');

            try {
                const app = require('./server').default;
                const newHandler = app.callback();
                server.removeListener('request', currentHandler);
                server.on('request', newHandler);
                currentHandler = newHandler;
            } catch (error) {
                logger.error(error);
            }
        });
    }
}
