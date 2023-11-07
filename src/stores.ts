import { writable } from 'svelte/store';
import type { Task } from './api/models';

export const focusedTodo = writable()
export const todos = writable([])
