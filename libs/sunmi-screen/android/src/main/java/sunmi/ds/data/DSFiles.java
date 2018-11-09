package sunmi.ds.data;


import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by longtao.li on 2016/9/2.
 */
public class DSFiles implements Serializable {

	public FilesDescribe filesDescribe;

	/**
	 * 发送端app包名
	 */
	public String sender;

	/**
	 * 路径
	 */
	public List<DSFile> files = new ArrayList<DSFile>();

	/**
	 *
	 */
	public long taskId;

	public void addFile(DSFile file){
		if(!files.contains(file)){
			files.add(file);
		}
	}

}
