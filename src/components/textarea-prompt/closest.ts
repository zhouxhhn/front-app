/**
 * closest
 * https://github.com/ant-design/ant-design-mobile/blob/6d4c83d8b9322391b6c59018b7214ab63bffe7b2/components/_util/closest.tsx
 * @param {*} el el
 * @param {*} selector selector
 * @returns {*} any
 */
export default function closest(el: Element, selector: string): any {
  const anyEl: any = el;
  const matchesSelector =
    anyEl.matches ||
    anyEl.webkitMatchesSelector ||
    anyEl.mozMatchesSelector ||
    anyEl.msMatchesSelector;
  let p: Element | null = el;
  while (p) {
    if (matchesSelector.call(p, selector)) {
      return p;
    }
    p = p.parentElement;
  }

  return null;
}
