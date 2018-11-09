package sunmi.ds;

/**
 * 静态常量类
 * 
 * @author blanks
 */
public class SF {

	/**
	 * 双屏通讯service包名
	 */
	public static final String DS_SERVICE_PACKAGENAME = "com.sunmi.hcservice";
	public static final String DS_SERVICE_ACTION = "com.sunmi.mainservice.CoreService";

	public static final String DS_RECEIVER_ACTION = "com.sunmi.hcservice";

	/** 副屏业务逻辑处理默认包名 **/
	public static String SUNMI_DSD_PACKNAME = "sunmi.dsd";

	/** 副屏业务逻辑处理包名 **/
	public static String DSD_PACKNAME = SUNMI_DSD_PACKNAME;

	/** 默认密钥(预留扩展) **/
	public static final String SECRET = "com.sunmi.secondary.secret";

	/** 错误 **/
	public static final int ERROR = -0x190;

	/** 参数错误 **/
	public static final int PARAMETER_ERROR = -0x200;

	/** AIDL链接断开 **/
	public static final int AIDL_ERROR = -0x201;

	/** 通信服务不存在 **/
	public static final int SERVICE_ERROR = -0x202;




	/*----------------------------------KEY常量----------------------------------------*/
	public static final String DEF_KEY = "DEF_KEY";
	
	public static final String SENDER = "SENDER";

	public static final String SET_BRIGHTNESS = "SET_BRIGHTNESS";

}
