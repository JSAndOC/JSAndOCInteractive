window.onload = function(){
//	var wh = PluginDensityUtils.getScreenWH();
//    console.log(wh.width+"; wi.height = " + wh.height);
    
    /// @brief 绑定按钮事件正确写法(方法一)
//    document.getElementById('contact').addEventListener('click',function(){
//        alert(111);
//        console.log("clicked contact");
//        //open contacts
//        var contact = Contacts.openContacts(function(){
//            alert("open contacts success");
//        },function(){
//            alert("open contacts fail");
//                });
//        },false);
    
    /// @brief 绑定按钮正确写法(写法二)
    document.getElementById('contact').onclick = function(){
//            alert(111);
            console.log("clicked contact");
            //open contacts
            var contact = Contacts.openContacts('successCallback()','failCallback()');
//        alert(contact);
        }
    
    
    
	document.getElementById('tel').onclick = function(){
		//call
		Contacts.tel(13311111111);
	}
}

function failCallback(){
    alert("open contacts fail");
};
function successCallback(data){ // {'number' : '1333333333'}
    var str2 = JSON.parse(data);
    alert(str2.number);
};
/*
define(['jquery'],function($){

	function test(){

	}

	test.prototype.initApp = function(){
		//屏幕适配
		this.screenAdapter();

		//TestPlugin.test();
		var wh = PluginDensityUtils.getScreenWH();
		console.log(wh.width+"; wi.height = " + wh.height);

		$("#contact").click(function(){
			//open contacts
			var contact = Contacts.openContacts(function(){
				alert("open contacts success");
			},function(){
				alert("open contacts fail");
			});
		});
		$("#tel").click(function(){
			//call
            Contacts.tel(13311111111);
		});
	}
	test.prototype.screenAdapter = function(){
		if (screenSize != null && screenSize != "" ){
				var arr = screenSize.split("x");
				if (arr.length == 2) {
					device_width = arr[0];
					device_height = arr[1];
				}
			}
			var densitydpi = UI_width / device_width * window.devicePixelRatio * 160;
			var initialScale = device_width / UI_width;
			var targetDensitydpi = "";
			// Android or iOS ？
			console.log("当前浏览器版本： " + navigator.appVersion);
			if ((/android/gi).test(navigator.appVersion)) {
				targetDensitydpi = 'target-densitydpi=' + densitydpi + ', width=device-width, user-scalable=no';
			} else {
				targetDensitydpi = 'target-densitydpi=' + densitydpi + ', width=device-width, user-scalable=no, initial-scale=' + initialScale;
			}
			document.getElementsByName('viewport')[0].setAttribute( 'content', targetDensitydpi);
			console.log("完成终端适配");
			return;
			}
	return test;
});*/
