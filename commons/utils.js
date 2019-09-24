var logHelper = require('./log_helper');

function utils() {
    //실제로 빈 값인지 검사하는 메서드
    //빈객체 or 빈문자열 or null or undefined 인 경우 빈 값임
    //false or 0 인 경우는 빈값이 아님
    function isEmpty(value) {
        if ((value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) && value != 0) {
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












    return {
        "isEmpty": isEmpty,
        "checkAndParseJson": checkAndParseJson,
        "checkType": checkType,
        "getTimeStamp": getTimeStamp
    };

}

module.exports = utils();