// Platform:Android/IOS
// Version:1.1

//test
var TestPlugin = {
	test : function(callback,fail){
		var json = {
			'arg0' : '123',
			'arg1' : '456'
		}
		return exec("TestPlugin", "test", JSON.stringify(json),callback,fail);
	}
};

/**
 *获取手机屏幕宽高
 */
var PluginDensityUtils = {
	getScreenWH : function(){
		var json = {
			'arg0' : '123',
			'arg1' : '456'
		}
		return exec("PluginDensityUtils", "getScreenWH",JSON.stringify(json));
	}
};
/**
 * 联系人
 */
var Contacts = {
	/**
	 * 打开联系人
	 * @param success － 成功时回调函数
	 * @param fail － 失败时回调函数
	 * @return 无
	 * @since 1.0.0
	 */
	openContacts:function(success,fail){
		exec_asyn("Contacts","openContacts",'{}',success,fail);
	},
	/**
	 * 打电话
	 * @param tel - 电话号码
	 * @return 无
	 * @since 1.0.0
	 */
	tel:function(tel){
		var json = {
				'tel':tel
		}
		return exec("Contacts","call",JSON.stringify(json));
	}
}

/**
 * HTML5与原生交互
 * @since 1.1.0
 */
var jointemHtml5 = {
	idCounter:0, //参数序列计数器 
    INPUT_CMDS: {}, //入参服务与命令名
    INPUT_ARGS: {}, //入参的参数
    OUTPUT_RESULTS: {}, //输出的结果
    CALLBACK_SUCCESS:{}, //输出的结果成功时调用的方法
    CALLBACK_FAIL:{},    //输出的结果失败时调用的方法
    
    /**
     * exec_asyn调用的方法
     * @params {JSONObject} cmd 		服务名和动作命令
     * @params {String} args			参数
     */    
    call_Android_Native:function(cmd, args, success, fail) {
        var key = "ID_"+(++this.idCounter);
        console.log("Now the key is "+key);
        this.INPUT_CMDS[key] = cmd;
        this.INPUT_ARGS[key] = args;
        console.log("this.getInputArgs(key)"+this.getInputArgs(key));
        window.nintf.setCmds(this.getInputCmd(key),key);
        window.nintf.setArgs(this.getInputArgs(key),key);
        if (typeof success !='undefined') this.CALLBACK_SUCCESS[key] = success;
        if (typeof fail !='undefined') this.CALLBACK_FAIL[key] = fail;
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", "jointemhtml://ready?id="+key);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
       
//        console.log("return this.OUTPUT_RESULTS:"+this.OUTPUT_RESULTS[key]);
//        return this.OUTPUT_RESULTS[key];//同步调用时返回值
    },
    call_IOS_Native:function(cmd, args, success, fail) {
        var key = "ID_"+(++this.idCounter);
        this.INPUT_CMDS[key] = cmd;
        this.INPUT_ARGS[key] = JSON.stringify(args);
        if (typeof success !='undefined') this.CALLBACK_SUCCESS[key] = success;
        if (typeof fail !='undefined') this.CALLBACK_FAIL[key] = fail;
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", "jointemhtml://ready?id="+key);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
        
        return this.OUTPUT_RESULTS[key]; //同步调用时返回值
    },
    /**
     * 获取执行服务和动作
     * @params {String} key			队列标识
     */
    getInputCmd:function(key) {
    	return JSON.stringify(this.INPUT_CMDS[key]);
    },
    /**
     * 获取执行参数
     * @params {String} key			队列标识
     */
    getInputArgs:function(key) {
    	return this.INPUT_ARGS[key];
    },
    /**
     * 回调返回结果函数
     * @params {String} result		后台处理的结果
     * @params {String} key			队列标识
     */
    callBackJs:function(result,key) {
    	console.log("callBackJS:"+result+"="+key);
        this.OUTPUT_RESULTS[key] = result;
        var obj = JSON.parse(result);
        var message = obj.message;
        var status = obj.status;
        if(status==0){
            if (typeof this.CALLBACK_SUCCESS[key] !="undefined")
                setTimeout("jointemHtml5.CALLBACK_SUCCESS['"+key+"']('"+message+"')",0);
        }else{
            if (typeof this.CALLBACK_FAIL[key] !="undefined") {
                setTimeout("jointemHtml5.CALLBACK_FAIL['"+key+"']('"+message+"')",0);
            } else {
            	alert('该功能尚不支持，请升级您的客户端版本或者联系客服人员。');
            }
        }
    }
};


/**
 * Html5与原生同步交互接口
 * 在本应用中，prompt被拦截（DroidHtml5中的WebServerChromeClient中的onJsPrompt方法），
 * Android本地代码会拦截该对话框，取得JavaScript数据，解析处理数据后，将结果返回给JavaScript。
 *
 * @params {String} service      使用的Service，即后台IPlugin的实现类
 * @params {String} action       在IPlugin中执行哪个方法
 * @params {JSON} args           传递给该方法的参数。如果不需要参数则设置为null
 * @since 1.1.0
 */
var exec = function(service,action,args){
	// alert("version------>"+navigator.appVersion);
	var json = {
		"service":service,
		"action":action
	};
	var result_str = "";
	//alert("--"+(/android/gi).test(navigator.appVersion));
	//(/android/gi).lastIndex=0;
	if ((/android/gi).test(navigator.appVersion)) {
		//alert("android-->"+JSON.stringify(json));
		result_str = prompt(JSON.stringify(json),args);
	}else{
		//alert("ios-->"+JSON.stringify(json));
		//result_str = jointemHtml5.call_IOS_Native(JSON.stringify(json),args);
		//有些手机二次判断错误
		result_str = prompt(JSON.stringify(json),args);
	}
		
	var result;
	try{
		result = JSON.parse(result_str);
	}catch(e){
		console.error(e.message);
	}
		console.log(result_str)
	var status = result.status;
	var message = result.message;
	if(status==0){
		if(typeof(message) == "string"){
			message = JSON.parse(message);
		}
		return message;
	}else{
		console.error("service:"+service+" action:"+action +" error:"+message);
		return null;
	}
}

/**
 * Html5与原生异步交互接口
 *
 * @params {String} service      The name of the service to use
 * @params {String} action       Action to be run in proxy
 * @params {JSON} args           Arguments to pass to the method,it's maybe null if the method doesn't need arguments
 * @params {Function} success    The success callback
 * @params {Function} fail       The fail callback
 * @since 1.1.0
 */
var exec_asyn = function(service,action,args,success,fail){
	var json = {
		"service":service,
		"action":action
    };
 	
    if ((/android/gi).test(navigator.appVersion)) {
    	jointemHtml5.call_Android_Native(json,args,success,fail);
    }else{
    	jointemHtml5.call_IOS_Native(json,args,success,fail);
    }
}




