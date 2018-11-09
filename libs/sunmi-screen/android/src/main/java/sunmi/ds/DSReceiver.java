package sunmi.ds;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.google.gson.Gson;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import sunmi.ds.callback.IConnectionCallback.ConnState;
import sunmi.ds.callback.IReceiveCallback;
import sunmi.ds.callback.QueryCallback;
import sunmi.ds.data.DSData;
import sunmi.ds.data.DSFile;
import sunmi.ds.data.DSFiles;
import sunmi.ds.data.FilesDescribe;

/**
 * 处理接收到的数据
 * Created by longtao.li on 2016/9/1.
 */
class DSReceiver {
	
	private static final String TAG = "DSReceiver";

    private Context context;

	private String sender;

    private Gson gson = new Gson();

    private DSKernel dsKernel;

    private FilesManager filesManager;

    private List<IReceiveCallback> receiveCallbackList = new ArrayList<>();//接收数据时的回调实例集合

    private Map<Long, QueryCallback> queryCallbackMap = new HashMap<>();//接收到查询结果数据包时的回调集合

    private Map<Long, DSFiles> multiFileTaskList = new HashMap<Long, DSFiles>(); //多文件任务管理集合

    private static DSReceiver mDSReceiver;

    private DSReceiver(){}

	private DSReceiver(Context context){
        this.context = context;
        filesManager = FilesManager.getInstance();
        filesManager.init(context);
    }

	public static DSReceiver getInstance(Context context){
		if(mDSReceiver==null){
			mDSReceiver = new DSReceiver(context);
		}
		return mDSReceiver;
	}

    public void setDSKernel(DSKernel dsKernel){
        this.dsKernel = dsKernel;
    }

    public void addQueryCallback(long queryId, QueryCallback callback){
        queryCallbackMap.put(queryId, callback);
    }

    public void addReceiveCallback(IReceiveCallback callback){
        if(!receiveCallbackList.contains(callback)){
        	receiveCallbackList.add(callback);
        }
    }
    
    public void removeReceiveCallback(IReceiveCallback callback){
    	receiveCallbackList.remove(callback);
    }


    public void onReceive(Intent intent){
    	Log.d(TAG, "onReceive:收到广播数据");
    	if(intent.hasExtra("sender")){
    		sender = intent.getStringExtra("sender");
    	}
        if (intent.hasExtra("data")) {
            processData(intent.getByteArrayExtra("data"));
        } else {
            processFile(intent);
        }
    }

    private void processData( byte[] data) {
        if(dsKernel == null){
            return;
        }
        try {
            Bundle bundle = new Bundle();
            Intent i = new Intent();
            String jsonString = new String(data, "utf-8");
            DSData dsData = gson.fromJson(jsonString, DSData.class);
            dsData.sender = sender;
            switch (dsData.dataType) {
                case CHECK_FILE:
                    long fileId = dsData.fileId;
                    boolean exist = filesManager.checkFileExist(fileId);
                    dsKernel.sendResult(dsData.sender, exist+"", dsData.taskId, null);
                    break;
                case PRE_FILES:
                    FilesDescribe fd = gson.fromJson(dsData.data, FilesDescribe.class);
                    DSFiles dsFiles = new DSFiles();
                    dsFiles.filesDescribe = fd;
                    dsFiles.taskId = dsData.taskId;
                    multiFileTaskList.put(dsData.taskId,dsFiles);
                    break;
                case FILE:
                    break;
                case DATA:
                    dataCallback(dsData);
                    break;
                case CMD:
                    cmdCallback(dsData);
                    break;
                case CHECK_CONN:
                    dsKernel.sendConnOK(sender);
                    break;
                case OK_CONN:
                    dsKernel.onConnStateChange(ConnState.VICE_APP_CONN);
                    break;
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

    }

    private void processFile(Intent intent) {
        String path = "";
        long userFlag = -1;
        int id = -1;
        if (intent.hasExtra("path")) {
            path = intent.getStringExtra("path");
        }
        if (intent.hasExtra("id")) {
            id = intent.getIntExtra("id", -1);
        }
        if (intent.hasExtra("userFlag")) {
            userFlag = intent.getLongExtra("userFlag", -1);
        }
        DSFile file = new DSFile();
        file.sender = sender;
        file.path = path;
        file.taskId = userFlag;

        DSFiles dsFiles = multiFileTaskList.get(userFlag);
        if(dsFiles == null){
            fileCallback(file);
        }else{
            dsFiles.addFile(file);
            FilesDescribe fd = dsFiles.filesDescribe;
            if(fd.fileCount == dsFiles.files.size()){
                dsFiles.sender = file.sender;
                fileCallback(dsFiles);
                multiFileTaskList.remove(dsFiles.taskId);
            }
        }
    }

    public void onConnectStateChange(Intent intent) {
        if(dsKernel == null) return;
        boolean isConn = intent.getBooleanExtra("connect_state", false);
        if(isConn){
            dsKernel.onConnStateChange(ConnState.VICE_SERVICE_CONN);
        }else{
            dsKernel.onConnStateChange(ConnState.DIS_CONN);
        }
    }
    
    void fileCallback(DSFile file){
        filesManager.saveFile(file);
    	if(!receiveCallbackList.isEmpty()){
    		for(IReceiveCallback callback : receiveCallbackList){
    			callback.onReceiveFile(file);
    		}
    	}
    }

    void fileCallback(DSFiles files){
        filesManager.saveFiles(files);
        if(!receiveCallbackList.isEmpty()){
            for(IReceiveCallback callback : receiveCallbackList){
                callback.onReceiveFiles(files);
            }
        }
    }
    
    void cmdCallback(DSData dataPack){
    	if(!receiveCallbackList.isEmpty()){
    		for(IReceiveCallback callback : receiveCallbackList){
    			callback.onReceiveCMD(dataPack);
    		}
    	}
    }
    
    void dataCallback(DSData dataPack){
        QueryCallback queryCallback = queryCallbackMap.get(dataPack.queryId);
        if(queryCallback != null){
            queryCallback.onReceiveData(dataPack);
            queryCallbackMap.remove(dataPack.queryId);
            return;
        }

        if(!receiveCallbackList.isEmpty()){
    		for(IReceiveCallback callback : receiveCallbackList){
    			callback.onReceiveData(dataPack);
    		}
    	}
    }


}
