var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProd = process.env.NODE_ENV === 'production';
var scssDev = ['style-loader','css-loader', 'sass-loader'];
var scssProd = ExtractTextPlugin.extract({
	fallback:'style-loader',
	use:['css-loader', 'sass-loader'],
	publicPath:'/build'
});
var scssConfig = isProd? scssProd: scssDev

var cssDev = [{
			loader: 'style-loader'
		},{
			loader: 'css-loader',
			options: {
				importLoader: 1,
				modules: true,
				localIdentName: '[name]_[local]_[hash:base64:5]'
			}
		}, {
			loader: 'sass-loader'
		}];
var cssProd = ExtractTextPlugin.extract({
	fallback:'style-loader',
	use:[{
			loader: 'css-loader',
			options: {
				importLoader: 1,
				modules: true,
				localIdentName: '[name]_[local]_[hash:base64:5]'
			}
		}, {
			loader: 'sass-loader'
		}],
	publicPath:'/build'
});
var cssConfig = isProd? cssProd: cssDev
console.log('isProd = ', isProd);
module.exports = {
    entry: './src',
    output: {
    	path:path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module:{
		rules:[
			{
				test: /\.scss$/, 
				use:scssConfig
			},
			{
				test:/\.js$/,
				exclude:/node_modules/,
				use:['babel-loader']
			},
			{
				test:/\.css$/,
				exclude:/node_modules/,
				use:cssConfig
			},
			{
				test:/\.(jpe?g|png|svg)$/,
				use:'file-loader?name=[path][name].[ext]&outputPath=images/'
			}
		]
	},
	devServer:{
		contentBase:path.join(__dirname, "build"),
		//compress:true, //gzip
		port:9000,
		hot:true
	},
	plugins:[new HtmlWebpackPlugin({
		title:'Path Draw',
		/*minify:{
			collapseWhitespace:true
		},
		hash:true,*/
		template:'./src/template/index.html'
	}),
	new ExtractTextPlugin( {
		filename: "app.css",
		disable:!isProd
	}),
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NamedModulesPlugin()
	]
};