/** 
 * @Title:  PacketFactory.java
 * @author:  blanks
 * @data:  2016年6月2日 下午3:24:09 <创建时间>
 * 
 * @history：<以下是历史记录>
 *
 * @modifier: <修改人>
 * @modify date: 2016年6月2日 下午3:24:09 <修改时间>
 * @log: <修改内容>
 *
 * @modifier: <修改人>
 * @modify date: 2016年6月2日 下午3:24:09 <修改时间>
 * @log: <修改内容>
 */
package sunmi.ds;

import org.json.JSONException;
import org.json.JSONObject;

import sunmi.ds.callback.ISendCallback;
import sunmi.ds.data.DSData;
import sunmi.ds.data.DataPacket;

/**
 * 发送包工厂类
 * @author longtao.li
 */
class PacketFactory {

	/**
	 * build一个Result数据包
	 * @param recePackageName
	 * @param result
	 * @param queryId
	 * @param callback
     * @return
     */
	public static DataPacket buildResultPack(String recePackageName, String result, long queryId, ISendCallback callback) {
		return new DataPacket.Builder(DSData.DataType.DATA).data(result).queryId(queryId).
				recPackName(recePackageName).addCallback(callback).isReport(true).build();
	}

	/**
	 * build一个Query数据包
	 * @param recePackageName
	 * @param queryJson
	 * @param callback
     * @return
     */
	public static DataPacket buildQueryPack(String recePackageName, String queryJson, ISendCallback callback) {
		return new DataPacket.Builder(DSData.DataType.DATA).data(queryJson).
				recPackName(recePackageName).addCallback(callback).isReport(true).build();
	}


	/**
	 * build一个CMD数据包，指定要使用的缓存文件Id
	 *
	 * @param callback
	 * @return
	 */
	public static DataPacket buildCMDPack(String recePackageName, String dataJson, long fileId, ISendCallback callback) {
		return new DataPacket.Builder(DSData.DataType.CMD).data(dataJson).fileId(fileId).
				recPackName(recePackageName).addCallback(callback).isReport(true).build();
	}

	/**
	 * build一个数据包
	 *
	 * @param callback
	 * @return
	 */
	public static DataPacket buildPack(String recePackageName, DSData.DataType dataType, String dataJson, ISendCallback callback) {
		return new DataPacket.Builder(dataType).data(dataJson).
				recPackName(recePackageName).addCallback(callback).isReport(true).build();
	}

	/**
	 * build一个文件传输的前置包
	 *
	 * @param callback
	 * @return
	 */
	public static DataPacket buildPreFilePacket(String recePackageName, String json, ISendCallback callback) {
		return new DataPacket.Builder(DSData.DataType.PRE_FILES).data(json).
				recPackName(recePackageName).addCallback(callback).isReport(true).build();
	}

	/**
	 * build一个文件传输的数据包
	 *
	 * @param callback
	 * @return
	 */
	public static DataPacket buildFilePacket(String recePackageName, String filePath, ISendCallback callback) {
		return new DataPacket.Builder(DSData.DataType.FILE).data(filePath).
				recPackName(recePackageName).addCallback(callback).isReport(true).build();
	}

	/**
	 * build一个文件传输的数据包,指定taskId
	 *
	 * @param callback
	 * @return
	 */
	public static DataPacket buildFilePacket(long taskId, String recePackageName, String filePath, ISendCallback callback) {
		return new DataPacket.Builder(DSData.DataType.FILE).data(filePath).taskId(taskId).
				recPackName(recePackageName).addCallback(callback).isReport(true).build();
	}


	/**
	 * build一个检查链接状态的数据包
	 *
	 * @return
	 */
	public static DataPacket buildCheckConnection(String sender, ISendCallback callback) {
		DataPacket dsPacket = new DataPacket.Builder(DSData.DataType.CHECK_CONN).data(sender).
		recPackName(SF.DSD_PACKNAME).addCallback(callback).isReport(true).build();
		return dsPacket;
	}

	/**
	 * build一个链接状态OK的数据包
	 *
	 * @return
	 */
	public static DataPacket buildConnectionOK(String recePackName) {
		String json = createJson(SF.DEF_KEY, "def-value");
		return new DataPacket.Builder(DSData.DataType.OK_CONN).data(json).
				recPackName(recePackName).isReport(true).build();
	}




	static String createJson(String key, Object value){
		JSONObject json = new JSONObject();
		try {
			json.put(key, value);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return json.toString();
	}

	static String createJson(String key, int value){
		JSONObject json = new JSONObject();
		try {
			json.put(key, value);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return json.toString();
	}



}
