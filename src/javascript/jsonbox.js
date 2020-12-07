import axios from 'axios';

/**
 * Convenience class to invoke operations on the jsonbox API
 */
export default class JsonBox {
    constructor(url, collection = null) {
        this.url = url;
        this.collection = collection;
    }

    async add(data) {
        const resp = await axios.post(this.endpoint, data);
        return resp.data;
    }

    async ofId(id) {
        const resp = await axios.get(this.endpoint + '/' + id);
        return resp.data;
    }

    async all() {
        const resp = await axios.get(this.endpoint);
        return resp.data;
    }

    async update(id, data) {
        await axios.put(this.endpoint + '/' + id, data);
    }

    async delete(id) {
        await axios.delete(this.endpoint + '/' + id);
    }

    get endpoint() {
        return this.url + (this.collection ? '/' + this.collection : '');
    }
}