import { GraphQLServer } from "graphql-yoga";
import resolvers from "./graphql/resolver";
import url from "url";
import useragent from "express-useragent";

// 사용자정의모듈
import config from "./commons/_config";
import logHelper from "./commons/log_helper";
import router from "./routes";

// graphql 서버는 resolver 에 정의된 query 나 mutation 을 실행시킨다.
const server = new GraphQLServer({
    typeDefs: "graphql/schema.graphql",
    resolvers
});

server.use(useragent.express());

const options = {
    port: config.server_port,
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/playground',
}





/**
 * request 출력 함수
 */
const loggingMiddleware = (req, res, next) => {
    if(req.headers.referer === req.headers.origin + "/playground" || req.path === "/playground"){
        // playground 인 경우 제외
    } else {
        logHelper.info("======================= loggingMiddleware Start ========================");
        logHelper.info("ip : ");
        logHelper.info(req.ip);
        logHelper.info("path : ");
        logHelper.info(req.path);
        logHelper.info("hostname : ");
        logHelper.info(req.hostname);
        logHelper.info("xhr : ");
        logHelper.info(req.xhr);
        logHelper.info("protocol : ");
        logHelper.info(req.protocol);
        logHelper.info("url : ");
        logHelper.info(req.url);
        logHelper.info("params : ");
        logHelper.info(req.params);
        logHelper.info("query : ");
        logHelper.info(req.query);
        logHelper.info("body : ");
        logHelper.info(req.body);
        logHelper.info("======================= loggingMiddleware End ========================");
        
        logHelper.info("프로세스 환경 : ", process.env.NODE_ENV);

        let begin = Date.now();

        logHelper.info("------------ client connection ------------");
        logHelper.info("[Process Id] " + process.pid);

        let current_url = url.format({
            protocol: req.protocol,
            host: req.get('host'),
            port: req.port,
            pathname: req.originalUrl
        });

        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        logHelper.info('[ip] %s', ip);

        logHelper.info('[CLIENT INFO] %s / %s (%s) / %s', req.useragent.os, req.useragent.browser, req.useragent.version, req.useragent.platform);
        logHelper.info("[HTTP %s] %s", req.method, current_url);

        // 응답이 종료된 경우의 이벤트
        res.on('finish', () => {
            logHelper.info("---------- client disconnection end ------------");
            let end = Date.now(); // 접속 종료시간
            let time = end - begin;
            logHelper.info('runtime=%dms', time);
            logHelper.info(); // 빈 줄 표시
        });

    }
    next();
}



server.use("/", loggingMiddleware);
server.use("/", router);
server.start(options, (info) => {
    console.log(`Server started, listening on port ${info.port} for incoming requests.`);
});