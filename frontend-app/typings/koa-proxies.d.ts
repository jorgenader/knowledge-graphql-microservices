declare module 'koa-proxies' {
    import { Middleware } from 'koa';
    const proxy: (
        url: string,
        opts: { target?: string; changeOrigin?: boolean; logs?: boolean }
    ) => Middleware;
    export default proxy;
}
