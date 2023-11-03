import { post } from "../utilities/api";

export type AuthData = {
    token: string;
    phone: string;
    name: string;
    included;
    user;
    creditChecker;
};
const url = "auth/login";

const signIn = (phone_number: string, otp: string, device_name: string, login_type: string): Promise<AuthData> => {
    // this is a mock of an API call, in a real app
    // will be need connect with some real API,
    // send email and password, and if credential is correct
    //the API will resolve with some token and another datas as the below
    const data = {
        otp: otp,
        phone_number: phone_number,
        device_name: device_name,
        login_type: login_type,
    };
    return post(url, data)
        .then((res) => {
            return res.data.data;
        })
        .catch((err) => {
            return err;
        })
        .finally(() => {});
};

const SignPassword = (phone_number: string, password: string, device_name: string, login_type: string, customer: string): Promise<AuthData> => {
    // this is a mock of an API call, in a real app
    // will be need connect with some real API,
    // send email and password, and if credential is correct
    //the API will resolve with some token and another datas as the below
    const data = {
        password: password,
        phone_number: phone_number,
        device_name: device_name,
        login_type: login_type,
    };
    return post(url, data)
        .then((res) => {
            return res.data.data;
        })
        .catch((err) => {
            if (customer == "old") {
                return undefined;
            } else return err;
            // console.log(err, "errrrrr");

            return err;
        })
        .finally(() => {});
};

export const authService = {
    signIn,
    SignPassword,
};
