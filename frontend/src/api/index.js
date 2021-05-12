import axios from 'axios';
import config from '../config';

const APIUrl = config.server.APIUrl;

// User Management
export const login_user = (data) => axios({
    url: APIUrl + "api/user/login",
    method: "GET",
    params: data,
    CORS: true
})

export const user_exist = (data) => axios({
    url: APIUrl + "api/user/user_exist",
    method: "GET",
    params: data,
    CORS: true
})

export const register_user = (data) => axios({
    url: APIUrl + "api/user/register",
    method: "POST",
    data: data,
    CORS: true
})

export const get_profile = (data) => axios({
    url: APIUrl + "api/user/get_profile",
    method: "GET",
    params: data,
    CORS: true
})

export const update_profile = (data) => axios({
    url: APIUrl + "api/user/update_profile",
    method: "PUT",
    data: data,
    CORS: true
})

export const reset_password = (data) => axios({
    url: APIUrl + "api/user/reset_password",
    method: "PUT",
    data: data,
    CORS: true
})

export const upload_avatar = (data) => axios({
    url: APIUrl + "api/user/upload_avatar",
    method: "PUT",
    data: data,
    CORS: true
})

// Page Management
export const new_page = (data) => axios({
    url: APIUrl + "api/page/new_page",
    method: "POST",
    data: data,
    CORS: true
})

export const save_page = (data) => axios({
    url: APIUrl + "api/page/save_page",
    method: "PUT",
    data: data,
    CORS: true
})

export const get_page = (data) => axios({
    url: APIUrl + "api/page/get_page",
    method: "GET",
    params: data,
    CORS: true
})

export const get_pages = (data) => axios({
    url: APIUrl + "api/page/get_pages",
    method: "GET",
    params: data,
    CORS: true
})

export const get_histories = (data) => axios({
    url: APIUrl + "api/page/get_histories",
    method: "GET",
    params: data,
    CORS: true
})

export const delete_page = (data) => axios({
    url: APIUrl + "api/page/delete_page",
    method: "DELETE",
    data: data,
    CORS: true
})

export const save_name = (data) => axios({
    url: APIUrl + "api/page/save_name",
    method: "PUT",
    data: data,
    CORS: true
})

export const save_rating = (data) => axios({
    url: APIUrl + "api/page/save_rating",
    method: "PUT",
    data: data,
    CORS: true
})

export const upload_dealer = (data) => axios({
    url: APIUrl + "api/page/upload_dealer",
    method: "PUT",
    data: data,
    CORS: true
})

// Upload Image
export const user_image = (data) => axios({
    url: APIUrl + "api/user_image",
    method: "POST",
    data: data,
    headers: {
        "content-type": "multipart/form-data",
    },
    CORS: true
})

export const dealer_image = (data) => axios({
    url: APIUrl + "api/dealer_image",
    method: "POST",
    data: data,
    headers: {
        "content-type": "multipart/form-data",
    },
    CORS: true
})

export const get_time = () => axios({
    url: APIUrl + "api/get_time",
    method: "POST",
    CORS: true
})

// Payment management
export const pay = (data) => axios({
    url: APIUrl + "api/payment/pay",
    method: "POST",
    data: data,
    CORS: true
})

export const cancel = (data) => axios({
    url: APIUrl + "api/payment/cancel",
    method: "POST",
    data: data,
    CORS: true
})

export const get_state = (data) => axios({
    url: APIUrl + "api/payment/get_state",
    method: "GET",
    params: data,
    CORS: true
})

export const get_plans = () => axios({
    url: APIUrl + "api/user/get_plans",
    method: "GET",
    CORS: true
})

export const get_analytics = () => axios({
    url: APIUrl + "api/user/get_analytics",
    method: "GET",
    CORS: true
})

// Video Embed
export const new_videoembedcode = (data) => axios({
    url: APIUrl + "api/page/new_videoembedcode",
    method: "POST",
    data: data,
    CORS: true
})

export const get_videos = (data) => axios({
    url: APIUrl + "api/page/get_videos",
    method: "GET",
    params: data,
    CORS: true
})

export const get_video = (data) => axios({
    url: APIUrl + "api/page/get_video",
    method: "GET",
    params: data,
    CORS: true
})

export const delete_video = (data) => axios({
    url: APIUrl + "api/page/delete_video",
    method: "DELETE",
    data: data,
    CORS: true
})

export const update_video = (data) => axios({
    url: APIUrl + "api/page/update_video",
    method: "PUT",
    data: data,
    CORS: true
})

export const get_settings = (data) => axios({
    url: APIUrl + "api/user/get_settings",
    method: "GET",
    params: data,
    CORS: true
})

export const thumbnail_image = (data) => axios({
    url: APIUrl + "api/thumbnail_image",
    method: "POST",
    data: data,
    headers: {
        "content-type": "multipart/form-data",
    },
    CORS: true
})