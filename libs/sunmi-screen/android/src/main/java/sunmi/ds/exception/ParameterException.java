/** 
 * @Title:  InitException.java 
 * @author:  blanks
 * @data:  2016年5月30日 下午2:41:13 <创建时间>
 * 
 * @history：<以下是历史记录>
 *
 * @modifier: <修改人>
 * @modify date: 2016年5月30日 下午2:41:13 <修改时间>
 * @log: <修改内容>
 *
 * @modifier: <修改人>
 * @modify date: 2016年5月30日 下午2:41:13 <修改时间>
 * @log: <修改内容>
 */
package sunmi.ds.exception;

/**
 * 参数异常
 * 
 * @author blanks
 */
public class ParameterException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ParameterException() {
		super("parameterException:Parameters can't be empty, please check your parameters");
	}
}
