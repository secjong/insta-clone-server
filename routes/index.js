import express from "express";
import jwt from "jsonwebtoken";

// 사용자정의모듈
import logHelper from "../commons/log_helper";
import utils from "../commons/utils";
import config from "../commons/_config";

const router = express.Router();

// 모든 경로에 대해서 인증검사
/**
 * 로그인 체크 함수
 * 만약 쿠키에 token 이 존재하지 않는다면 튕겨내고
 * 존재한다면 다음으로 이동한다.
 */
router.use("/", (req, res, next) => {
    
    if(req.headers.referer === req.headers.origin + "/playground" || req.path === "/playground"){
        // playground 인 경우 token 검사 안함
        next();
    } else if (utils.isEmpty(req.body)) {
        // body가 없는 경우(get 요청인 경우??)
        return false;
    } else if (req.body.operationName === "login") {
        // graphql login 인 경우 token 검사 안함
        next();
    } else if (req.body.operationName === "insertMember") {
        // graphql insertMember 인 경우(회원가입) token 검사 안함
        next();
    } else {
        // 그 외 일반적인 모든 요청에 대해서 token 검사
        let token = req.headers['x-access-token'] || req.query.token;
        logHelper.debug(req.headers);
        logHelper.trace(token);
        if(!utils.isEmpty(token)){
            // 토큰이 있다면
            let decoded = jwt.verify(token, config.secure.jwt_encrypt_key);
            if(decoded){
                logHelper.debug(decoded);
                logHelper.debug("권한 있음!");
                next();
            } else {
                logHelper.debug("권한 없음...");
                // 권한없음 페이지로 이동
                res.json({data: "권한 없음"});
            }
        } else {
            logHelper.debug("로그인 필요...");
            // 로그인페이지로 이동
            res.json({data: {
                code: "-1",
                msg: "로그인 필요"
            }});
        }
    }
});

module.exports = router;