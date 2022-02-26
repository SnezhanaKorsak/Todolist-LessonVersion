import {appReducer, setAppStatus, setAppError, RequestStatusType} from './app-reducer'

type InitialStateType = {
    error: string | null,
    status: RequestStatusType,
    isInitialized: boolean
}
let startState: InitialStateType;

beforeEach(() => {
    startState = {
        error: null,
        status: 'idle',
        isInitialized: false
    }
})

test('correct error message should be set', () => {

    const endState = appReducer(startState, setAppError({error: 'some error'}))

    expect(endState.error).toBe('some error');
})

test('correct status should be set', () => {

    const endState = appReducer(startState, setAppStatus({status: 'loading'}))

    expect(endState.status).toBe('loading');
})

