import React from 'react';

const API_KEY = '93dbe96ca8fd470ba02ae1e85f22307e';
const CHUNK_SIZE = 5;
const PAGE_CAPACITY = 40;

export default class NewsApi{

    static get CHUNK_SIZE(){
        return CHUNK_SIZE;
    }

    static get PAGE_CAPACITY(){
        return PAGE_CAPACITY;
    }

    static loadSources(){
        const url = `https://newsapi.org/v2/sources?apiKey=${API_KEY}`;
        const request = new Request(url);
        return fetch(request).then(response => response.json())
    }

    static loadRequest(query, sources){
        let url = `https://newsapi.org/v2/${query}&pageSize=${PAGE_CAPACITY}&page=1&apiKey=${API_KEY}`;
        if (sources && sources.length) {
            url += `&sources=${sources.join(',')}`;
        }
        const request = new Request(url);
        return fetch(request).then(response => response.json())
    }
}