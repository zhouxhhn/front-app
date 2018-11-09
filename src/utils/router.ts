/**
 * parseRoutes
 * @export
 * @param {*} routes rs
 * @returns {*} rs
 */
export function parseRoutes(routes: any[]): any[] {
  const rs: any[] = [];

  /**
   * parse
   * @param {*} r route
   * @param {string} [p=''] path
   * @returns {*} rs
   */
  function parse(r, p = ''): any {
    r.forEach(
      (item): void => {
        const { children, ...itemData } = item;
        const fullpath =
          p +
          (p.charAt(p.length - 1) !== '/' && itemData.path.charAt(0) !== '/'
            ? '/' + itemData.path
            : itemData.path);

        if (item.component) {
          rs.push({
            ...itemData,
            path: fullpath,
          });
        }
        if (children && children.length) {
          parse(children, fullpath);
        }
      }
    );
  }

  parse(routes);

  return rs;
}
