
package sunmi.ds;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.RemoteException;
import android.text.TextUtils;
import android.util.Log;

import com.google.gson.Gson;
import com.sunmi.aidl.SendService;
import com.sunmi.aidl.SendServiceCallback;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import sunmi.ds.callback.ICheckFileCallback;
import sunmi.ds.callback.IConnectionCallback;
import sunmi.ds.callback.IConnectionCallback.ConnState;
import sunmi.ds.callback.IReceiveCallback;
import sunmi.ds.callback.ISendCallback;
import sunmi.ds.callback.ISendFilesCallback;
import sunmi.ds.callback.QueryCallback;
import sunmi.ds.data.DSData;
import sunmi.ds.data.DataPacket;
import sunmi.ds.data.FilesDescribe;
import sunmi.ds.exception.ParameterException;
import sunmi.ds.utils.ProcessUtils;

/**
 * SDK core class。
 * (译：SDK核心类。)
 */
public class DSKernel {

	private static final String TAG = "DSKernel";
	private SendService mService;

	private static DSKernel mInstance = new DSKernel();

	private Context mCtx;

	private boolean isConnected = false;

	// 连接状态回调接口list
	private List<IConnectionCallback> mConnCallbackList = new ArrayList<IConnectionCallback>();

	private Gson gson = new Gson();

	private Root root = new Root();//root apk 包名容器
	
	private DSReceiver mDSReceiver;//处理接收到的数据

	private DSKernel() {
	}

	/**
	 * instantiation DSKernel.
	 * (译：实例化DSKernel类的静态函数。)
	 * @return
     */
	public static DSKernel newInstance() {
		if(mInstance == null){
			mInstance = new DSKernel();
		}
		return mInstance;
	}
	
	/**
	 * get vice screen app package name
	 * (译：获取副屏接收数据的app包名。)
	 * @return
	 */
	public static String getDSDPackageName(){
		return SF.DSD_PACKNAME;
	}


	/**
	 * instantiation SDK
	 * (译：初始化SDK)
	 *
	 * @param stateCallback
	 *            {@link IConnectionCallback}} 连接状态回调
	 * @param vicePackageName vice screen app package name, if null then use def vice screen app
	 * (译：副屏接收数据的app包名，传null或空字符串则默认接收数据的app为Sunmi的副屏默认App。)
	 * 
	 *
	 * @param contetx
	 */
	public void init(Context contetx, IConnectionCallback stateCallback, String vicePackageName) {
		if(!TextUtils.isEmpty(vicePackageName))
			SF.DSD_PACKNAME = vicePackageName;
		init(contetx, stateCallback);
	}


	/**
	 * 初始化SDK.
	 * 
	 * @param stateCallback
	 *            {@link IConnectionCallback}} 连接状态回调
	 * 
	 * @param contetx
	 */
	public void init(Context contetx, IConnectionCallback stateCallback) {
		if(stateCallback==null){
			throw new ParameterException();
		}
		mCtx = contetx;
		initDSReceiver();
		addConnCallback(stateCallback);
		doBind();
	}

	void initDSReceiver(){
		mDSReceiver = DSReceiver.getInstance(mCtx);
		mDSReceiver.setDSKernel(this);
	}

	/**
	 * 双屏连接是否畅通
	 * @return
     */
	public boolean isConnected(){
		return isConnected;
	}

	/**
	 * 注册数据接收回调
	 * @param receiveCallback
     */
	public void addReceiveCallback(IReceiveCallback receiveCallback){
		mDSReceiver.addReceiveCallback(receiveCallback);
	}
	
	/**
	 * 注销数据接收回调
	 * @param receiveCallback
     */
	public void removeReceiveCallback(IReceiveCallback receiveCallback){
		mDSReceiver.removeReceiveCallback(receiveCallback);
	}
	
    public void addConnCallback(IConnectionCallback callback){
        if(!mConnCallbackList.contains(callback)){
        	mConnCallbackList.add(callback);
        }
    }
    
    public void removeConnCallback(IConnectionCallback callback){
    	mConnCallbackList.remove(callback);
    }


	/**
	 * 销毁持有的引用,断开连接
	 * 需要重新调用newInstance()、init()函数重新初始化
	 */
	public void onDestroy() {
		mCtx.unbindService(mConnection);
		mConnection = null;
		mDSReceiver = null;
		mConnCallbackList.clear();
		mInstance = null;
	}

	private ServiceConnection mConnection = new ServiceConnection() {
		@Override
        public void onServiceDisconnected(ComponentName name) {
			mService = null;
			onConnStateChange(ConnState.DIS_CONN);
			mService = null;
		}
		@Override
        public void onServiceConnected(ComponentName name, IBinder service) {
			mService = (SendService) SendService.Stub.asInterface(service);
			onConnStateChange(ConnState.AIDL_CONN);
			checkConnection();
		}
	};

