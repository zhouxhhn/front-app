declare var appConfig: {
  env: string;
  API_HOST: string;
};
declare module '*.less' {
  var css: any;
  export default css;
}

declare module '*.png' {
  var img: any;
  export default img;
}

declare module '*.json' {
  var json: any;
  export default json;
}
