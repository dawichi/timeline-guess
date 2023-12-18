import { writable, type Writable } from "svelte/store"
import { data, type Card } from "../data/data"

export const initial_data = {
    deck: data,
    cards_copy: [...data],
    board: [] as Card[],
    hand: [] as Card[],
    modal: null as null | 'game over',
}

export type GameData = typeof initial_data
export const gameData: Writable<typeof initial_data> = writable(initial_data)
