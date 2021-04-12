class MyStorage {
    static setItem(key, value, expire) {
        // 存储数据
        localStorage.setItem(key, value);
        // 如果用户传入了过期时间
        if (expire) {
            // 从本地获取存储的到期时间Json对象
            const expireJson = localStorage.getItem("expireTime") || "{}";
            // 解析Json时间对象
            const parseExpire = JSON.parse(expireJson);
            // 将到期时间放入时间对象
            parseExpire[key] = new Date().getTime() + expire;
            // 将到期时间对象存储在本地
            localStorage.setItem("expireTime", JSON.stringify(parseExpire));
        }

    }

    static getItem(key) {
        // 获取本地到期时间Json对象
        const expireTimeJson = localStorage.getItem("expireTime") || "{}";
        // 解析到期时间对象
        const expireTime = JSON.parse(expireTimeJson);
        // 判断有没有到期
        const timeValid = expireTime[key] && (expireTime[key] - Date.now()) > 0;
        // 有果在有效期内
        if (!expireTime[key] || (expireTime[key] && timeValid)) {
            // 返回数据
            return localStorage.getItem(key);
        }
        // 如果没在有效期内， 删除当前数据的到期时间
        delete expireTime[key];
        // 将变更后到到期时间对象存储到本地
        localStorage.setItem("expireTime", JSON.stringify(expireTime));
        // 删除当前本地数据
        localStorage.removeItem(key);
    }
}