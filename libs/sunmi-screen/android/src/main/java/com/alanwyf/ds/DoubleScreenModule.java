package com.alanwyf.ds;

/**
 * Created by alan on 2017/8/9.
 */

import android.os.Environment;
import android.widget.Toast;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.io.File;
import java.util.ArrayList;

import sunmi.ds.DSKernel;
import sunmi.ds.callback.IConnectionCallback;
import sunmi.ds.callback.ISendCallback;
import sunmi.ds.callback.ISendFilesCallback;
import sunmi.ds.data.DataModel;
import sunmi.ds.data.DataPacket;
import sunmi.ds.data.UPacketFactory;
import sunmi.ds.imgtext.SendRotarion;
import sunmi.ds.utils.SharedPreferencesUtil;
import sunmi.ds.video.SendPlayVideo;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;


public class DoubleScreenModule extends ReactContextBaseJavaModule {

    DSKernel mDSKernel;// SDK核心类
    DataPacket dsPacket;
    String mReceiverPackageName;
    private long taskId_sendMediaDatas;
    private long taskId_sendImgsDatas;

    public DoubleScreenModule(ReactApplicationContext reactApplicationContext){
        super(reactApplicationContext);
    }

    @Override
    public String getName() {
        return "DoubleScreen";
    }

    @ReactMethod
    public void init(final Promise promise){
        mDSKernel = DSKernel.newInstance();
        mDSKernel.init(getReactApplicationContext(), new IConnectionCallback() {// SDK链接状态回调
            @Override
            public void onDisConnect() {
            }

            @Override
            public void onConnected(final ConnState state) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        switch (state) {
                            case AIDL_CONN:
                                //与本地service的连接畅通
                                break;
                            case VICE_SERVICE_CONN:
                                //与副屏service连接畅通
                                WritableMap result = new WritableNativeMap();
                                result.putString("code", "1");
                                result.putString("msg", "success");
                                promise.resolve(result);
                                break;
                            case VICE_APP_CONN:
                                //与副屏app连接畅通
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
        });
    }
    @ReactMethod
    public void isConnected(Promise promise){
        if(mDSKernel.isConnected()){
            WritableMap result = new WritableNativeMap();
            result.putString("code", "1");
            result.putString("msg", "success");
            promise.resolve(result);
            return;
        }
        promise.reject("0", "false");
    }
    @ReactMethod
    public void getDSDPackageName(Promise promise){
        String packageName = mDSKernel.getDSDPackageName();
        if(packageName != null){
            WritableMap result = new WritableNativeMap();
            result.putString("code", "1");
            result.putString("msg", "success");
            result.putString("packageName", packageName);
            promise.resolve(result);
            mReceiverPackageName = mDSKernel.getDSDPackageName();
            return;
        }
        promise.reject("-1", "failed");
    }
    @ReactMethod
    public void sendTxtData(String json, final Promise promise){
        try{
            dsPacket = UPacketFactory.buildShowText(
                DSKernel.getDSDPackageName(), json, new ISendCallback() {
                    @Override
                    public void onSendFail(int arg0, String arg1) {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                promise.reject("-1", "failed");
                            }
                        });
                    }
                    @Override
                    public void onSendProcess(long arg0, long arg1) {}
                    @Override
                    public void onSendSuccess(long arg0) {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                WritableMap result = new WritableNativeMap();
                                result.putString("code", "1");
                                result.putString("msg", "success");
                                promise.resolve(result);
                            }
                        });
                    }
                });
            mDSKernel.sendData(dsPacket);
        }catch(Exception e){
            promise.reject("-1", "failed");
        }

    }
    @ReactMethod
    public void sendTxtMediaData(final String json, final String mediaName, final String taskId, final Promise promise){
        taskId_sendMediaDatas = SharedPreferencesUtil.getLong(getReactApplicationContext(), taskId);
        if(taskId_sendMediaDatas!=-1L){
            sendMediaListCMD(taskId_sendMediaDatas,json, promise);
            return;
        }
        String path = Environment.getExternalStorageDirectory().getPath() + "/" + mediaName;
        File file2 = new File(path);
        if (!file2.exists()) {
            promise.reject("0", "file does not exist!");
            return;
        }
        long sendTextImgTaskId;
        sendTextImgTaskId = mDSKernel.sendFile(DSKernel.getDSDPackageName(), path, new ISendCallback() {
            @Override
            public void onSendFail(int arg0, String arg1) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        promise.reject("-1", "failed");
                    }
                });
            }
            @Override
            public void onSendProcess(final long total, final long send) {
//                runOnUiThread(new Runnable() {
//                    @Override
//                    public void run() {
//                        WritableMap result = new WritableNativeMap();
//                        result.putString("code", "2");
//                        result.putString("msg", "process");
//                        result.putString("total", total+"");
//                        result.putString("send", send+"");
//                        promise.resolve(result);
//                    }
//                });
            }
            @Override
            public void onSendSuccess(final long fileid) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        SharedPreferencesUtil.put(getReactApplicationContext(), taskId, fileid);
                        sendMediaListCMD(taskId_sendMediaDatas,json, promise);
                    }
                });
            }
        });
    }
    @ReactMethod
    public void sendImgs(final String json, ReadableArray imgs, final String taskId, final Promise promise){
        taskId_sendImgsDatas = SharedPreferencesUtil.getLong(getReactApplicationContext(), taskId);
        if(taskId_sendImgsDatas!=-1L){
            // Toast.makeText(getReactApplicationContext(), taskId_sendImgsDatas+"已存在", Toast.LENGTH_SHORT).show();
            sendMediaListCMD(taskId_sendImgsDatas,json, promise);
            return;
        }
        ArrayList imgNames = imgs.toArrayList();
        for(int i=0;i<imgNames.size();i++){
            String imgName = Environment.getExternalStorageDirectory().getPath() + "/" + imgNames.get(i);
            File file = new File(imgName);
            if (!file.exists()) {
                promise.reject("0", "file does not exist!");
                return;
            }
            imgNames.set(i, imgName);
        }
        mDSKernel.sendFiles(DSKernel.getDSDPackageName(), json, imgNames, new ISendFilesCallback() {
            @Override
            public void onAllSendSuccess(final long fileid) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        SharedPreferencesUtil.put(getReactApplicationContext(), taskId, fileid);
                        sendMediaListCMD(fileid, json, promise);
                    }
                });
            }

            @Override
            public void onSendSuccess(String path, long taskId) {
            }

            @Override
            public void onSendFaile(int errorId, String errorInfo) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        promise.reject("-1", "failed");
                    }
                });
            }

            @Override
            public void onSendFileFaile(String path, int errorId, String errorInfo) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        promise.reject("-1", "failed");
                    }
                });
            }

            @Override
            public void onSendProcess(final String path, final long total, final long send) {
//                runOnUiThread(new Runnable() {
//                    @Override
//                    public void run() {
//                        WritableMap result = new WritableNativeMap();
//                        result.putString("code", "2");
//                        result.putString("msg", "process");
//                        result.putString("total", total+"");
//                        result.putString("send", send+"");
//                        promise.resolve(result);
//                    }
//                });
            }
        });
    }

    private void sendMediaListCMD(final long fileid, final String json, final Promise promise){
        mDSKernel.sendCMD(DSKernel.getDSDPackageName(), json, fileid, new ISendCallback() {
            @Override
            public void onSendFail(int arg0, String arg1) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        promise.reject("-1", "failed");
                    }
                });
            }
            @Override
            public void onSendProcess(final long total, final long send) {
//                runOnUiThread(new Runnable() {
//                    @Override
//                    public void run() {
//                        WritableMap result = new WritableNativeMap();
//                        result.putString("code", "2");
//                        result.putString("msg", "process");
//                        result.putString("total", total+"");
//                        result.putString("send", send+"");
//                        promise.resolve(result);
//                    }
//                });
            }
            @Override
            public void onSendSuccess(long arg0) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        WritableMap result = new WritableNativeMap();
                        result.putString("code", "1");
                        result.putString("msg", "success");
                        promise.resolve(result);
                    }
                });
            }
        });
    }

    @ReactMethod
    public void playVideo(final String mediaName, String taskId, final Promise promise){
        String path = Environment.getExternalStorageDirectory().getPath() + "/" + mediaName;
        File file2 = new File(path);
        if (!file2.exists()) {
            promise.reject("0", "file does not exist!");
            return;
        }
        SendPlayVideo sendPlayVideo = new SendPlayVideo(getReactApplicationContext(), mDSKernel, taskId, new SendPlayVideo.ISendCallback() {
            @Override
            public void onSendProcess(final long total, final long send) {
//                runOnUiThread(new Runnable() {
//                    @Override
//                    public void run() {
//                        WritableMap result = new WritableNativeMap();
//                        result.putString("code", "2");
//                        result.putString("msg", "process");
//                        result.putString("total", total+"");
//                        result.putString("send", send+"");
//                        promise.resolve(result);
//                    }
//                });
            }

            @Override
            public void onSendFail(int i, String s) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        promise.reject("-1", "failed");
                    }
                });
            }

            @Override
            public void onSendSuccess(long l) {
            }
        }, new SendPlayVideo.PlayIng() {
            @Override
            public void playing() {
                WritableMap result = new WritableNativeMap();
                result.putString("code", "1");
                result.putString("msg", "success");
                promise.resolve(result);
            }
        });
        sendPlayVideo.sendVideoFile(path);
    }
    @ReactMethod
    public void sendImgsCarousel(Promise promise){
        SendRotarion sendRotarion = SendRotarion.getInstance(getReactApplicationContext(),mDSKernel);
        sendRotarion.sendRotarion(getCurrentActivity(), promise);
    }
}
