package com.sunmi.aidl;

/** 
 * TODO<请描述这个类是干什么的> 
 * @author 郭晗 
 * @versionCode 1 <每次修改提交前+1>
 */
interface SendServiceCallback {
	oneway void sendSuccess(int id);
	oneway void sendError(int id,int  errorId, String errorInfo);
	oneway void sendProcess(int id, long totle, long sended);
}
