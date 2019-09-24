const memberModel = require("../models/member_model");

module.exports.getMemberList = async () => {
    return await memberModel.SELECTMemberList();
};
