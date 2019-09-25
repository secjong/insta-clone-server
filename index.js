import { GraphQLServer } from "graphql-yoga";
import resolvers from "./graphql/resolver";
import mkdirs from "mkdirs";

// 사용자정의모듈
import config from "./commons/_config";

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

server.start(options, (info) => {
    console.log(`Server started, listening on port ${info.port} for incoming requests.`);
}); 