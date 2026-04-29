import webpack from "webpack";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

// recreate __filename / __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf-8")
);

export default () => {
    return {
        mode: "production",

        devtool: "source-map",

        module: {
            rules: [
                {
                    // test: /\.(js|jsx|ts|tsx)$/,
                    test: /\.(ts|tsx)$/, // temp fix for imports in config.js
                    use: [
                        {
                            loader: "babel-loader",
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },

        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "game.[contenthash].js",
        },

        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
        },

        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].[contenthash].css",
            }),

            new webpack.DefinePlugin({
                VERSION: JSON.stringify(pkg.version + "-r"),
            }),

            new ESLintPlugin({
                extensions: ["js", "jsx", "ts", "tsx"],
                emitError: true,
                emitWarning: true,
                failOnError: true,
                failOnWarning: true,
            }),

            new webpack.ProgressPlugin(),
        ],
    };
};