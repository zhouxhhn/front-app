/** 
 * @Title:  IDUtil.java
 * @author:  blanks
 * @data:  2016年6月7日 下午2:56:49 <创建时间>
 * 
 * @history：<以下是历史记录>
 *
 * @modifier: <修改人>
 * @modify date: 2016年6月7日 下午2:56:49 <修改时间>
 * @log: <修改内容>
 *
 * @modifier: <修改人>
 * @modify date: 2016年6月7日 下午2:56:49 <修改时间>
 * @log: <修改内容>
 */
package sunmi.ds.utils;


/**
 * ID生成器
 * 
 * @author longtao.li
 */
public class IDUtil {

	
	
	/**
	 * 获得一个id
	 * 
	 */
	public static synchronized long getID() {
		long id =  System.currentTimeMillis();
		return id;
	}
	
	

}
