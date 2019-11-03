import express from "express";
import jwt from "jsonwebtoken";

// 사용자정의모듈
import logHelper from "../commons/log_helper";
import utils from "../commons/utils";

const router = express.Router();

// 모든 경로에 대해서 인증검사
/**
 * 로그인 체크 함수
 * 만약 쿠키에 token 이 존재하지 않는다면 튕겨내고
 * 존재한다면 다음으로 이동한다.
 */
router.use("/", (req, res, next) => {
    if(req.headers.referer === req.headers.origin + "/playground" || req.path === "/playground"){
        // playground 인 경우 그냥 패스
        next();
    } else {
        logHelper.debug(req.cookies);
        if(!utils.isEmpty(req.cookies) && !utils.isEmpty(req.cookies.token)){
            // 토큰이 있다면
            let token = req.cookies.token;
            let decoded = jwt.verify(token, config.secure.jwt_encrypt_key);
            if(decoded){
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