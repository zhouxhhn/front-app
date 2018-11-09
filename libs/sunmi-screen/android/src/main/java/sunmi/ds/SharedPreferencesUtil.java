package sunmi.ds;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.text.TextUtils;

import com.google.gson.Gson;

import java.lang.reflect.Type;

/**
 * 缓存工具类
 *
 * @author longtao.li
 */
class SharedPreferencesUtil {

    public static final String PREFERENCE_FILE_NAME = "obj_cache"; // 缓存文件名

    private static Gson gson = new Gson();


    /**
     * 读取一个集合对象
     */
    public static Object readObj(Context context, String key, Type type) {

        Object obj = null;
        SharedPreferences pre = context.getSharedPreferences(
                PREFERENCE_FILE_NAME, 0);
        String json = pre.getString(key, "");
        if (TextUtils.isEmpty(json)) {
            return null;
        }

        Object o = gson.fromJson(json, type);
        return o;
    }


    /**
     * 读取一个对象
     */
    public static <T> T readObj(Context context, String key, Class<T> clazz) {
        Object obj = null;
        SharedPreferences pre = context.getSharedPreferences(
                PREFERENCE_FILE_NAME, 0);
        String json = pre.getString(key, "");
        if (TextUtils.isEmpty(json)) {
            return null;
        }

        T t = gson.fromJson(json, clazz);
        return t;
    }

    /**
     * 存储一个对象
     */
    public static <T> void saveObj(Context context, T obj, String key) {
        SharedPreferences spf = context.getSharedPreferences(
                PREFERENCE_FILE_NAME, 0);
        String json = gson.toJson(obj);
        Editor editor = spf.edit();
        editor.putString(key, json);
        editor.apply();
    }

    /**
     * 清除某个key对应的缓存
     */
    public static void clearByKey(String key, Context context) {
        SharedPreferences spf = context.getSharedPreferences(
                PREFERENCE_FILE_NAME, 0);
        Editor editor = spf.edit();
        editor.putString(key, "");
        editor.apply();
    }


}
