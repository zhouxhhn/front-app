
package sunmi.ds.callback;

import sunmi.ds.data.DSData;
import sunmi.ds.data.DSFile;
import sunmi.ds.data.DSFiles;

/**
 * 接收到查询结果数据包时的回调
 * 
 * @author longtao.li
 */
public abstract class QueryCallback implements IReceiveCallback {

	public abstract void onReceiveData(DSData data);
	public void onReceiveFile(DSFile file){}
	public void onReceiveFiles(DSFiles files){}
	public void onReceiveCMD(DSData cmd){}

}
