/**
 * loadScript
 *
 * @param {*} url url
 * @param {*} v v
 * @returns {*} *
 */
function loadScript(url): any {
  return new Promise(function(resolve, reject) {
    try {
      var script = document.createElement('script');
      script.setAttribute('charset', 'UTF-8');
      script.setAttribute('async', 'async');
      script.src = url;
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(script, s);
      script.onerror = reject;
      script.onload = resolve;
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

/**
 * 初始化打印服务
 * initLodop
 * @param {string} ip IP地址
 * @param {string} name 服务名称
 * @returns {object} {CLODOP, printerOptions}
 */
async function initLodop(ip, name): Promise<any> {
  try {
    await loadScript(`http://${ip}:8000/CLodopfuncs.js?name=${name}`);
    // Toast.success('加载Lodop打印服务成功!');

    const CLodop: any = window[name];
    const selectNode = document.createElement('select');
    CLodop.Create_Printer_List(selectNode);
    const optionNodes = selectNode.childNodes;
    const printerOptions = [];
    Array.prototype.forEach.call(optionNodes, item => {
      printerOptions.push({ label: item.innerHTML, value: item.value });
    });

    return {
      CLodop,
      printerOptions,
    };
  } catch (err) {
    console.error(err);
    // Toast.fail(`加载服务失败, 请检查绑定IP(${ip})的打印主机的Lodop打印服务`);

    return {
      CLodop: null,
      printerOptions: [],
      error: err,
    };
  }
}

export default initLodop;
