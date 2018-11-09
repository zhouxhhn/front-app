package sunmi.ds.callback;

/**
 * 检查文件结果回调
 * Created by longtao.li on 2016/9/28.
 */
public interface ICheckFileCallback {

    void onCheckFail();

    void onResult(boolean exist);

}
