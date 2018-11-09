package sunmi.ds.data;


import sunmi.ds.utils.IDUtil;

/**
 * Created by longtao.li on 2016/9/1.
 * 双屏通信的数据包
 */
public class DSData {
	
	/**
	 * 发送端app包名
	 */
	public String sender;

    /**
     * 任务ID
     */
    public long taskId = IDUtil.getID();

    /**
     * 数据类型
     */
    public DataType dataType;

    /**
     * 要发送的数据
     */
    public String data;

    /**
     * 缓存文件Id
     */
    public long fileId;

    /**
     * 查询任务Id
     */
    public long queryId;


    /**
     * get data type
     * @return
     */
    public DataType getDataType(){ return dataType; }


    /**
     * 数据类型
     */
    public enum DataType{
        DATA(0x100),//数据
        FILE(0x200),//文件
        CMD(0x300),//命令
        CHECK_CONN(0x400), //检查链接
        OK_CONN(0x401),//链接OK
        PRE_FILES(0x402),//多个FILE 的前置包
        CHECK_FILE(0x403),//检查文件是否存在与副屏
        ;

        /**
         * 类型code
         */
        public int typeCode;

        private DataType(int code){
            this.typeCode = code;
        }

    }
}