	/**
	 * 发送CMD命令包，可指定要使用的缓存文件id
	 * @param recePackageName
	 * @param dataJson
	 * @param fileId 如果没有则传0
	 * @param callback
     */
	public void sendCMD(String recePackageName, String dataJson, long fileId, ISendCallback callback){
		DataPacket dataPacket = PacketFactory.buildCMDPack(recePackageName, dataJson, fileId, callback);
		sendData(dataPacket);
	}

	/**
	 * 发送CMD命令包，可指定要使用的缓存文件id
	 *  @param dataPacket 数据包
	 */
	public void sendCMD(DataPacket dataPacket){
		sendData(dataPacket);
	}


	/**
	 * 发送数据
	 * @param dataPacket 数据包
     */
	public void sendData(DataPacket dataPacket) {
		if(!checkParametes(dataPacket)){
			return;
		}
		try {
			dispatchData(dataPacket);
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException("illegal params: data!");
		}
	}


	/**
	 * 发送数据，向副屏发送查询数据包时使用。
	 * 举例：在用户协议层，主屏向副屏发送一个表示查询副屏亮度的Query数据包，
	 * 副屏App收到后获取亮度再调用sendResult(long queryId)函数向主屏发回一个携带亮度的结果数据包，此Result数据包的queryId必须与Query数据包的taskId一致
	 * 主屏才能识别到是之前的查询结果。
	 * 注意：使用QueryCallback接收结果数据包时，通过addReceiveCallback()注册的回调实例将不会被调用。
	 * @param recePackageName 接收端包名
	 * @param queryStr  要携带的字符串数据
	 * @param sendCallback 发送结果回调
	 * @param callback 查询结果回调
     */
	public void sendQuery(String recePackageName, String queryStr, ISendCallback sendCallback, QueryCallback callback) {
		DataPacket pack = PacketFactory.buildQueryPack(recePackageName, queryStr, sendCallback);
		if( callback == null ){
			throw new ParameterException();
		}
		if(!checkParametes(pack)){
			return;
		}
		mDSReceiver.addQueryCallback(pack.getTaskId(), callback);
		sendData(pack);
	}

	/**
	 * 发送数据，向副屏发送查询数据包时使用。
	 * 举例：在用户协议层，主屏向副屏发送一个表示查询副屏亮度的Query数据包，
	 * 副屏App收到后获取亮度再调用sendResult(long queryId)函数向主屏发回一个携带亮度的结果数据包，此Result数据包的queryId必须与Query数据包的taskId一致
	 * 主屏才能识别到是之前的查询结果。
	 * 注意：使用QueryCallback接收结果数据包时，通过addReceiveCallback()注册的回调实例将不会被调用。
	 * @param pack 数据包
	 * @param callback 查询结果回调
	 */
	public void sendQuery(DataPacket pack, QueryCallback callback) {
		if( callback == null ){
			throw new ParameterException();
		}
		if(!checkParametes(pack)){
			return;
		}
		mDSReceiver.addQueryCallback(pack.getTaskId(), callback);
		sendData(pack);
	}

	/**
	 * 发送Result数据包
	 * @param recePackageName 接收端APP包名
	 * @param resultStr 查询结果
	 * @param queryId Query数据包的taskId
	 * @param sendCallback 发送回调
     */
	public void sendResult(String recePackageName, String resultStr, long queryId, ISendCallback sendCallback) {
		DataPacket pack = PacketFactory.buildResultPack(recePackageName, resultStr, queryId, sendCallback);
		sendData(pack);
	}

	//相关参数校验
	private boolean checkParametes(DataPacket mPack){
		boolean isOK = true;
		if(mCtx == null){
			throw new RuntimeException("SDK not initialized, call init() method to initialize.");
		}
		if(!root.isRoot(mCtx.getPackageName())){
			//非root权限apk 要检查APP是否在主屏前台，不再前台的APK不允许向副屏发送数据
			boolean isforegroundApp = ProcessUtils.isForegroundAppFor21(mCtx, mCtx.getPackageName());
			if(!isforegroundApp){
				Log.d(TAG, "当前app不再前台不允许向副屏发送数据");
				isOK = false;
			}
		}
		if (verifyParameter(mPack) == false) {// 参数验证
			// 参数错误,抛出异常
			throw new ParameterException();
		}
		return isOK;
	}

	/**
	 * 发送文件
	 * @param recePackName
	 * @param filePath
	 * @param callback
	 * @return taskId
     */
	public long sendFile(String recePackName, String filePath, ISendCallback callback) {
		DataPacket dsPack = PacketFactory.buildFilePacket(recePackName, filePath, callback);
		sendData(dsPack);
		return dsPack.getData().taskId;
	}

