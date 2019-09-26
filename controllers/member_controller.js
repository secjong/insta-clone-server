import memberModel from "../models/member_model";

/**
 * 멤버 리스트 조회 Model 호출
 * @author 채세종
 * @method
 * @param
 * @returns {Array<Member>}
 */
module.exports.listMember = async () => {
    return await memberModel.listMember();
};

/**
 * 멤버 등록 Model 호출
 * @author 채세종
 * @method
 * @param {Member}
 * @returns {Boolean}
 */
module.exports.insertMember = async (member) => {
    const result = await memberModel.insertMember(member);
    if(result.affectedRows === 1){
        return true;
    }
    return false;
};

/**
 * 멤버 수정 Model 호출
 * @author 채세종
 * @method
 * @param {Member}
 * @returns {Boolean}
 */
module.exports.updateMember = async (member) => {
    const result = await memberModel.updateMember(member);
    if(result.affectedRows === 1){
        return true;
    }
    return false;
};

/**
 * 멤버 삭제 Model 호출
 * @author 채세종
 * @method
 * @param {String}
 * @returns {Boolean}
 */
module.exports.deleteMember = async (id) => {
    const result = await memberModel.deleteMember(id);
    if(result.affectedRows === 1){
        return true;
    }
    return false;
};