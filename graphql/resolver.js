import { people, getById, add, remove, getMemberList } from "./db";
import memberController from "../controllers/member_controller";

// resolver 는 graphql 스키마에 정의되어 있는 query 나 mutation 만 정의할 수 있다.
// 스키마에 정의된 규칙과 동일하게 정의하지 않으면 실행되지 않는다.
// 실제로 함수를 실행시키는 부분이다.
const resolvers = {
    Query: {
        people: () => people,
        person: (_, {id}) => {
            // 첫번째 인자는 현재 Object를 가리키고
            // 두번째 인자는 파라미터를 가리킨다.
            console.log(_);
            console.log(id);
            return getById(id);
        },

        member: (_, params) => {
            return memberController.getMemberList();
        }
    },
    Mutation: {
        add: (_, { name, age, gender }) => {
            return add(name, age, gender);
        },
        remove: (_, { id }) => {
            return remove(id);
        }
    }
};

export default resolvers;