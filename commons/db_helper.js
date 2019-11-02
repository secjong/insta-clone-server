//외장모듈
var mysql = require('mysql');

//사용자정의모듈
var config = require('./_config');
var logHelper = require('./log_helper');



//커넥션풀을 일단 만들고, 이벤트를 정의하고 시작하자
let pool = mysql.createPool(config.database);

pool.on('connection', function(connection){
    logHelper.info('[DB 접속됨 threadId = %d]', connection.threadId);
});
pool.on('acquire', function(connection){
    logHelper.info('[Connection 임대됨 threadId = %d]', connection.threadId);
});
pool.on('enqueue', function(connection){
    logHelper.debug('[DB 접속이 진행중이거나 Connection이 모두 임대된 상태]');
});
pool.on('release', function(connection){
    logHelper.info('[Connection 반납됨 threadId = %d]', connection.threadId);
});
process.on('exit', function() {
    // pool의 데이터베이스 접속 해제
    pool.end();
    logHelper.debug(" >> 모든 DATABASE 접속이 해제됨");
});


//생성자 함수 생성
var DBHelper = function(){
    this.dbcon = false; //db인스턴스 존재여부 //존재하지 않으면 false고 접속성공하면 db객체를 저장
};


//생성자의 프로토타입으로 필요한 멤버들을 정의
DBHelper.prototype = {
    
    //커넥션 풀을 임대하는 메서드
    open: function(callback){ // 인스턴스명.open(인자1개) 로 실행 => 실행결과로 connectionpool이 임대되고 callback함수가 실행된다.
        if(this.dbcon === false){ //db접속이 없을 때만 가능
            var that = this; //DBhelper의 인스턴스를 참조
            
            pool.getConnection(function(err, connection){ //커넥션풀 임대하기
                if(err){
                    logHelper.error("err : " , Error(err));
                    logHelper.error("connection : " , connection);
                    
                    if(typeof connection !== "undefined"){
                        //connection 객체가 있다면
                        logHelper.error("connection.release : " , connection.release);
                        connection.release();
                    }
                    logHelper.error("MySQL Connection Error - %s", err.message);
                    throw err;
                }
                
                that.dbcon = connection; //dbcon에 db객체 참조시킴!!!!!!!!!!!!!!!
                
                if(callback != undefined){
                    callback(); //콜백이 전달되었다면 실행한다.
                }
            });
        }   
    },

    //DB접속 끊는 메서드
    close: function(){ // 인스턴스명.close() 로 실행 => db접속 끊어진다.
        if(this.dbcon !== false){
            this.dbcon.release();
            this.dbcon = false; //db접속객체의 인스턴스 존재X상태
        }
    },
    
    //SQL문을 실행하는 메서드
    query: function(sql, data, callback){ // 인스턴스명.query(쿼리문, 데이터, 에러처리할 함수) 로 실행 => 
        //임대중인 커넥션풀이 없는 경우의 에러처리
        if(this.dbcon === false){
            logHelper.error('[empty pool] 연결된 커넥션풀이 없습니다.');
            if(callback != undefined){
                var error = { //에러출력할 내용. 원래 콜백함수 에러정보가 이런식으로 들어옴
                    threadId: 0,
                    errno: 0,
                    message: "연결된 커넥션풀이 없습니다.",
                    query: sql
                };
                callback(error, undefined); //에러출력
            }
            return false;
        } else {
            //임대중인 커넥션풀이 있는 경우
            var threadId = this.dbcon.threadId; //임대중인 커넥션풀의 고유번호
            
            //들어온 인자를 사용하여 쿼리 날리기
            var q = this.dbcon.query(sql, data, function(err, result){ //자기자신을 호출
                logHelper.sql("[threadId=%s] %s", threadId, q.sql);
                
                //에러처리
                if(err){
                    logHelper.error('[threadId=%s] Error%s: %s', threadId, err.errno, err.message);
                    
                    if(callback != undefined){
                        var error = {
                            threadId: threadId,
                            errno: err.errno,
                            message: err.message,
                            sql: q.sql
                        };
                        callback(error, undefined);
                    }
                    return false;
                }
                
                //처리결과가 있는 경우
                if(result){
                    //INSERT, UPDATE, DELETE 경우
                    if(typeof result.affectedRows !== 'undefined'){
                        logHelper.sql('affectedRows: %d', result.affectedRows);
                        if(typeof result.insertId !== "undefined"){ //INSERT 만
                            logHelper.sql('insertId: %d', result.insertId);
                        }
                    //SELECT 경우
                    } else {
                        // logHelper.sql('selected data: ', result); //조회결과
                    }
                    
                    if(callback != undefined){
                        callback(undefined, result);
                    }
                }
            });
        }
    }
};

// 기존소스
// module.exports = function(callback){
//     var db_helper = new DBHelper(); //DBHelper객체 만들고 
//     db_helper.open(function(){ //접속하여 커넥션풀 임대하고 바로 콜백함수 실행
//         callback(db_helper); //전달된 콜백함수를 실행하면서 인자로 자기자신. DBHelper 객체를 다시 주입하면 콜백 내에서 자기 자신객체를 컨트롤할 수 있음
//     }); 
// };

//require한 객체에 callback을 인자로 전달하면서 실행하면
//새로운 DB객체가 만들어진 후, 커넥션풀을 생성하면서
//자기 자신(db_helper)를 인자로 다시 callback를 실행

/**
 * 새로운 소스 - DB커넥션 Promise 모듈화. DB커넥션풀 임대 및 쿼리까지 날려줌
 * @author 채세종
 * @method
 * @param {Object} - {sql: 쿼리문자열, data: 데이터 배열}
 * @returns {Promise}
 */
module.exports = ({sql, data}) => {
    return new Promise((resolve, reject) => {
        var db_helper = new DBHelper(); //DBHelper객체 만들고 
        db_helper.open(() => { //접속하여 커넥션풀 임대하고 바로 콜백함수 실행
            db_helper.query(sql, data, (error, result) => {
                if (error) {
                    reject(Error(error));
                } else {
                    logHelper.trace(result);
                    resolve(result);
                }
            });
            db_helper.close();
            //open => query => close 를 콜백 내에서까지 한번에 진행
        }); 
    });
}