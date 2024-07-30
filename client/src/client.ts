let baseHostUrl = 'http://localhost:3001/api';


// eslint-disable-next-line no-restricted-globals
if (location.hostname === 'localhost:3000') {
    baseHostUrl = 'http://localhost:3001/api';
    console.log('Running locally');
}

export const getItems = async () => {
    return await fetch(`${baseHostUrl}/items`);
}

export const addItem = async (description: string) => {
    return await fetch(`${baseHostUrl}/items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: description })
    });
}

export const deleteItem = async (id: number) => {
    return await fetch(`${baseHostUrl}/items/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    });
}
