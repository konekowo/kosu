/* eslint-disable */

import path from "path";
import { fileURLToPath } from "url";

import { merge } from "webpack-merge";

// plugins
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin from "copy-webpack-plugin";

// recreate __filename / __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (env: { mode: "development" | "production" }) => {
    const config = {
        entry: "./src/index.ts",

        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
        },

        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        "css-loader",
                    ],
                },
                {
                    test: /\.(glsl|vs|fs|vert|frag|wgsl|txt)$/,
                    exclude: /node_modules/,
                    use: ["raw-loader"],
                },
            ],
        },

        optimization: {
            splitChunks: {
                chunks: "all",
            },
        },

        plugins: [
            new HtmlWebpackPlugin({
                title: "kosu!",
                favicon: "assets/favicon.png",
            }),

            new CopyPlugin({
                patterns: [
                    {
                        from: "assets/**",

                        to(pathData) {
                            const assetsPath = path.resolve(__dirname, "assets");

                            if (!pathData.absoluteFilename) {
                                throw new Error();
                            }

                            const endPath =
                                pathData.absoluteFilename.slice(
                                    assetsPath.length
                                );

                            return Promise.resolve(`assets/${endPath}`);
                        },
                    },
                ],
            }),
        ],
    };

    const isDev = env.mode === "development";
    const webpackConfigFile = isDev
        ? "./webpack.dev.ts"
        : "./webpack.prod.ts";

    const envModule = await import(webpackConfigFile);
    const envConfig = envModule.default();

    return merge(config, envConfig);
};