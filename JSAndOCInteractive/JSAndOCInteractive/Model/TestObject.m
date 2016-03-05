//
//  TestObject.m
//  JSAndOCInteractive
//
//  Created by apple on 16/3/4.
//  Copyright © 2016年 ZhangFan. All rights reserved.
//

#import "TestObject.h"

@implementation TestObject

- (NSString *)open:(NSString *)successCallback Contacts:(NSString *)failCallback
{
    NSLog(@"-------123+++++%@",successCallback);
    /// @brief currentContext得到当前上下文(获取到当前的JSContext对象)
    self.context = [JSContext currentContext];
    
    [self.context evaluateScript:[NSString stringWithFormat:@"successCallback('%@')",@"{\"number\" : \"1230000\"}"]];
    NSDictionary *dict = @{@"name":@"zhangsan"};
    NSNotification *notice = [NSNotification notificationWithName:@"update" object:nil userInfo:dict];
    [[NSNotificationCenter defaultCenter] postNotification:notice];
    
    return [NSString stringWithFormat:@"success"];
}

- (void)tel:(NSString *)telephone
{
    NSLog(@"phone: %@",telephone);
}

@end
