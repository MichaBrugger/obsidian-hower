import { writable } from 'svelte/store';
import type { Task } from './api/models';

export const focusedTodo = writable()
export const todos = writable([])

export const width = writable(0)
export const height = writable(0)
