function getUrl(key) {
    let environment = JSON.parse(localStorage.getItem("environment"));
    let url = "";
    switch (key) {
        case "LOG_LIST":
            url = environment.url + "log/list";
            break;
        case "SQL_CRUD":
            url = environment.url + "sql/crud";
            break;
        case "USER_AUDIT":
            url = environment.url + "user/audit";
            break;
        case "USER_DEL":
            url = environment.url + "user/del";
            break;
        case "USER_GET":
            url = environment.url + "user/get";
            break;
        case "USER_LIST":
            url = environment.url + "user/list";
            break;
        case "USER_SIGN_IN":
            url = environment.url + "user/signIn";
            break;
        case "USER_SIGN_IN_TOKEN":
            url = environment.url + "user/signIn/token";
            break;
        case "USER_SIGN_UP":
            url = environment.url + "user/signUp";
            break;
    }
    return url;
}