/** 
 * @Title:  IConnectionCallback.java
 * @author:  blanks
 * @data:  2016年6月3日 下午3:15:51 <创建时间>
 * 
 * @history：<以下是历史记录>
 *
 * @modifier: <修改人>
 * @modify date: 2016年6月3日 下午3:15:51 <修改时间>
 * @log: <修改内容>
 *
 * @modifier: <修改人>
 * @modify date: 2016年6月3日 下午3:15:51 <修改时间>
 * @log: <修改内容>
 */
package sunmi.ds.callback;

/**
 * 双屏通讯连接状态的回调接口
 * 
 */
public interface IConnectionCallback {
	public enum ConnState{
		/**
		 * 链接断开
		 */
		DIS_CONN, 
		/**
		 * 与本地service链接正常
		 */
		AIDL_CONN, 
		/**
		 * 与副屏service连接正常
		 */
		VICE_SERVICE_CONN, 
		/**
		 * 与副屏APP连接正常
		 */
		VICE_APP_CONN;
	}

	void onDisConnect();

	void onConnected(ConnState state);


}
