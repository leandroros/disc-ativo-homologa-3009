export const TOKEN_KEY = "@FlashSafe-token";
export const TOKEN_KEY2 = "@FlashSafe-token2";

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const login = token => {
    localStorage.setItem(TOKEN_KEY, token);
};
export const logout = () => {
    //localStorage.removeItem(TOKEN_KEY);
    localStorage.clear();
};

export const login2 = token => {
    localStorage.setItem(TOKEN_KEY2, token);
};