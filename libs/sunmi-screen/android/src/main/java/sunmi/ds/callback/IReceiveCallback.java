
package sunmi.ds.callback;

import sunmi.ds.data.DSData;
import sunmi.ds.data.DSFile;
import sunmi.ds.data.DSFiles;

/**
 * 接收数据时的回调接口
 * 
 * @author longtao.li
 */
public interface IReceiveCallback {


	void onReceiveData(DSData data);
	void onReceiveFile(DSFile file);
	void onReceiveFiles(DSFiles files);
	void onReceiveCMD(DSData cmd);

}
