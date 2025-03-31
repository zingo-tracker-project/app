import {atom, selector} from 'recoil'

export const bigTodosAtom = atom({
    key : 'bigTodosAtom',
    default: []
})

export const testAtom = atom({
    key : 'testAtom',
    default: false
})

export const testSelector = selector({
    key : 'testSelector',
    get : ({get}) => {
        const test = get(testAtom)

        return test ? true : false
    }
})