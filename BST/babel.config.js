const presets = [
  [
    "@babel/preset-typescript",
    "@babel/env",
    {
      targets: {
        node: true
      },
      useBuiltIns: "usage",
    },
  ],
];
const plugins = ["@babel/plugin-proposal-optional-chaining"];
module.exports = { presets, plugins };
