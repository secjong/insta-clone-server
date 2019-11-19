import query from "../commons/db_helper";

/**
 * 멤버 리스트 DB조회
 * @author 채세종
 * @method
 * @param
 * @returns {Array<Member>}
 */
module.exports.listMember = () => {
    const sql = "SELECT * FROM member";
    const data = [];
    return query({sql, data});
}

/**
 * 멤버 DB 등록
 * @author 채세종
 * @method
 * @param {Member}
 * @returns {Object}
 */
module.exports.insertMember = ({id, name, birth, gender, site, introduction, imagePath, regDate}) => {
    const sql = "INSERT INTO member VALUES (?, NULL, ?, ?, ?, ?, ?, ?, now(), NULL, NULL)";
    const data = [id, name, birth, gender, site, introduction, imagePath];
    return query({sql, data});
}

/**
 * 멤버 DB 비밀번호, 솔트 추가(비밀번호 해싱완료 후 작동)
 * @author 채세종
 * @method
 * @param {Member}
 * @returns {Object}
 */
module.exports.updateMemberPasswordSalt = ({id, password, salt, ranStr}) => {
    const sql = "UPDATE member SET password = ?, salt = ?, ranStr = ? WHERE id = ?";
    const data = [password, salt, ranStr, id];
    return query({sql, data});
}

/**
 * 멤버 DB 수정
 * @author 채세종
 * @method
 * @param {Member}
 * @returns {Object}
 */
module.exports.updateMember = ({id, password, name, birth, gender, site, introduction, imagePath}) => {
    const sql = "UPDATE member SET name = ?, birth = ?, gender = ?, site = ?, introduction = ?, imagePath = ? WHERE id = ? AND password = ?";
    const data = [name, birth, gender, site, introduction, imagePath, id, password];
    return query({sql, data});
}

/**
 * 멤버 DB 삭제
 * @author 채세종
 * @method
 * @param {String}
 * @returns {Object}
 */
module.exports.deleteMember = ({id, password}) => {
    const sql = "DELETE FROM member WHERE id = ? AND password = ?";
    const data = [id, password];
    return query({sql, data});
}

/**
 * 멤버 조회
 * id 기준 조회
 * @author 채세종
 * @method
 * @param {String}
 * @returns {Object}
 */
module.exports.selectMember = ({id}) => {
    const sql = "SELECT * from member WHERE id = ?";
    const data = [id];
    return query({sql, data});
}