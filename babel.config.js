module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["module:metro-react-native-babel-preset", "babel-preset-expo"],
        env: {
            production: {
                plugins: ["react-native-paper/babel"],
            },
        },
        plugins: ["react-native-reanimated/plugin"],
    };
};
