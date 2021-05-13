const LANG = "lang";
//const REFRESH_TOKEN_KEY = "refresh_token";
const USER_ID = "user_id";
const TOKEN_KEY = "token";

const StorageService = {
   
    getUserId() {
        return localStorage.getItem(USER_ID);
    },

    saveUserId(userid: string) {
        localStorage.setItem(USER_ID, userid);
    },

    removeUserId() {
        localStorage.removeItem(USER_ID);
    },


    getLang() {
        return localStorage.getItem(LANG);
    },

    saveLang(lang: string) {
        localStorage.setItem(LANG, lang);
    },

    
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    saveToken(accessToken: string) {
        localStorage.setItem(TOKEN_KEY, accessToken);
    },

    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    },

    /*
     
    getRefreshToken() {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    saveRefreshToken(refreshToken: string) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    },

    removeRefreshToken() {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }*/
};

export { StorageService };