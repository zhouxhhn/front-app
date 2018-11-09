package sunmi.ds.data;


import java.io.Serializable;

/**
 * Created by longtao.li on 2016/9/2.
 */
public class DSFile implements Serializable {

	/**
	 * 发送端app包名
	 */
	public String sender;

	/**
	 * 路径
	 */
	public String path;

	// public int id;// 预留

	public long taskId;

}
