import webpack from "webpack";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ESLintPlugin from "eslint-webpack-plugin";

// recreate __filename / __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf-8")
);

export default () => {
    const devConfig = {
        mode: "development",

        devtool: "inline-source-map",

        devServer: {
            open: true,
            client: {
                overlay: {
                    warnings: false,
                    errors: true,
                },
            },
            headers: {
                "Cross-Origin-Opener-Policy": "same-origin",
                "Cross-Origin-Embedder-Policy": "require-corp",
            },
        },

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },

        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].js",
        },

        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].css",
            }),

            new ESLintPlugin({
                extensions: ["js", "jsx", "ts", "tsx"],
                emitError: true,
                emitWarning: true,
                failOnError: false,
                failOnWarning: false,
            }),

            new webpack.DefinePlugin({
                VERSION: JSON.stringify(pkg.version + "-d"),
            }),
        ],
    };

    return devConfig;
};