/** 
 * @Title:  ISendCallback.java
 * @author:  blanks
 * @data:  2016年6月1日 下午5:04:36 <创建时间>
 * 
 * @history：<以下是历史记录>
 *
 * @modifier: <修改人>
 * @modify date: 2016年6月1日 下午5:04:36 <修改时间>
 * @log: <修改内容>
 *
 * @modifier: <修改人>
 * @modify date: 2016年6月1日 下午5:04:36 <修改时间>
 * @log: <修改内容>
 */
package sunmi.ds.callback;

/**
 * 发送多文件的回调
 * 
 * @author longtao.li
 */
public interface ISendFilesCallback {

	void onAllSendSuccess(long fileid);

	void onSendSuccess(String path, long taskId);

	/**
	 * 发送msg失败回调
	 * @param errorId
	 * @param errorInfo
     */
	void onSendFaile(int errorId, String errorInfo);

	/**
	 * 发送某个文件失败回调
	 * @param path
	 * @param errorId
	 * @param errorInfo
     */
	void onSendFileFaile(String path, int errorId, String errorInfo);

	/**
	 * 发送多文件时的回调
	 * @param path
	 * @param totle
	 * @param sended
     */
	void onSendProcess(String path, long totle, long sended);


}
