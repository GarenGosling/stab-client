$(function(){

});

function signUp() {
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
    param.realName = $("#realName").val();
	$.ajax({
        type:"post",
        url: getUrl("USER_SIGN_UP"),
        headers: {
            "token": getToken()
        },
        data: JSON.stringify(param),
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        success:function (response) {
        	if(response.code == "1"){
                alert("Successful registration, please wait for approval.");
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