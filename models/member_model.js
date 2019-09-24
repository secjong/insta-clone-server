const dbHelper = require("../commons/db_helper");

//포스트 리스트 조회
module.exports.SELECTMemberList = function(){
    var deferred = new Promise(function (resolve, reject) {
        dbHelper(function (conn) {
            var sql = "SELECT * FROM member";
            conn.query(sql, false, function (error, results) {
                if (error) {
                    reject(Error(error));
                } else {
                    resolve(results);
                }
            });
            conn.close();
        });
    });
    return deferred;
};
