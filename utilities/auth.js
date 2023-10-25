import * as SecureStore from "expo-secure-store";
async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}
async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    return result;
}

async function remove(key) {
    await SecureStore.deleteItemAsync(key);
}

export default {
    state: {
        api_token: null,
        user_name: null,
        user_id: null,
    },
    initialize() {
        this.state.user_id = getValueFor("user_id");
        this.state.user_name = getValueFor("user_name");
        this.state.api_token = getValueFor("api_token");
    },
    set(data) {
        save("user_name", data.user_name);
        save("api_token", data.api_token);
        save("user_id", data.user_id);
        this.initialize();
    },
    remove() {
        remove("user_id");
        remove("user_name");
        remove("api_token");
        this.initialize();
    },
};
