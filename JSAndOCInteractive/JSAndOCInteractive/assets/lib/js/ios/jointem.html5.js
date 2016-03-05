define(function(){

	var testData = "a";

	var timeFlag ;

	//联系人
	var Contacts = {
		//打开联系人
		openContacts:function(success,fail){
			exec_asyn("Contacts","openContacts",'{}',success,fail);
		},
			//打电话
		tel:function(tel){
			var json = {
				"tel":tel
			}
	        return  exec_syn("Contacts","call",json);
		}
	}

	/**
	 * native提供uitl。
	 */
	var util = {
	    /**
	     * 实现base64编码
	     * @params {JSON} data {name:'ztm';card:'6225'}
	     * @return {JSON} result {name:"enRt";card:"NjIyNQ=="}
	     * @since 1.0.6
	     */
	    base64Encode : function(jsonobj){
	        if(typeof(jsonobj) == "undefined" || typeof(jsonobj) != "object") {
	            return false;
	        } else {
	            
	            var _result ="";
	            _result = exec_syn("UtilPlugin","base64Encode",JSON.stringify(jsonobj));
	//            alert(_result);
	            return _result;
	        }
	    },
	    /**
	     * 实现base64解码
	     * @params {JSON} data {name:"enRt";card:"NjIyNQ=="}
	     * @return {JSON} result {name:'ztm';card:'6225'}
	     * @since 1.0.6
	     */
	    base64Decode : function(jsonobj){
	        if(typeof(jsonobj) == "undefined" || typeof(jsonobj) != "object") {
	            return false;
	        } else {
	            var _resultJson ={};
	            var _result ="";
	            
	            _result = exec_syn("UtilPlugin","base64Decode",JSON.stringify(jsonobj));
	            
	            return _result;
	        }
	    }
	}
	
	
	var android_exec = function(service,action,args,syn,success,fail){
		if(syn){
			return exec(service,action,args);
		}else{
			exec(service,action,args,success,fail);
		}
	}
	
	var makeAlert = function(text){
	    alert(text);
	}
	
	
	var jointemHtml5 = {
	idCounter:0, //参数序列计数器
	INPUT_CMDS: {}, //入参服务与命令名
	INPUT_ARGS: {}, //入参的参数
	OUTPUT_RESULTS: {}, //输出的结果
	CALLBACK_SUCCESS:{}, //输出的结果成功时调用的方法
	CALLBACK_FAIL:{},    //输出的结果失败时调用的方法
	    /*
	     * exec/exec_asyn调用的方法
	     * @params {JSONObject} cmd 		服务名和动作命令
	     * @params {String} args			参数
	     * @params {JS FUNCTION} success			成功时回调函数
	     * @params {JS FUNCTION} fail			失败时回调函数
	     */
	callNative:function(cmd, args, success, fail) {
	    var key = "ID_"+(++this.idCounter);
	    testData = key;
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
	    /*
	     * 获取执行服务和动作
	     * @params {String} key			队列标识
	     */
	getInputCmd:function(key) {
	    return JSON.stringify(this.INPUT_CMDS[key]);
	},
	    /*
	     * 获取执行参数
	     * @params {String} key			队列标识
	     */
	getInputArgs:function(key) {
	    return this.INPUT_ARGS[key];
	},
	    /*
	     * 回调返回结果函数
	     * @params {String} result		后台处理的结果
	     * @params {String} key			队列标识
	     */
	callBackJs:function(result,key) {
	    this.OUTPUT_RESULTS[key] = result;
	    //    alert(result);
		try {
			var obj = JSON.parse(result);
			var message = obj.message;
			var status = obj.status;
			if(status==0){
				if (typeof this.CALLBACK_SUCCESS[key] !="undefined")
					setTimeout("jointemHtml5.CALLBACK_SUCCESS['"+key+"']('"+message+"')",0);
			}else{
				if (typeof this.CALLBACK_FAIL[key] !="undefined")
					setTimeout("jointemHtml5.CALLBACK_FAIL['"+key+"']('"+message+"')",0);
			}
		} catch (e) {
			console.error(e.message);
		}
	}
	};
	
	//异步
	var exec_asyn = function(service,action,args,success,fail){
	   	var json = {
	        "service":service,
	        "action":action
	    };
	    
		jointemHtml5.callNative(JSON.stringify(json),args,success,fail);
	    
	}
	
	//同步
	var exec_syn = function(service,action,args){
	    
		var json = {
			"service":service,
			"action":action
		};
	    
		var result_str = jointemHtml5.callNative(JSON.stringify(json),args);
	    //alert("exec_syn result_str = " + result_str);
		var result;
		try{
	        result = JSON.parse(result_str);
			var status = result.status;
			var message = result.message;
			return message;
	    }catch(e){
			console.error(e.message);
			//fail(e.message);
		}
	    

	}
	
	
	/*
	 * MD5加密
	 */
	
	////////////////////////////////
	var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase */
	var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance */
	var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode */
	
	/*
	 * These are the functions you'll usually want to call
	 * They take string arguments and return either hex or base-64 encoded strings
	 */
	function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
	function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
	function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
	function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
	
	/* Backwards compatibility - same as hex_md5() */
	function calcMD5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
	
	/*
	 * Perform a simple self-test to see if the VM is working
	 */
	function md5_vm_test()
	{
	    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
	}
	
	/*
	 * Calculate the MD5 of an array of little-endian words, and a bit length
	 */
	function core_md5(x, len)
	{
	    /* append padding */
	    x[len >> 5] |= 0x80 << ((len) % 32);
	    x[(((len + 64) >>> 9) << 4) + 14] = len;
	    
	    var a = 1732584193;
	    var b = -271733879;
	    var c = -1732584194;
	    var d = 271733878;
	    
	    for(var i = 0; i < x.length; i += 16)
	    {
	        var olda = a;
	        var oldb = b;
	        var oldc = c;
	        var oldd = d;
	        
	        a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
	        d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
	        c = md5_ff(c, d, a, b, x[i+ 2], 17, 606105819);
	        b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
	        a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
	        d = md5_ff(d, a, b, c, x[i+ 5], 12, 1200080426);
	        c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
	        b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
	        a = md5_ff(a, b, c, d, x[i+ 8], 7 , 1770035416);
	        d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
	        c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
	        b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
	        a = md5_ff(a, b, c, d, x[i+12], 7 , 1804603682);
	        d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
	        c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
	        b = md5_ff(b, c, d, a, x[i+15], 22, 1236535329);
	        
	        a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
	        d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
	        c = md5_gg(c, d, a, b, x[i+11], 14, 643717713);
	        b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
	        a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
	        d = md5_gg(d, a, b, c, x[i+10], 9 , 38016083);
	        c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
	        b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
	        a = md5_gg(a, b, c, d, x[i+ 9], 5 , 568446438);
	        d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
	        c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
	        b = md5_gg(b, c, d, a, x[i+ 8], 20, 1163531501);
	        a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
	        d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
	        c = md5_gg(c, d, a, b, x[i+ 7], 14, 1735328473);
	        b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
	        
	        a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
	        d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
	        c = md5_hh(c, d, a, b, x[i+11], 16, 1839030562);
	        b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
	        a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
	        d = md5_hh(d, a, b, c, x[i+ 4], 11, 1272893353);
	        c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
	        b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
	        a = md5_hh(a, b, c, d, x[i+13], 4 , 681279174);
	        d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
	        c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
	        b = md5_hh(b, c, d, a, x[i+ 6], 23, 76029189);
	        a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
	        d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
	        c = md5_hh(c, d, a, b, x[i+15], 16, 530742520);
	        b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
	        
	        a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
	        d = md5_ii(d, a, b, c, x[i+ 7], 10, 1126891415);
	        c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
	        b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
	        a = md5_ii(a, b, c, d, x[i+12], 6 , 1700485571);
	        d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
	        c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
	        b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
	        a = md5_ii(a, b, c, d, x[i+ 8], 6 , 1873313359);
	        d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
	        c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
	        b = md5_ii(b, c, d, a, x[i+13], 21, 1309151649);
	        a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
	        d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
	        c = md5_ii(c, d, a, b, x[i+ 2], 15, 718787259);
	        b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
	        
	        a = safe_add(a, olda);
	        b = safe_add(b, oldb);
	        c = safe_add(c, oldc);
	        d = safe_add(d, oldd);
	    }
	    return Array(a, b, c, d);
	    
	}
	
	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */
	function md5_cmn(q, a, b, x, s, t)
	{
	    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
	}
	function md5_ff(a, b, c, d, x, s, t)
	{
	    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t)
	{
	    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t)
	{
	    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t)
	{
	    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}
	
	/*
	 * Calculate the HMAC-MD5, of a key and some data
	 */
	function core_hmac_md5(key, data)
	{
	    var bkey = str2binl(key);
	    if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);
	    
	    var ipad = Array(16), opad = Array(16);
	    for(var i = 0; i < 16; i++)
	    {
	        ipad[i] = bkey[i] ^ 0x36363636;
	        opad[i] = bkey[i] ^ 0x5C5C5C5C;
	    }
	    
	    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
	    return core_md5(opad.concat(hash), 512 + 128);
	}
	
	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y)
	{
	    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	    return (msw << 16) | (lsw & 0xFFFF);
	}
	
	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function bit_rol(num, cnt)
	{
	    return (num << cnt) | (num >>> (32 - cnt));
	}
	
	/*
	 * Convert a string to an array of little-endian words
	 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
	 */
	function str2binl(str)
	{
	    var bin = Array();
	    var mask = (1 << chrsz) - 1;
	    for(var i = 0; i < str.length * chrsz; i += chrsz)
	        bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
	    return bin;
	}
	
	/*
	 * Convert an array of little-endian words to a hex string.
	 */
	function binl2hex(binarray)
	{
	    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	    var str = "";
	    for(var i = 0; i < binarray.length * 4; i++)
	    {
	        str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
	        hex_tab.charAt((binarray[i>>2] >> ((i%4)*8 )) & 0xF);
	    }
	    return str;
	}
	
	/*
	 * Convert an array of little-endian words to a base-64 string
	 */
	function binl2b64(binarray)
	{
	    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	    var str = "";
	    for(var i = 0; i < binarray.length * 4; i += 3)
	    {
	        var triplet = (((binarray[i >> 2] >> 8 * ( i %4)) & 0xFF) << 16)
	        | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
	        | ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
	        for(var j = 0; j < 4; j++)
	        {
	            if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
	            else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
	        }
	    }
	    return str;
	}
	return{
		exec_syn : exec_syn,
		Contacts : Contacts,
		jointemHtml5 : jointemHtml5
};

});