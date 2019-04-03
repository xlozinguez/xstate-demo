import { actions, MachineConfig, MachineOptions, Machine } from "xstate"
const { assign } = actions

interface IPromptingStateSchema {
    states: {
        displayed: {};
        hidden: {};
    };
}

type IPromptEvent =
    | { type: 'DISMISS_PROMPT' };

interface IPromptContext {
    message: String
}

const promptMachineConfig: MachineConfig<IPromptContext, IPromptingStateSchema, IPromptEvent> = {
    key: 'prompt',
    initial: 'displayed',
    context: {
        message: ''
    },
    states: {
        displayed: {
            on: {
                DISMISS_PROMPT: {
                    target: 'hidden',
                    actions: 'clearMessage'
                }
            }
        },
        hidden: {
            type: 'final'
        },
    }
}

const promptMachineOptions = { //: MachineOptions<IPromptContext, IPromptEvent>
    actions: {
        clearMessage: assign((ctx: IPromptContext) => ({
            message: ''
        })),
    }
};

export default Machine(promptMachineConfig, promptMachineOptions);