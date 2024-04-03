import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class LocalStorageService {

    // Set a key-value pair in local storage
    set(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    // Get the value associated with a key from local storage
    get(key: string): string | null {
        return localStorage.getItem(key);
    }

    // Remove a key-value pair from local storage
    remove(key: string) {
        localStorage.removeItem(key);
    }
}