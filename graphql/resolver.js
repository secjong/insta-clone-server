import memberController from "../controllers/member_controller";

// resolver 는 graphql 스키마에 정의되어 있는 query 나 mutation 만 정의할 수 있다.
// 스키마에 정의된 규칙과 동일하게 정의하지 않으면 실행되지 않는다.
// 실제로 함수를 실행시키는 부분이다.
const resolvers = {
    Query: {
        /* 멤버 리스트 조회 */
        listMember: (_, params) => {
            return memberController.listMember();
        },

        
        
    },
    Mutation: {
        /* 멤버 등록 */
        insertMember: (_, member) => {
            return memberController.insertMember(member);
        },
        /* 멤버 수정 */
        updateMember: (_, member) => {
            return memberController.updateMember(member);
        },
        /* 멤버 삭제 */
        deleteMember: (_, {id}) => {
            return memberController.deleteMember(id);
        }
    }
};

export default resolvers;