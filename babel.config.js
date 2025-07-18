module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      ["transform-inline-environment-variables", {
        "include": [
          "API_URL"
        ]
      }]
    ],
  };
};