	/**
	 * 发送文件 指定taskId
	 * @param taskId
	 * @param recePackName
	 * @param filePath
	 * @param callback
	 * @return
     */
	public long sendFile(long taskId, String recePackName, String filePath, ISendCallback callback) {
		DataPacket dsPack = PacketFactory.buildFilePacket(taskId, recePackName, filePath, callback);
		sendData(dsPack);
		return dsPack.getData().taskId;
	}

	/**
	 * 发送一个文件+String类型的数据
	 * @param recePackName
	 * @param msg
	 * @param filePath
	 * @param callback
	 * @return
     */
	public long sendFile(final String recePackName, String msg, final String filePath, final ISendCallback callback) {
		FilesDescribe fd = new FilesDescribe();
		fd.msg = msg;
		fd.fileCount = 1;
		String json = gson.toJson(fd);
		DataPacket dsPack = PacketFactory.buildPreFilePacket(recePackName, json, new ISendCallback() {
			@Override
			public void onSendSuccess(long taskId) {
					sendFile(taskId, recePackName, filePath, callback);
			}
			@Override
			public void onSendFail(int errorId, String errorInfo) {
				callback.onSendFail(SF.ERROR, "msg 发送失败错误");
			}
			@Override
			public void onSendProcess(long totle, long sended) {}
		});
		sendData(dsPack);

		return dsPack.getTaskId();
	}


	/**
	 * 发送多个文件+String类型的数据
	 * @param recePackName
	 * @param msg
	 * @param files
	 * @param callback
	 * @return
     */
	public long sendFiles(String recePackName, String msg, List<String> files, ISendFilesCallback callback) {
		FilesDescribe fd = new FilesDescribe();
		fd.msg = msg;
		fd.fileCount = files.size();
		String json = gson.toJson(fd);
		SendFilesHandler handler = new SendFilesHandler(this, files, recePackName, callback);
		DataPacket dsPack = PacketFactory.buildPreFilePacket(recePackName, json, handler);
		sendData(dsPack);
		return dsPack.getTaskId();
	}

	/**
	 * 检查fileId对应的文件在副屏是否存在
	 * @param fileId
	 * @param callback
     */
	public void checkFileExist(long fileId, final ICheckFileCallback callback){
		DataPacket pack = PacketFactory.buildPack(SF.DSD_PACKNAME, DSData.DataType.CHECK_FILE, "def", new ISendCallback() {
			@Override
			public void onSendSuccess(long taskId) {
			}
			@Override
			public void onSendFail(int errorId, String errorInfo) {
				callback.onCheckFail();
			}
			@Override
			public void onSendProcess(long totle, long sended) {
			}
		});
		pack.getData().fileId = fileId;
		sendQuery(pack, new QueryCallback() {
			@Override
			public void onReceiveData(DSData data) {
				boolean exist = TextUtils.equals("true", data.data);
				callback.onResult(exist);
			}
		});
	}


	void sendConnOK(String sender) {
		DataPacket dsPacket = PacketFactory.buildConnectionOK(sender);
		sendData(dsPacket);
	}

	/**
	 * check vice screen connection
	 * （译：检测与副屏的连接状态，有结果会回调注册的IConnectionCallback）
	 */
	public void checkConnection() {
		if(mService == null){
			doBind();
			return;
		}
		DataPacket dsPack = PacketFactory.buildCheckConnection(mCtx.getPackageName(), new ISendCallback() {
			@Override
            public void onSendSuccess(long taskId) {
				onConnStateChange(ConnState.VICE_SERVICE_CONN);
			}
			@Override
            public void onSendFail(int errorId, String errorInfo) {
				Log.e(TAG, "checkConnection() onSendFail: errId:"+ errorId +" errorInfo:"+errorInfo);
			}
			@Override
            public void onSendProcess(long totle, long sended) {}
		});
		sendData(dsPack);

	}

	/**
	 * 数据分发处理
	 * 
	 * @param mPack
	 */
	private void dispatchData(DataPacket mPack) throws UnsupportedEncodingException {
		final ISendCallback callback = mPack.getCallback();
		final DSData data = mPack.getData();
		if (mService != null) {
			switch (data.getDataType()) {
				case FILE:
					// sendFile
					sendFile(mPack);
					break;

				case CHECK_FILE:
				case CHECK_CONN:
				case OK_CONN:
				case CMD:
				case DATA:
				case PRE_FILES:
					// 内存到内存
					sendMemoryData(mPack);
					break;
				default:
					break;
			}
		} else {
			if(callback!=null)
				callback.onSendFail(SF.SERVICE_ERROR, "本地通信服务未连接成功,请检查本地是否存在双屏通信服务,或者稍后再试");
		}
	}


