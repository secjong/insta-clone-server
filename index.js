import { GraphQLServer } from "graphql-yoga";
import resolvers from "./graphql/resolver";
import jwt from "jsonwebtoken";

// 사용자정의모듈
import config from "./commons/_config";
import logHelper from "./commons/log_helper";
import utils from "./commons/utils";

// graphql 서버는 resolver 에 정의된 query 나 mutation 을 실행시킨다.
const server = new GraphQLServer({
    typeDefs: "graphql/schema.graphql",
    resolvers
});

const options = {
    port: config.server_port,
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/playground',
}





/**
 * 로그인 체크 함수
 */
const loginMiddleware = (req, res, next) => {
    logHelper.debug(req.cookies);

    let token = req.cookies.user;
    let decoded = jwt.verify(token, config.secure.jwt_encrypt_key);
    if(decoded){
        logHelper.debug("권한 있음!");
    } else {
        logHelper.debug("권한 없음...");
    }
    logHelper.debug(decoded);
    next();
}

/**
 * request 출력 함수
 */
const loggingMiddleware = (req, res, next) => {
    if(req.headers.referer === req.headers.origin + "/playground"){
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
    }
    next();
}




server.use(loggingMiddleware);
//server.use(loginMiddleware);
server.start(options, (info) => {
    console.log(`Server started, listening on port ${info.port} for incoming requests.`);
});