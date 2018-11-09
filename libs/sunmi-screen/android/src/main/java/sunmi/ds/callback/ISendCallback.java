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
 * 发送数据或单个文件的回调接口
 * 
 */
public interface ISendCallback {

	void onSendSuccess(long taskId);

	void onSendFail(int errorId, String errorInfo);

	void onSendProcess(long totle, long sended);


}
