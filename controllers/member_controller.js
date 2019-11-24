import memberModel from "../models/member_model";
import logHelper from "../commons/log_helper";
import utils from "../commons/utils";
import config from "../commons/_config";

// 내장모듈
import crypto from "crypto";

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
    const selectedMember = await memberModel.selectMember(member);
    if(selectedMember.length !== 0){
        // 아이디 중복인 경우
        return false;
    }
    const result = await memberModel.insertMember(member);
    if(result.affectedRows === 1){
        // 등록 성공시 비밀번호 해싱하여 추가
        // 이 과정은 성능상 비동기로 처리해야 하기 때문에 update 결과는 반환하지 않음
        utils.createHashedPassword(member.id, member.password);
        return true;
    }
    throw Error("회원가입 실패");
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
module.exports.deleteMember = async (member) => {
    const result = await memberModel.deleteMember(member);
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
 * @returns {String}
 */
module.exports.login = async (params) => {
    const inputPassword = params.password;

    // 1. 아이디를 조건으로 조회한다.
    // 2. salt, ranStr 을 붙이고 해시를 돌려서 password와 일치하는지 비교한다.
    // 3. 일치하면 토큰 발행, 불일치하면 로그인 거부처리한다.

    // 1.
    let member = await memberModel.selectMember(params);
    if(member.length === 0){
        // 해당 아이디의 회원이 없는 경우
        return "";
    }
    member = member[0];

    // 2.
    let derivedKey = crypto.pbkdf2Sync(inputPassword, member.salt+member.ranStr, config.secure.iterations, config.secure.keylen, config.secure.digest);
    let hashedPassword = derivedKey.toString('hex');

    // 3.
    let result = "";
    if(hashedPassword === member.password){
        // jwt 생성
        const payload = {
            id: member.id,
            name: member.name,
            site: member.site,
            introduction: member.introduction,
            imagePath: member.imagePath
        };
        const secretKey = config.secure.jwt_encrypt_key;
        const options = config.json_web_token_option;
        const token = jwt.sign(payload, secretKey, options); // 4번째 인자로 콜백함수를 전달하지 않으면 동기처리됨.
        logHelper.debug("token : " + token);
        result = token;
    }
    return result;
    

    /*
    crypto.pbkdf2(inputPassword, member.salt+member.ranStr, config.secure.iterations, config.secure.keylen, config.secure.digest, (err, derivedKey) => {
        if (err) throw err;
        let hashedPassword = derivedKey.toString('hex');

        // 3.
        let result = "";
        if(hashedPassword === member.password){
            // jwt 생성
            const payload = {
                id: member.id,
                name: member.name,
                site: member.site,
                introduction: member.introduction,
                imagePath: member.imagePath
            };
            const secretKey = config.secure.jwt_encrypt_key;
            const options = config.json_web_token_option;
            const token = jwt.sign(payload, secretKey, options); // 4번째 인자로 콜백함수를 전달하지 않으면 동기처리됨.
            logHelper.debug("token : " + token);
            result = token;
        }
        return result;
    });
    */

};