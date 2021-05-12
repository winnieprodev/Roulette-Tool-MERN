import * as API from '../api';

export async function login_user(data)
{
    const result = await API.login_user(data);
    return result;
}

export async function user_exist(data)
{
    const result = await API.user_exist(data);
    return result;
}

export async function register_user(data)
{
    const result = await API.register_user(data);
    return result;
}

export async function get_profile(data)
{
    const result = await API.get_profile({user_id: data});
    return result;
}

export async function update_profile(data)
{
    const result = await API.update_profile(data);
    return result;
}

export async function reset_password(data)
{
    const result = await API.reset_password(data);
    return result;
}

export async function upload_avatar(data)
{
    const result = await API.upload_avatar(data);
    return result;
}

export async function user_image(data)
{
    const result = await API.user_image(data);
    return result;
}

export async function get_time()
{
    const result = await API.get_time();
    return result;
}

export async function get_plans()
{
    const result = await API.get_plans();
    return result;
}

export async function get_analytics()
{
    const result = await API.get_analytics();
    return result;
}

export async function get_settings(data)
{
    const result = await API.get_settings(data);
    return result;
}