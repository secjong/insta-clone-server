//외장모듈
var winston = require('winston');
var winstonDaily = require('winston-daily-rotate-file');
var momentTimezone = require('moment-timezone');

//사용자정의모듈
var config = require('./_config.js');

//날짜형식을 만들어주는 함수 생성
function timeStampFormat() {
  // var time = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
  var time = momentTimezone().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss.SSS');
  return time + ' [pid:' + process.pid + ']';
}

//커스텀레벨정의
var levelConfig = {
  levels: {
    fatal: 0,
    error: 1,
    info: 2,
    debug: 3,
    trace: 4,
    sql: 5,
  },
  colors: {
    fatal: 'red', //심각한에러
    error: 'yellow', //에러
    info: 'cyan', //정형화된 부분 표기
    debug: 'green', //특히 중요한 데이터 표기 
    trace: 'blue', //코드흐름 또는 데이터 표기
    sql: 'gray' //sql문
  }
};

//winston 객체만들기
var logger = new(winston.Logger)({
  levels: levelConfig.levels,
  colors: levelConfig.colors,

  //일반 로그
  transports: [
    new(winston.transports.Console)({ //콘솔규칙
      name: 'debug-console',
      colorize: true,
      level: 'sql',
      showLevel: true,
      json: false,
      prettyPrint: true,
      timestamp: timeStampFormat
    }),
    new(winstonDaily)({ //로그규칙. 하루에 하나씩 파일로 기록!
      name: 'debug-file',
      colorize: false, //true하면 색상정보가 이상한코드로...
      level: 'sql',
      showLevel: true,
      json: false,
      prettyPrint: true,
      timestamp: timeStampFormat,

      filename: config.debug_log_path + '/log/',
      //datePattern: '_YYYY-MM-DD.log', //파일명뒤에붙일형식
      maxsize: 52428800, //50mb
      maxFiles: 1000
    })
  ],

  //예외발생시 로그
  exceptionHandlers: [ //에러발생시 규칙정의(node는 에러시 다운됨)
    new(winston.transports.Console)({ //콘솔규칙
      name: 'error-console',
      colorize: true,
      level: 'sql',
      showLevel: true,
      json: false,
      prettyPrint: true,
      timestamp: timeStampFormat
    }),
    new(winstonDaily)({ //로그규칙. 하루에 하나씩 파일로 기록!
      name: 'error-file',
      colorize: false, //true하면 색상정보가 이상한코드로...
      level: 'sql',
      showLevel: true,
      json: false,
      prettyPrint: true,
      timestamp: timeStampFormat,

      filename: config.error_log_path + '/error/', //에러로그저장경로
      //datePattern: '_YYYY-MM-DD.log', //파일명뒤에붙일형식
      maxsize: 52428800,
      maxFiles: 1000
    })
  ]
});

//생성한 로그 객체를 모듈에 등록
//필요한 js파일에서 logger require해서 가져다 쓰면댐
//logger를 require 하기만 하면 해당 js파일에서 logger.debug(); 형태로 로그출력/기록가능
module.exports = logger;