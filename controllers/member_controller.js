import memberModel from "../models/member_model";
import logHelper from "../commons/log_helper";
import utils from "../commons/utils";
import config from "../commons/_config";

// 외장모듈
import jwt from "jsonwebtoken";

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

/**
 * 로그인
 * @author 채세종
 * @method
 * @param
 * @returns {Boolean}
 */
module.exports.login = async (params) => {
    const member = await memberModel.selectMember(params);
    if(member.length === 0){
        return false;
    } else {
        // 멤버가 존재하는 경우 jwt 생성
        const payload = {
            id: member.id,
            name: member.name
        };
        const secretKey = config.secure.jwt_encrypt_key;
        const options = {
            expiresIn: '5m' // 유효 시간은 5분
        };
        const token = jwt.sign(payload, secretKey, options); // 4번째 인자로 콜백함수를 전달하지 않으면 동기처리됨.
        logHelper.debug(token);
    }
    return true;
};