/**
 * create on 3/3/2016
 * Version 1.0
 */
define({
    'dummy' : false,
    'debug' : true,
    'browser' : false,

    'isOpen' : true,
    'isDialogBack' : false,     //showDialog 时,触发物理返回按钮
    'isBack' : function(){},    //触发物理返回按钮时，调用的事件

    /**
     * PRODUCT 		= 0;//生产环境
     * PRE_PRODUCT 	= 1;//准生产环境
     * PUBLIC 		= 2;//42，常规版环境
     */
    'ENV' : 'ENV46',   //接口请求环境变量
    'isOnline' : true,  //是否在线部署  false就是离线的  true就是在线的

    /** Below is CPS Service name config */
    'CPS' : {
        'ACCOUNT_BIND_CARD_STATE' : 'SBinCrd004',       // 4) 绑卡查询查询接口 SBinCrd004
        },
    'URLCPS' : {
        'PRODUCT' : 'https://enterprise.bestpay.com.cn:4443/',
        'PRE_PRODUCT' : 'http://183.63.191.62:8383/',
        'PUBLIC' : 'http://183.62.49.173:8383/'

    },
    'MSG': {
        'loading': '处理中...',
        'networkFail': '⊙_⊙网络不给力哦，请检查后再试哈',
        'networkFail1':'网络连接失败（091106）',
        'networkFail2':'系统处理失败，请稍后再试'
    },
});