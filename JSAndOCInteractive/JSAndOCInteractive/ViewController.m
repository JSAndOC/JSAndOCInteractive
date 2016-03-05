//
//  ViewController.m
//  JSAndOCInteractive
//
//  Created by apple on 16/3/4.
//  Copyright © 2016年 ZhangFan. All rights reserved.
//

#import "ViewController.h"
#import "TestObject.h"
#import <JavaScriptCore/JavaScriptCore.h>
#import "ViewControllerT.h"

@interface ViewController ()<UIWebViewDelegate>

@property (strong,nonatomic) UIWebView *myWebView;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    /// @brief JS交互准备
    [self JSInteractiveReady];
    /// @brief 注册通知中心
    [self registerNOtificationCenter];
}
#pragma mark - 注册通知
- (void)registerNOtificationCenter
{
    NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    [center addObserver:self selector:@selector(test:) name:@"update" object:nil];
}

- (void)test:(NSNotification *)sender
{
    NSLog(@"---%@",sender.userInfo[@"name"]);
    ViewControllerT *viewT = [[ViewControllerT alloc] init];
    [self.navigationController pushViewController:viewT animated:YES];
}

#pragma mark - JS交互准备
- (void)JSInteractiveReady
{
    CGSize size = self.view.frame.size;
    /// @brief 创建要打开的html文件的完整路径
    NSBundle *bundle = [NSBundle mainBundle];
    NSString *resPath = [bundle resourcePath];
    NSString *filePath = [resPath stringByAppendingPathComponent:@"test.html"];
    /// @brief 初始化一个UIWebView实例
    self.myWebView = [[UIWebView alloc] initWithFrame:CGRectMake(0, 100, size.width, size.height - 100.0)];
    /// @brief 加载指定的html文件
    [self.myWebView loadRequest:[[NSURLRequest alloc] initWithURL:[[NSURL alloc] initFileURLWithPath:filePath]]];
    self.myWebView.delegate = self;
    [self.view addSubview:self.myWebView];
}

- (void)webViewDidFinishLoad:(UIWebView *)webView
{
    NSLog(@"webView加载完成");
    JSContext *context = [webView valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"];
    TestObject *testJO = [[TestObject alloc] init];
//    testJO.context = context;
    context[@"Contacts"] = testJO;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
