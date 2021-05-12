import * as API from '../api';

export async function pay(data)
{
    const result = await API.pay(data);
    return result;
}

export async function cancel(data)
{
    const result = await API.cancel(data);
    return result;
}

export async function get_state(data)
{
    const result = await API.get_state(data);
    return result;
}