	/**
	 * 发送内存数据包
	 * @param mPack
	 * @throws UnsupportedEncodingException
     */
	private void sendMemoryData(DataPacket mPack) throws UnsupportedEncodingException {
		final ISendCallback callback = mPack.getCallback();
		final DSData data = mPack.getData();
		try {
            String dataJson = gson.toJson(data);
            mService.sendByteToMemory(mPack.getRecPackageName(), dataJson.getBytes("utf-8"),
                    new SendServiceCallback.Stub() {

                        @Override
                        public void sendSuccess(int id) throws RemoteException {
                            Log.d(TAG, "文字信息发送成功");
                            if (callback != null)
                                callback.onSendSuccess(data.taskId);
                        }

                        @Override
                        public void sendProcess(int id, long totle, long sended) throws RemoteException {

						}

                        @Override
                        public void sendError(int id, int errorId, String errorInfo) throws RemoteException {
                            Log.e(TAG, "文字信息发送失败:" + "errorId:"+errorId+" errorInfo:"+errorInfo);
                            if (callback != null)
                                callback.onSendFail(errorId, errorInfo);
                        }
                    });
        } catch (RemoteException e) {
            e.printStackTrace();
            if (callback != null)
                callback.onSendFail(SF.AIDL_ERROR, "AIDL异常");
			onConnStateChange(ConnState.DIS_CONN);
        }
	}

	/**
	 * 发送文件数据
	 * @param mPack
     */
	private void sendFile(DataPacket mPack) {
		final ISendCallback callback = mPack.getCallback();
		final DSData data = mPack.getData();
		try {
            mService.sendFileToFile(mPack.getRecPackageName(), data.data, mPack.isReport(),
                    data.taskId, new SendServiceCallback.Stub() {
                        @Override
                        public void sendSuccess(int id) throws RemoteException {
                            if (callback != null) {
                                callback.onSendSuccess(data.taskId);
                            }
                        }

                        @Override
                        public void sendProcess(int id, long totle, long sended) throws RemoteException {
                            if (callback != null)
                                callback.onSendProcess(totle, sended);
                        }

                        @Override
                        public void sendError(int id, int errorId, String errorInfo) throws RemoteException {
                        	Log.e(TAG, "文件发送失败:" + "errorId:"+errorId+" errorInfo:"+errorInfo);
                            if (callback != null)
                                callback.onSendFail(errorId, errorInfo);
                        }
                    });
        } catch (RemoteException e) {
            e.printStackTrace();
            if (callback != null)
                callback.onSendFail(SF.AIDL_ERROR, "AIDL异常");
			onConnStateChange(ConnState.DIS_CONN);
        }
	}


	/**
	 * 绑定副屏通信进程
	 */
	private void doBind() {
		try {
			Intent i = new Intent();
			i.setAction(SF.DS_SERVICE_ACTION);
			i.setPackage(SF.DS_SERVICE_PACKAGENAME);
			mCtx.startService(i);
			mCtx.bindService(i, mConnection, Context.BIND_AUTO_CREATE);
		} catch (Exception e1) {
			e1.printStackTrace();
			mService = null;
		}
	}

	/**
	 * 参数验证
	 * 
	 * @param dsPack
	 * @return
	 */
	private boolean verifyParameter(DataPacket dsPack) {
		boolean flag = true;
		if (dsPack == null) {
			flag = false;
		}
		if(mConnCallbackList.isEmpty()){
			Log.e(TAG, "connCallbackList.isEmpty()!");
			flag = false;
		}
		ISendCallback callback = dsPack.getCallback();
		if (TextUtils.isEmpty(dsPack.getRecPackageName())) {
			if (callback != null)
				callback.onSendFail(SF.PARAMETER_ERROR, "RecPackName isEmpty");
			flag = false;
		}
		if (TextUtils.isEmpty(dsPack.getDataContent())) {
			if (callback != null)
				callback.onSendFail(SF.PARAMETER_ERROR, "DataPacket isEmpty");
			flag = false;
		}
		if(dsPack.getDataType()==null){
			if (callback != null)
				callback.onSendFail(SF.PARAMETER_ERROR, "dataType == null");
			flag = false;
		}
		return flag;
	}
	
	public void onConnStateChange(ConnState state){
		if(mConnCallbackList.isEmpty())return;

		switch (state) {
		case DIS_CONN:
			this.isConnected = false;
			for(IConnectionCallback callback : mConnCallbackList){
				callback.onDisConnect();
			}
			break;
		case AIDL_CONN:
			this.isConnected = false;
			for(IConnectionCallback callback : mConnCallbackList){
				callback.onConnected(state);
			}
			break;
		case VICE_SERVICE_CONN:
			this.isConnected = true;
			for(IConnectionCallback callback : mConnCallbackList){
				callback.onConnected(state);
			}
			break;
		case VICE_APP_CONN:
			this.isConnected = true;
			for(IConnectionCallback callback : mConnCallbackList){
				callback.onConnected(state);
			}
			break;

		default:
			break;
		}
	}
}
