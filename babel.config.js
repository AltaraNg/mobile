<<<<<<< HEAD
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["module:metro-react-native-babel-preset", 'babel-preset-expo'],
    env: {
      production: {
        plugins: ['react-native-paper/babel']
      }
    },
    plugins: ["react-native-reanimated/plugin"],
  };
=======
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
>>>>>>> fa571561f48eb7d12fc4db7f5f113255a7646528
};
