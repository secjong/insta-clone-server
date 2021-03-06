//내장모듈
const path = require('path');

//외장모듈
const mkdirs = require('mkdirs');
require("dotenv").config(); // .env 파일에서 값을 가져오기 위한 모듈


const config = {
  //로그파일저장경로
  debug_log_path: path.join(__dirname, '../src/assets/files/_logs'),
  //에러로그파일저장경로
  error_log_path: path.join(__dirname, '../src/assets/files/_logs'),
  //데이터베이스 접속정보
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER, //root 는 관리자
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE, //만들어져있어야함
    connectionLimit: 20,
    // connectTimeout : 8000,
    canRetry: true, //기다린 후 재접속 여부,
    waitForConnections: true //커넥션풀이 풀방인 경우 기다릴지 여부
  },

  //웹서버 구성정보
  //포트
  server_port: process.env.SERVER_PORT,
  //루트경로 - 앵귤러 사용하기 때문에 정적 파일 사용 안함
  // document_root: path.join(__dirname, '../public'),
  //favicon경로 - 앵귤러 사용하기 때문에 정적 파일 사용 안함
  // favicon_path: path.join(__dirname, '../public/images/favicon.png'),
  //에러페이지경로
  error_page: {
    not_found: path.join(__dirname, '../404.html'),
    internal_server_error: path.join(__dirname, '../500.html')
  },
  //업로드경로
  upload: {
    uri: '/upload',
    dir: path.join(__dirname, '../src/assets/files/uploads'),
    max_size: 1024 * 1024 * 20,
    max_count: 10,
    logos: path.join(__dirname, '../../src/assets/logos'),
    thumbs: path.join(__dirname, '../src/assets/files/uploads/thumbs'),
    small: path.join(__dirname, '../src/assets/files/uploads/thumbs/small')
  },
  //다운로드경로
  download: {
    uri: '/download',
    dir: path.join(__dirname, '../src/assets/files/downloads'),
    max_size: 1024 * 1024 * 10,
    max_count: 10
  },
  //보안키(암호화키)
  secure: {
    cookie_encrypt_key: process.env.SECURE_COOKIE_ENC_KEY,
    session_encrypt_key: process.env.SECURE_SESSION_ENC_KEY,
    jwt_encrypt_key: process.env.SECURE_JWT_ENC_KEY,
    salt: process.env.SECURE_SALT, // 비밀번호 솔트
    iterations: parseInt(process.env.SECURE_ITERATIONS), // 비밀번호 해싱 반복횟수
    keylen: parseInt(process.env.SECURE_KEYLEN), // 해싱된 결과 길이
    digest: process.env.SECURE_DIGEST // 해싱알고리즘
  },
  //메일발송정보
  mail_server: {
    //service: 'Gmail',
    //직접 구축한 smtp서버를 쓰려면 위의 sevice 지우고 아래옵션으로
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, //대상서버가 아이디와 비밀번호를 요구하는지 여부(이메일서버 개발자에게 확인)
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASS
    }
  },
  //json web token 토큰발행 옵션객체
  json_web_token_option: {
    expiresIn: '2h',
    issuer: process.env.HOSTNAME,
    subject: 'userInfo'
  },

};

//저장경로에 있는 폴더가 없으면 에러나니까 미리 생성한다. 반복문의로 존재여부 확인하고 생성하는 절차를 mkdirs를 쓰면 이렇게 쉬움!
mkdirs(config.debug_log_path);
mkdirs(config.error_log_path);
mkdirs(config.upload.small);

//설정정보 내보내기
module.exports = config;