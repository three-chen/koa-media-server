import AuthR from "./authR";

export default interface LoginR {
    /**
     * 用户名
     */
    username: string;
    /**
     * 用户邮箱
     */
    useremail: string;
    /**
     * jwt
     */
    token: string;
    /**
     * 用户权限
     */
    auth: AuthR
}