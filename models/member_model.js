import dbHelper from "../commons/db_helper";

/**
 * 멤버 리스트 DB조회
 * @author 채세종
 * @method
 * @param
 * @returns {Promise}
 */
module.exports.listMember = () => {
    return new Promise(function (resolve, reject) {
        dbHelper((conn) => {
            const sql = "SELECT * FROM member";
            conn.query(sql, false, (error, results) => {
                if (error) {
                    reject(Error(error));
                } else {
                    resolve(results);
                }
            });
            conn.close();
        });
    });
};

/**
 * 멤버 DB 등록
 * @author 채세종
 * @method
 * @param {Member}
 * @returns {Promise}
 */
module.exports.insertMember = ({id, name, age, gender, site, introduction, imagePath, regDate}) => {
    return new Promise(function (resolve, reject) {
        dbHelper((conn) => {
            const sql = "INSERT INTO member VALUES (?, ?, ?, ?, ?, ?, ?, now())";
            const data = [id, name, age, gender, site, introduction, imagePath];
            conn.query(sql, data, (error, results) => {
                if (error) {
                    reject(Error(error));
                } else {
                    resolve(results);
                }
            });
            conn.close();
        });
    });
};
