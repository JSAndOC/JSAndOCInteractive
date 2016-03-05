/**
 *  @file
 *  @author 张凡
 *  @date 2016/3/4
 */
#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>
//#import <UIKit/UIKit.h>

/**
 *  @class TestObject
 *  @brief 供js调用的方法类
 *  @author 张凡
 *  @date 2016/3/4
 */

@protocol TestObjectProtocol <JSExport>

- (NSString *)open:(NSString *)successCallback Contacts:(NSString *)failCallback;

- (void)tel:(NSString *)telephone;

@end

@interface TestObject : NSObject<TestObjectProtocol>

@property (strong,nonatomic) JSContext *context;

@end
