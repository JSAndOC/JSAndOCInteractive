/**
 *create on 3/3/2016
 *version 1.0
 */

var urlAll = window.location.href,url, isRecords;
url = urlAll.substring(urlAll.lastIndexOf('/') + 1, urlAll.lastIndexOf('.html'));

;(function() {
    /*Construct the FastButton with a reference to the element and click handler.*/
    this.FastButton = function(element, handler) {
        console.log('fastbutton init');
        this.element = element;
        this.handler = handler;
        console.log(this);
        element.addEventListener('touchstart', this, false);
        element.addEventListener('click', this, false);
    };

    /*acts as an event dispatcher*/
    this.FastButton.prototype.handleEvent = function(event) {
        console.log(event);
        switch (event.type) {
            case 'touchstart': this.onTouchStart(event); break;
            case 'touchmove': this.onTouchMove(event); break;
            case 'touchend': this.onClick(event); break;
            case 'click': this.onClick(event); break;
        }
    };

    /*Save a reference to the touchstart coordinate and start listening to touchmove and
     touchend events. Calling stopPropagation guarantees that other behaviors don’t get a
     chance to handle the same click event. This is executed at the beginning of touch.*/
    this.FastButton.prototype.onTouchStart = function(event) {
        event.stopPropagation();
        this.element.addEventListener('touchend', this, false);
        document.body.addEventListener('touchmove', this, false);
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
    };

    /*When /if touchmove event is invoked, check if the user has dragged past the threshold of 10px.*/
    this.FastButton.prototype.onTouchMove = function(event) {
        if (Math.abs(event.touches[0].clientX - this.startX) > 10 ||
            Math.abs(event.touches[0].clientY - this.startY) > 10) {
            this.reset(); //if he did, then cancel the touch event
        }
    };

    /*Invoke the actual click handler and prevent ghost clicks if this was a touchend event.*/
    this.FastButton.prototype.onClick = function(event) {
        event.stopPropagation();
        this.reset();
        this.handler(event);
        if (event.type == 'touchend') {
            console.log('touchend');
            //clickbuster.preventGhostClick(this.startX, this.startY);
        }
    };

    this.FastButton.prototype.reset = function() {
        this.element.removeEventListener('touchend', this, false);
        document.body.removeEventListener('touchmove', this, false);
    };

    this.clickbuster = function() {
        console.log('init clickbuster');
    }
    /*Call preventGhostClick to bust all click events that happen within 25px of
     the provided x, y coordinates in the next 2.5s.*/
    this.clickbuster.preventGhostClick = function(x, y) {
        clickbuster.coordinates.push(x, y);
        window.setTimeout(this.clickbuster.pop, 2500);
    };

    this.clickbuster.pop = function() {
        this.clickbuster.coordinates.splice(0, 2);
    };
    /*If we catch a click event inside the given radius and time threshold then we call
     stopPropagation and preventDefault. Calling preventDefault will stop links
     from being activated.*/
    this.clickbuster.onClick = function(event) {
        for (var i = 0; i < clickbuster.coordinates.length; i += 2) {
            console.log(this);
            var x = clickbuster.coordinates[i];
            var y = clickbuster.coordinates[i + 1];
            if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
    };

})(this);

function urlParameters(urlParame) {
    var url;
    if(urlParame==null){
        url=document.URL;
    }else{
        url=urlParame;
    }
    if (url.lastIndexOf("#") != -1) {
        url = url.substring(0, url.lastIndexOf("#"));
    }
    var para = "";
    var retJson={};
    if (url.lastIndexOf("?") > 0) {
        para = url.substring(url.lastIndexOf("?") + 1, url.length);
        var arr = para.split("&");
        para = "";
        for (var i = 0; i < arr.length; i++) {
            retJson[arr[i].split("=")[0]]=arr[i].split("=")[1];
        }
        console.log(JSON.stringify(retJson));
    } else {
        console.log("没有参数!");
    }
    return retJson;
}

document.addEventListener('click', clickbuster.onClick, true);
clickbuster.coordinates = [];

require.config({
    baseUrl : "js",
    waitSeconds: 0,
    paths : {
        // 底层库
        'jquery' :          '../../lib/js/jquery-1.11.3.min',
        'android':          '../../lib/js/android',
        'ios' :             '../../lib/js/ios',
        'global' :         '../../lib/js/global',
        'jointem.base' :    '../../lib/js/jointem.base',
        // 子应用特有
        'subconfig' : 'config',
        'subclass'  : url
    },
    shim: {
        'jtemplates' : ['jquery']
    },
    urlArgs : "bust=" + (new Date()).getTime()
    //urlArgs : "bust=20160303"  //上线就改成这个
});


require(['global', 'subconfig'], function (config, subconfig) {

    'use restrict';

    // 将模块中的配置覆盖全局配置
    for (var prop in subconfig) {
        config[prop] = subconfig[prop];
    }

    window.config = config;
    window.dialogId = 0;

    var urlJSON = urlParameters(urlAll);
   /* if(urlJSON.ENV != null){
        config.ENV = urlJSON.ENV;
    }*/
    if (!config.debug) {
        console.log = function () {};
        console.info = function () {};
        console.error = function() {};
    }

    var bridgePath = '';
   /* if (!!config.browser) {
         bridgePath = 'browser/jointem.html5';
         config.dummy = true;
     } else {*/
         if((/android/gi).test(navigator.appVersion)) {
             bridgePath = 'android/jointem.html5';
         } else {
             bridgePath = 'ios/jointem.html5';
         }
    // }

    require([bridgePath, 'subclass'], function(jointem, subclass) {
        window.jointem = jointem;
        window.jointemHtml5 = jointem.jointemHtml5;
        window.PluginDensityUtils = jointem.PluginDensityUtils;
        //window.App = jointem.App;

       // jointem.App.overrideBackPressed(true);
        //jointem.App.setKeyEventListener(onback);

        window.Contacts = jointem.Contacts;
        new subclass().initApp();
    });
});