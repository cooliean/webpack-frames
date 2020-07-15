const { MY_PKG, MY_SVC, FOR_IE, PROD,
	min, join, npcdn } = require("./basic");
/* *** file and folder *** */
const buildFolder = "build";
const outputFolder = "dist";
const staticFolder = "static";
const mockApiFolder = "src/mock";
const compileFolder = "src/views";
const templateFile = "src/index.html";
/* *** file merge config *** */
const LIB = {}; // 纯文本拼接,无编译过程
/* "ie.lib.js": ["ie8", "json", "./a.js"],
"layout.css": ["./b.less", "pkg/c.scss",],
"jquery.js": "jquery/dist/jquery.min.js", */
/* *** module entry config *** */
const IPT = {};
/* *** html title config *** */
const title = "";
/* *** html ico config *** */
const ico = "favicon.ico";
/* *** html css resource *** */
const css = [
	!"fa/fa-5.x.min.css",
	"editor/wangeditor.min.css",
	`${npcdn}normalize.css/normalize.min.css`,
	// highlight.js
	!`${npcdn}highlight.js/lib/highlight.min.js`,
	!`${npcdn}highlight.js/styles/atom-one-dark.min.css`,
	!`${npcdn}highlight.js/styles/atom-one-light.min.css`,
	// element-ui
	!`${npcdn}element-ui/lib/index.js`,
	!`${npcdn}element-ui/lib/theme-chalk/index.css`,
	// vant
	!`${npcdn}vant/lib/index.css`,
	!`${npcdn}vant/lib/vant.min.js`,
];
const ie = FOR_IE; const shim = "polyfill";
/* *** html js resource *** */
const js = [
	ie && `${npcdn}@babel/${shim}/dist/${shim}.min.js`,
	`${npcdn}jquery/dist/jquery.min.js`,
	"editor/wangeditor.min.js",
];
/* *** html entry config *** */
const page = ["index"];
/* *** below whole config *** */
const optSelf = {
	buildFolder, outputFolder, staticFolder,
	mockApiFolder, compileFolder, templateFile,
	LIB, IPT, title, ico, css, js, page,
}; // 生产包做静态服务器 MY_SVC=dist npm start
if (!PROD && MY_SVC) {
	optSelf.staticFolder = MY_SVC;
	optSelf.IPT = { fns: "@/utils/fns" };
	delete optSelf.page; // 仅启动静态文件服务
} else if (PROD && MY_PKG) {
	optSelf.IPT = { ...MY_PKG.split(",") };
	delete optSelf.page; // 单独编译一些文件
} // MY_PKG=ms,./a.js,./b.css npm run app
/* *** 开发用本地cdn,生产用外域cdn *** */
LIB[`vue-all${min}.js`] = [
	`vue/dist/vue${min}.js`, `vuex/dist/vuex${min}.js`,
	`vue-router/dist/vue-router${min}.js`,
];
/* *** modify final configuration *** */
optSelf.modify = config => !join(config.externals, {
	vue: "Vue", vuex: "Vuex", "vue-router": "VueRouter",
});
module.exports = optSelf;