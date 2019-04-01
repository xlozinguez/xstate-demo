import { actions, MachineConfig, MachineOptions } from "xstate"
const { assign } = actions

interface IFile {
    id: Number
    title: String
    owner: String
    updatedAt: Date
}

interface IAppStateSchema {
    states: {
        browsing: {};
        selecting: {};
        deleting: {};
    };
}

// The events that the machine handles
type IAppEvent =
    | { type: 'SELECT_ITEM', item: IFile }
    | { type: 'SELECT_ALL_ITEMS' }
    | { type: 'DESELECT_ITEM', item: IFile }
    | { type: 'DELETE_SELECTION' }
    | { type: 'SELECTION_DELETED' }
    | { type: 'RESET_SELECTION' };

type IAppEventWithItem = { type: String, item: IFile }

// The context (extended state) of the machine
interface IAppContext {
    items: IFile[]
    selectedItems: IFile[]
}

const initialAppContextItems: IFile[] = [
    {
        id: 0,
        title: 'Summer Photos',
        owner: 'Anthony Stevens',
        updatedAt: new Date(Date.UTC(2017,6,12))
    },
    {
        id: 1,
        title: 'Surfing',
        owner: 'Scott Masterson',
        updatedAt: new Date(Date.UTC(2017,6,16))
    },
    {
        id: 2,
        title: 'Beach Concerts',
        owner: 'Jonathan Lee',
        updatedAt: new Date(Date.UTC(2017,1,16))
    },
    {
        id: 3,
        title: 'Sandcastles',
        owner: 'Aaron Bennett',
        updatedAt: new Date(Date.UTC(2017,5,5))
    },
    {
        id: 4,
        title: 'Boardwalk',
        owner: 'Mary Johnson',
        updatedAt: new Date(Date.UTC(2017,5,1))
    },
    {
        id: 5,
        title: 'Beach Picnics',
        owner: 'Janet Perkins',
        updatedAt: new Date(Date.UTC(2017,4,7))
    }
]

const initialAppContext: IAppContext = {
    items: initialAppContextItems,
    selectedItems: []
}

// Simulated API request
function deleteItems(items: IFile[]) {
    return new Promise((resolve) =>
        setTimeout(() => resolve(`${items.length} items deleted succesfully`), 3000)
    )
};

// App State Machine Config
const appMachineConfig: MachineConfig<IAppContext, IAppStateSchema, IAppEvent> = {
    key: 'app',
    initial: 'browsing',
    context: initialAppContext,
    states: {
        browsing: {
            on: {
                SELECT_ITEM: {
                    target: 'selecting',
                    actions: 'addItemToSelection'
                },
                SELECT_ALL_ITEMS: {
                    target: 'selecting',
                    actions: 'addAllItemsToSelection'
                }
            }
        },
        selecting: {
            on: {
                SELECT_ITEM: {
                    actions: 'addItemToSelection'
                },
                SELECT_ALL_ITEMS: {
                    actions: 'addAllItemsToSelection'
                },
                DESELECT_ITEM: [{
                    target: 'browsing',
                    actions: 'removeItemFromSelection',
                    cond: (ctx) =>( ctx.selectedItems.length === 1) // condition: last item in selection
                }, {
                    actions: 'removeItemFromSelection',
                    cond: (ctx) =>( ctx.selectedItems.length > 1) // condition: still more items selected
                }],
                RESET_SELECTION: {
                    target: 'browsing',
                    actions: 'resetSelection'
                },
                DELETE_SELECTION: {
                    target: 'deleting',
                }
            }
        },
        deleting: {
            invoke:{
                src: (ctx) => deleteItems(ctx.selectedItems),
                onDone: {
                    target: 'browsing',
                    actions: 'resetSelection'
                },
                onError: {
                    target: 'selecting' // No actions for now, but later we might want to display some messaging
                }
            }
        }
    }
}

// App State Machine Options
const appMachineOptions: MachineOptions<IAppContext, IAppEvent> = {
    actions: {
        addItemToSelection: assign((ctx: IAppContext, event: IAppEvent) => ({
            selectedItems: ctx.selectedItems.concat((event as IAppEventWithItem).item)
        })),
        addAllItemsToSelection: assign((ctx: IAppContext) => ({
            selectedItems: ctx.items
        })),
        removeItemFromSelection: assign((ctx: IAppContext, event: IAppEvent) => ({
            selectedItems: ctx.selectedItems.filter((item: IFile) => item.id !== (event as IAppEventWithItem).item.id)
        })),
        resetSelection: assign((_) => ({
            selectedItems: []
        })),
    }
};

export {
    appMachineConfig,
    appMachineOptions
}