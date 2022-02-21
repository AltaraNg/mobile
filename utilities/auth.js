export default {
    state: {
        api_token: null,
        user_name: null,
        user_id: null,
        role: null,
    },
    initialize() {
       
        this.state.user_id = parseInt(localStorage.getItem('user_id'));
        this.state.user_name = localStorage.getItem('user_name');
        this.state.api_token = localStorage.getItem('api_token');
        this.state.role = parseInt(localStorage.getItem('role'));
    },
    set(data) {
        localStorage.setItem('user_name', data.user_name);
        localStorage.setItem('api_token', data.api_token);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('role', data.role);
        
        this.initialize()
    },
    remove() {
        localStorage.clear();
        this.initialize()
    }
}
