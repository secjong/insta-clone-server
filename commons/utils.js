const logHelper = require('./log_helper');
const config = require('./_config');
const memberModel = require('../models/member_model');

// 내장모듈
const crypto = require('crypto');

function utils() {
    
    //실제로 빈 값인지 검사하는 메서드
    //빈객체 or 빈문자열 or null or undefined 인 경우 빈 값임
    //false or 0 인 경우는 빈값이 아님
    function isEmpty(value) {
        if (
            value === "" 
            || value === null 
            || value === undefined 
            || ( value !== null && typeof value === "object" && !Object.keys(value).length)
        ) {
            return true;
        } else {
            return false;
        }
    };

    function checkType(input, type) {
        //인자가 부족할 경우 반환
        if(input === undefined || type === undefined){
            throw Error("checkType 인자가 부족합니다.");
        }

        var typeList = ["number", "string", "object", "function", "boolean", "undefined"];

        var typeFlag = false;
    
        //두번째 인자 검사
        for(v of typeList){
            if(v === type){
                typeFlag = true;
            }
        }

        //두번째 인자 유효하지 않은 경우
        if(!typeFlag){
            throw Error(type + " 은 정상적인 타입이 아닙니다.");
        }

        //실제 타입검사
        if(input !== null && typeof input === type){
            return true;
        } else {
            throw Error(input + " 의 타입이 " + type + " 이 아닙니다.");
        }

    };

















    //Object의 각 프로퍼티들이 Json String인 경우 JSON.parse 수행하는 메서드
    function checkAndParseJson(item) {
        for (v in item) {
            var checkJson = false;
            try {
                checkJson = JSON.parse(item[v]);
            } catch (e) {
                // console.log("프로퍼티는 JSON String 이 아닙니다.");
            }
            if (!!checkJson && typeof checkJson == "object") {
                item[v] = JSON.parse(item[v]);
            }
        }
        return item;
    };








    //현재시각을 yyyy-MM-dd HH:mm:ss 형태로 반환하는 메서드
    function getTimeStamp() {
        var d = new Date();
        var s =
            leadingZeros(d.getFullYear(), 4) + '-' +
            leadingZeros(d.getMonth() + 1, 2) + '-' +
            leadingZeros(d.getDate(), 2) + ' ' +

            leadingZeros(d.getHours(), 2) + ':' +
            leadingZeros(d.getMinutes(), 2) + ':' +
            leadingZeros(d.getSeconds(), 2);

        return s;
    }

    function leadingZeros(n, digits) {
        var zero = '';
        n = n.toString();

        if (n.length < digits) {
            for (i = 0; i < digits - n.length; i++)
                zero += '0';
        }
        return zero + n;
    }


    // 비밀번호 해싱
    function createHashedPassword(id, password){
        const ranStr = getRanStr(50); // 50자리 랜덤문자 생성
        crypto.pbkdf2(password, config.secure.salt+ranStr, config.secure.iterations, config.secure.keylen, config.secure.digest, (err, derivedKey) => {
            if (err) throw err;
            let hashedPassword = derivedKey.toString('hex');
            // 비동기로 해싱 완료 후 콜백 안에서 DB에 비밀번호, 솔트 추가
            const result = memberModel.updateMemberPasswordSalt({id: id, password: hashedPassword, salt: config.secure.salt, ranStr: ranStr});
            // if(result.affectedRows === 1){
            //     logHelper.info("updateMemberPasswordSalt success");
            // } else {
            //     logHelper.error("updateMemberPasswordSalt fail");
            // }
        });
    };



    // 난수 생성
    function getRanStr(size){
        //rand(1,3)
        function rand(p_start,p_end){
            let v_result = null;
            let v_size = p_end - p_start + 1;
        
            if(p_start < 0 || p_end < 0) return v_result;
            if(v_size < 2) return v_result;
        
            v_result = p_start + parseInt(Math.random() * v_size);
        
            return v_result;
        }
        
        let result = "";
        if(!size) size = 10; // 기본사이즈
        //0~9 : 48~57
        //a~z : 97~122
        //A~Z : 65~90
        for(let i=0;i<size;i++){
            let kind = rand(1,3);
            switch(kind){
                case 1:
                    result += String.fromCharCode(rand(48,57));
                    break;
                case 2:
                    result += String.fromCharCode(rand(65,90));
                    break;
                default:
                    result += String.fromCharCode(rand(97,122));
                    break;
            }
        }
        return result;
    }
       
       
       








    return {
        "isEmpty": isEmpty,
        "checkAndParseJson": checkAndParseJson,
        "checkType": checkType,
        "getTimeStamp": getTimeStamp,
        "createHashedPassword": createHashedPassword,
        "getRanStr": getRanStr
    };

}

module.exports = utils();