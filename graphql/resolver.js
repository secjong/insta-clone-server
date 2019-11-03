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
        /* 로그인 */
        login: (_, params) => {
            return memberController.login(params);
        }
        
        
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

// 1. 스칼라 타입(Scalar Types)
// 스키마에 사용할 수 있는 기본 자료형은 다음과 같습니다.

// 1. Int : 32비트 정수
// 2. Float : 실수
// 3. String : UTF-8 문자열
// 4. Boolean : true / false
// 5. ID : id 값임을 명시적으로 표현하기 위해 사용. 내부적으로는 String 형태와 동일