define(function(){
	var timeFlag ;
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


	/* Html5与Android交互接口，通过调用该接口实现html5与android的交互。
	 * 所有需要调用android端功能的function都需要调用该方法
	 * 
	 * @params {String} service The name of the service to use @params {String}
	 * action Action to be run in proxy @params {JSON} args Arguments to pass to the
	 * method,it's maybe null if the method doesn't need arguments @params {Boolean}
	 * syn 是否同步 @params {Function} success The success callback @params {Function}
	 * fail The fail callback
	 */
	var android_exec = function(service, action, args, syn, success, fail) {
		if (syn) {
			return exec(service, action, args);
		} else {
			exec(service, action, args, success, fail);
		}
	}
	
	/**
	 * HTML5与Android异步交互
	 * 
	 */
	var jointemHtml5 = {
		idCounter : 0, // 参数序列计数器
		INPUT_CMDS : "", // 入参服务与命令名
		INPUT_ARGS : "", // 入参的参数
		OUTPUT_RESULTS : "", // 输出的结果
	
		// 输出的结果成功时调用的方法
		CALLBACK_SUCCESS : function(result) {
			// stub
			console.log(result);
			return;
		},
		// 输出的结果失败时调用的方法
		CALLBACK_FAIL : function(result) {
			// stub
			console.log(result);
			return;
		},
		/*
		 * exec_asyn调用的方法 @params {JSONObject} cmd 服务名和动作命令 @params {String} args 参数
		 */
		callNative : function(cmd, args) {
			this.INPUT_CMDS = cmd;
			this.INPUT_ARGS = args;
			var key = "ID_" + (++this.idCounter);
			window.jointem_yxb.setCmds(this.getInputCmd(), key);
			window.jointem_yxb.setArgs(this.getInputArgs(), key);
			var iframe = document.createElement("IFRAME");
			iframe.setAttribute("src", "jointemhtml://ready?id=" + key);
			document.documentElement.appendChild(iframe);
			iframe.parentNode.removeChild(iframe);
			iframe = null;
	
			console.log(2);
			console.log("return this.OUTPUT_RESULTS:" + this.OUTPUT_RESULTS);
			return this.OUTPUT_RESULTS;
		},
		getInputCmd : function() {
			// alert("c=="+JSON.stringify(INPUT_CMDS));
			return JSON.stringify(this.INPUT_CMDS);
		},
		getInputArgs : function() {
			// alert("p=="+(INPUT_ARGS));
			return this.INPUT_ARGS;
		},
	
		callBackJs : function(result) {
			// alert("BACK:"+result);
			this.OUTPUT_RESULTS = result;
			console.log(1);
			var obj = JSON.parse(result);
			var message = obj.message;
			console.log("message:" + message);
			var status = obj.status;
			if (status == 0) {
				if (typeof this.CALLBACK_SUCCESS != "undefined")
					setTimeout("jointemHtml5.CALLBACK_SUCCESS('" + message + "')",
							0);
			} else {
				if (typeof this.CALLBACK_FAIL != "undefined")
					setTimeout("jointemHtml5.CALLBACK_FAIL('" + message + "')", 0);
			}
			console.log("你先:" + "(" + (jointemHtml5.idCounter) + ")" + result);
		}
	};
	
	/*
	 * Html5与Android同步交互接口
	 * 在本应用中，prompt被拦截（DroidHtml5中的WebServerChromeClient中的onJsPrompt方法），
	 * Android本地代码会拦截该对话框，取得JavaScript数据，解析处理数据后，将结果返回给JavaScript。
	 * 
	 * @params {String} service 使用的Service，即后台IPlugin的实现类 @params {String} action
	 * 在IPlugin中执行哪个方法 @params {JSON} args 传递给该方法的参数。如果不需要参数则设置为null
	 */
	var exec = function(service, action, args) {
		var json = {
			"service" : service,
			"action" : action
		};
		var result_str = prompt(JSON.stringify(json), args);
		console.log(result_str);
		var result;
		try {
			result = JSON.parse(result_str);
		} catch (e) {
			console.error(e.message);
		}
	
		var status = result.status;
		var message = result.message;
		if (status == 0) {
			if(typeof(message) == 'string') message = JSON.parse(message);
			return message;
		} else {
			console.error("service:" + service + " action:" + action + " error:"
					+ message);
		}
	}
	// Webserver 端口
	var port;
	
	/*
	 * Html5与Android异步交互接口
	 * 
	 * @params {String} service The name of the service to use @params {String}
	 * action Action to be run in proxy @params {JSON} args Arguments to pass to the
	 * method,it's maybe null if the method doesn't need arguments @params
	 * {Function} success The success callback @params {Function} fail The fail
	 * callback
	 */
	var exec_asyn = function(service, action, args, success, fail) {
		var json = {
			"service" : service,
			"action" : action
		};
	
		if (typeof fail != 'success')
			jointemHtml5.CALLBACK_SUCCESS = success;
		if (typeof fail != 'undefined') {
			jointemHtml5.CALLBACK_FAIL = fail;
		} else {
			jointemHtml5.CALLBACK_FAIL = function() {
			};// add by ztm 2014/4/17 cause by 全局函数引起的问题
		}
	
		var result = jointemHtml5.callNative(json, args);
	
		console.log("我先:" + "(" + (jointemHtml5.idCounter) + ")" + result);
	}
	return{
		exec_asyn : exec_asyn,
        exec : exec,
        TestPlugin : TestPlugin,
        PluginDensityUtils : PluginDensityUtils,
		jointemHtml5 : jointemHtml5
	};

});