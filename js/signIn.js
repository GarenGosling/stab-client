function signIn() {
    if(!$("#environmentSelect").val()){
        alert("Please select environment");
        return;
    }
    localStorage.removeItem("environment");
    let environment = {};
    let options = $("#environmentSelect option:selected");
    environment.name = options.text();
    environment.url = options.val();
    localStorage.setItem("environment", JSON.stringify(environment));

    let param = {};
    param.phone = $("#phone").val();
    param.password = $("#password").val();
    $.ajax({
        type:"post",
        url: getUrl("USER_SIGN_IN"),
        data: JSON.stringify(param),
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        success:function (response) {
            if(response.code == "1"){
                let token = response.data;
                localStorage.setItem("token",token);
                signInToken();
            }else{
                alert(response.code + "--" + response.message + " -- " + response.data);
            }
        },
        error:function (response) {
            if(response.code){
                alert(response.code + "--" + response.message + " -- " + response.data);
            }else{
                alert("Connection refused");
            }
        }
    });
}

function signInToken() {
    $.ajax({
        type:"get",
        url: getUrl("USER_SIGN_IN_TOKEN"),
        headers: {
            "token": getToken()
        },
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        success:function (response) {
            if(response.code == "1"){
                let phone = response.data.phone;
                let realName = response.data.realName;
                localStorage.setItem("phone",phone);
                localStorage.setItem("realName",realName);
                window.location.href = "../html/main.html";
            }else{
                alert(response.code + "--" + response.message + " -- " + response.data);
            }
        },
        error:function (response) {
            alert(response.code + "--" + response.message + " -- " + response.data);
        }
    });
}

function getToken() {
    return localStorage.getItem("token");
}


