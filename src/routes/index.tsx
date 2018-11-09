const Index = require('../containers/index').default;
const Login = require('../containers/login').default;
const Sales = require('../containers/sales').default;
const SalesCheckout = require('../containers/sales-checkout').default;
const SalesPayment = require('../containers/sales-payment').default;
const SalesOrder = require('../containers/sales-order').default;
const SalesRefund = require('../containers/sales-refund').default;
const SalesRefundList = require('../containers/sales-refund-list').default;
const SalesCart = require('../containers/sales-cart').default;
const Purchase = require('../containers/purchase').default;
const PurchaseCheckout = require('../containers/purchase-checkout').default;
const PurchaseOrder = require('../containers/purchase-order').default;
const PurchaseCart = require('../containers/purchase-cart').default;
const Stock = require('../containers/stock').default;
const Setting = require('../containers/setting').default;
const StateMent = require('../containers/statement').default;
const User = require('../containers/user').default;
const UserRole = require('../containers/user-role').default;
const Role = require('../containers/role').default;
const RolePermission = require('../containers/role-permission').default;

export default [
  {
    type: 'local',
    path: '/',
    auth: true,
    component: Index,
    title: '首页',
    menuKey: 'index',
  },
  {
    type: 'local',
    path: '/sales',
    auth: true,
    component: Sales,
    title: '销售',
    menuKey: 'sales',
  },
  {
    type: 'local',
    path: '/sales-cart',
    auth: true,
    component: SalesCart,
    title: '销售购物车',
    menuKey: 'sales',
  },
  {
    type: 'local',
    path: '/sales-order',
    auth: true,
    component: SalesOrder,
    title: '销售订单',
    menuKey: 'sales-order',
  },
  {
    type: 'local',
    path: '/sales-order/:id',
    auth: true,
    component: SalesOrder,
    title: '销售订单详情',
    menuKey: 'sales-order',
  },
  {
    type: 'local',
    path: '/sales-refund/:id',
    auth: true,
    component: SalesRefund,
    title: '销售生成退货',
    menuKey: 'sales-refund',
  },
  {
    type: 'local',
    path: '/sales-refund-list',
    auth: true,
    component: SalesRefundList,
    title: '销售退货单',
    menuKey: 'sales-refund',
  },
  {
    type: 'local',
    path: '/sales-refund-list/:id',
    auth: true,
    component: SalesRefundList,
    title: '销售退货单',
    menuKey: 'sales-refund',
  },
  {
    type: 'local',
    path: '/sales-order/:order/sales-refund',
    auth: true,
    component: SalesRefundList,
    title: '销售退货单',
    menuKey: 'sales-refund',
  },
  {
    type: 'local',
    path: '/sales-order/:order/sales-refund/:id',
    auth: true,
    component: SalesRefundList,
    title: '销售退货单',
    menuKey: 'sales-refund',
  },
  {
    type: 'local',
    path: '/login',
    auth: false,
    component: Login,
    title: '登录',
  },
  {
    type: 'local',
    path: '/checkout',
    auth: true,
    component: SalesCheckout,
    title: '确认订单',
    menuKey: 'sales',
  },
  {
    type: 'local',
    path: '/payment/:no',
    auth: true,
    component: SalesPayment,
    title: '订单支付',
    menuKey: 'sales',
  },
  {
    type: 'local',
    path: '/purchase',
    auth: true,
    component: Purchase,
    title: '采购',
    menuKey: 'purchase',
  },
  {
    type: 'local',
    path: '/purchase-cart',
    auth: true,
    component: PurchaseCart,
    title: '采购购物车',
    menuKey: 'purchase',
  },
  {
    type: 'local',
    path: '/purchase-checkout',
    auth: true,
    component: PurchaseCheckout,
    title: '采购结算',
    menuKey: 'purchase',
  },
  {
    type: 'local',
    path: '/purchase-order',
    auth: true,
    component: PurchaseOrder,
    title: '采购订单',
    menuKey: 'purchase-order',
  },
  {
    type: 'local',
    path: '/purchase-order/:id',
    auth: true,
    component: PurchaseOrder,
    title: '采购订单',
    menuKey: 'purchase-order',
  },
  {
    type: 'local',
    path: '/stock',
    auth: true,
    component: Stock,
    title: '库存',
    menuKey: 'stock',
  },
  {
    type: 'local',
    path: '/setting',
    auth: true,
    component: Setting,
    title: '设置',
    menuKey: 'setting',
  },
  {
    type: 'local',
    path: '/statement',
    auth: true,
    component: StateMent,
    title: '流水',
    menuKey: 'statement',
  },
  {
    type: 'local',
    path: '/user',
    auth: true,
    component: User,
    title: '员工管理',
    menuKey: 'user',
  },
  {
    type: 'local',
    path: '/user/:id/role',
    auth: true,
    component: UserRole,
    title: '绑定角色',
    menuKey: 'user',
  },
  {
    type: 'local',
    path: '/role',
    auth: true,
    component: Role,
    title: '角色管理',
    menuKey: 'role',
  },
  {
    type: 'local',
    path: '/role/:id/permission',
    auth: true,
    component: RolePermission,
    title: '角色权限管理',
    menuKey: 'role',
  },
];
