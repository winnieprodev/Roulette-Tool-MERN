import * as API from '../api';

export async function new_page(data)
{
    const result = await API.new_page({user_id: data});
    return result;
}

export async function save_page(data)
{
    const result = await API.save_page(data);
    return result;
}

export async function get_page(data)
{
    const result = await API.get_page(data);
    return result;
}

export async function get_pages(data)
{
    const result = await API.get_pages(data);
    return result;
}

export async function get_histories(data)
{
    const result = await API.get_histories(data);
    return result;
}

export async function delete_page(data)
{
    const result = await API.delete_page(data);
    return result;
}

export async function save_name(data)
{
    const result = await API.save_name(data);
    return result;
}

export async function save_rating(data)
{
    const result = await API.save_rating(data);
    return result;
}

export async function upload_dealer(data)
{
    const result = await API.upload_dealer(data);
    return result;
}

export async function dealer_image(data)
{
    const result = await API.dealer_image(data);
    return result;
}

export async function new_videoembedcode(data)
{
    const result = await API.new_videoembedcode(data);
    return result;
}

export async function get_videos(data)
{
    const result = await API.get_videos(data);
    return result;
}

export async function get_video(data)
{
    const result = await API.get_video(data);
    return result;
}

export async function delete_video(data)
{
    const result = await API.delete_video(data);
    return result;
}

export async function update_video(data)
{
    const result = await API.update_video(data);
    return result;
}

export async function thumbnail_image(data)
{
    const result = await API.thumbnail_image(data);
    return result;
}