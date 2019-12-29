$(function(){
	isSignIn();
 	executeSql();
 	$("#executeBtn").click(function(){
 		executeSql();
 	});
 	$("#user_phone").text(getPhone());
 	$("#user_realName").text(getRealName());
    getUserList();
    let environment = JSON.parse(localStorage.getItem("environment"));
    $("#env").text(environment.name);
});

function fillTableQuery(response, noInput) {
	$("#thead1").empty();
	$("#tbody1").empty();
 	let data = response.data.result;
 	let sqlExc = response.data.sql;
 	if(sqlExc){
 		$("#stab_input").val(sqlExc);
 	}

 	// 表头
	if(!data){
		return;
	}
 	if(data.length > 0){
		let obj0 = data[0];
		//动态创建一个tr行标签,并且转换成jQuery对象
		let $trTemp0 = $("<tr></tr>");

		for (let key in obj0) {
			//往行里面追加 td单元格
			$trTemp0.append("<td>"+ key +"</td>");
		}

		// $("#J_TbData").append($trTemp);
	    $trTemp0.appendTo("#thead1");
 	}
 	
	// 数据
    for( let i = 0; i < data.length; i++ ) {
    	let obj = data[i];

        //动态创建一个tr行标签,并且转换成jQuery对象
        let $trTemp = $("<tr></tr>");

		for (let key in obj) {
			if(noInput){
                let $td = $("<td>"+obj[key]+"</td>");
                $trTemp.append($td);
			}else{
                let $input = $("<input></input>");
                $input.val(obj[key]);

                let $td = $("<td></td>");
                $td.append($input);
                //往行里面追加 td单元格
                $trTemp.append($td);
			}
		}

        $trTemp.appendTo("#tbody1");
    }

    // 消息
    $("#resMsg").text(data.length + " rows in table");
}

function fillTableErr(response) {
	$("#thead1").empty();
	$("#tbody1").empty();
 	
 	// 表头
	let $trTemp0 = $("<tr></tr>");
	$trTemp0.append("<td>错误码</td>");
	$trTemp0.append("<td>错误信息</td>");
	$trTemp0.append("<td>错误详情</td>");
    $trTemp0.appendTo("#thead1");
 	
	// 数据
    let $trTemp = $("<tr></tr>");
	let $td = $("<td>"+ response.code +"</td>");
	$trTemp.append($td);

	let $td2 = $("<td>"+response.message+"</td>");
	$trTemp.append($td2);

	let $td3 = $("<td>"+response.data+"</td>");
	$trTemp.append($td3);

    $trTemp.appendTo("#tbody1");

    // 消息
    $("#resMsg").text("1 rows in table");
}

function fillTableIU(response) {
	$("#thead1").empty();
	$("#tbody1").empty();
 	
 	// 表头
	let $trTemp0 = $("<tr></tr>");
	$trTemp0.append("<td>CODE</td>");
	$trTemp0.append("<td>MESSAGE</td>");
	$trTemp0.append("<td>METHOD</td>");
	$trTemp0.append("<td>STAB</td>");
	$trTemp0.append("<td>RESULT</td>");
    $trTemp0.appendTo("#thead1");
 	
	// 数据
        let $trTemp = $("<tr></tr>");

		let $td = $("<td>"+response.code+"</td>");
		$trTemp.append($td);

		let $td2 = $("<td>"+response.message+"</td>");
		$trTemp.append($td2);

		let $td5 = $("<td>"+response.data.method+"</td>");
		$trTemp.append($td5);

		let $td4 = $("<td>"+response.data.stab+"</td>");
		$trTemp.append($td4);

		let $td3 = $("<td>"+response.data.result+"</td>");
		$trTemp.append($td3);

        $trTemp.appendTo("#tbody1");

        // 消息
    $("#resMsg").text("1 rows in table");
}


function executeSql() {
	if($("#stab_input").val()){
		let param = {};
		param.sql = $("#stab_input").val();
		$.ajax({
            type:"post",
            url: getUrl("SQL_CRUD"),
         	headers: {
        		"token": getToken()
    		},
            data: JSON.stringify(param),
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            crossDomain: true,
            success:function (response) {
            	if(response.code == "1"){
            		if(response.data.method == "INSERT" || response.data.method == "UPDATE"){
						fillTableIU(response);
            		}
            		if(response.data.method == "QUERY"){
						fillTableQuery(response);
            		}
            	}else{
            		fillTableErr(response);
            	}
            },
            error:function (response) {
                fillTableErr(defaultResponse);
            }
        });
	}else{
		fillTableQuery(defaultResponse, false);
	}
}

function isSignIn() {
	if(!getToken()){
		window.location.href = "signIn.html";
	}
}

function signOut() {
	localStorage.removeItem("token");
	localStorage.removeItem("phone");
    localStorage.removeItem("realName");
    localStorage.removeItem("environment");
	isSignIn();
}

function getToken() {
	return localStorage.getItem("token");
}
function getPhone() {
	return localStorage.getItem("phone");
}
function getRealName() {
	return localStorage.getItem("realName");
}
function getUserList(){
    $.ajax({
        type:"get",
        url: getUrl("USER_LIST"),
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        success:function (response) {
            if(response.code == "1"){
                $("#auditSelect option").remove();
                $("#auditSelect").append("<option value=''>&nbsp;&nbsp;-- List to be reviewed --&nbsp;&nbsp;</option>")
                let arr = response.data;
                if(arr){
                	$.each(arr, function (i,item) {
						if(item != null){
							$("#auditSelect").append("<option value='"+item.phone+"'>" + item.phone+"--" + item.realName + "--" + item.status + "</option>")
						}
                    });
				}
            }else{
                fillTableErr(response);
            }
        },
        error:function () {
            fillTableErr(defaultResponse);
        }
    });
}
function audit(){
    $.ajax({
        type:"get",
        url: getUrl("USER_AUDIT") + "?phone=" + $("#auditSelect").val(),
        headers: {
            "token": getToken()
        },
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        success:function (response) {
            if(response.code == "1"){
                getUserList();
            }else{
                fillTableErr(response);
            }
        },
        error:function () {
            fillTableErr(defaultResponse);
        }
    });
}

function logs(){
    $.ajax({
        type:"get",
        url: getUrl("LOG_LIST") + "?phone=" + $("#auditSelect").val(),
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        success:function (response) {
            if(response.code == "1"){
                fillTableQuery(response, true);
            }else{
                fillTableErr(response);
            }
        },
        error:function () {
            fillTableErr(defaultResponse);
        }
    });
}

