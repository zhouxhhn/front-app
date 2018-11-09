package com.sunmi.aidl;

/** 
 * TODO<请描述这个类是干什么的> 
 * @author 郭晗 
 * @versionCode 1 <每次修改提交前+1>
 */
 
import com.sunmi.aidl.SendServiceCallback;
interface SendService {
	int sendFileToFile(in String recvPackageName,in String path,boolean isReport, long userFlag,in SendServiceCallback callback);
	int sendByteToMemory(in String recvPackageName,in byte [] data,in SendServiceCallback callback);
}