/** 
 * @Title:  DSPacket.java
 * @author:  blanks
 * @data:  2016年6月1日 下午5:16:51 <创建时间>
 * 
 * @history：<以下是历史记录>
 *
 * @modifier: <修改人>
 * @modify date: 2016年6月1日 下午5:16:51 <修改时间>
 * @log: <修改内容>
 *
 * @modifier: <修改人>
 * @modify date: 2016年6月1日 下午5:16:51 <修改时间>
 * @log: <修改内容>
 */
package sunmi.ds.data;

import sunmi.ds.DSKernel;
import sunmi.ds.callback.ISendCallback;

/**
 * 双屏通信数据打包类
 */
public class DataPacket {

	private ISendCallback callback;
	private String recPackageName = DSKernel.getDSDPackageName();
	private DSData data;
	private boolean isReport = false;//是否需要进度回调

	/**
	 * @return the callback
	 */
	public ISendCallback getCallback() {
		return callback;
	}

	/**
	 * @return the recPackageName
	 */
	public String getRecPackageName() {
		return recPackageName;
	}

	/**
	 * get data content
	 * @return
     */
	public String getDataContent(){
		return data.data;
	}

	/**
	 * @return the data
	 */
	public DSData getData() {
		return data;
	}

	/**
	 * @param data
	 *            the data to set
	 */
	public void setData(DSData data) {
		this.data = data;
	}

	/**
	 * @return the isReport
	 */
	public boolean isReport() {
		return isReport;
	}

	/**
	 * @return the mType
	 */
	public DSData.DataType getDataType() {
		return data.dataType;
	}

	/**
	 *
	 * @return
     */
	public long getTaskId(){
		return data.taskId;
	}


	public long getFileId(){
		return data.fileId;
	}

	public long getQueryId(){ return data.queryId; }


	public static class Builder {
		private ISendCallback callback ;
		private String recPackageName;
		private DSData data = new DSData();
		private boolean isReport;

		public Builder(DSData.DataType dataType) {
			this.data.dataType = dataType;
		}

		public Builder recPackName(String recPackName) {
			this.recPackageName = recPackName;
			return this;
		}

		public Builder data(String data) {
			this.data.data = data;
			return this;
		}

		public Builder taskId(long taskId){
			this.data.taskId = taskId;
			return this;
		}

		public Builder fileId(long fileId){
			this.data.fileId = fileId;
			return this;
		}

		public Builder queryId(long queryId){
			this.data.queryId = queryId;
			return this;
		}

		public Builder isReport(boolean isReport) {
			this.isReport = isReport;
			return this;
		}

		public Builder addCallback(ISendCallback callback) {
			this.callback = callback;
			return this;
		}

		public DataPacket build() {
			DataPacket packet = new DataPacket(this);
			return packet;
		}
	}

	private DataPacket(Builder b) {
		callback = b.callback;
		recPackageName = b.recPackageName;
		data = b.data;
		isReport = b.isReport;
	}


}
