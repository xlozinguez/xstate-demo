import { actions, MachineConfig, MachineOptions } from "xstate"
const { assign } = actions

interface IPromptingStateSchema {
    states: {
        hidden: {};
        displayed: {};
    };
}

type IPromptEvent =
    | { type: 'DISPLAY_PROMPT', message: String }
    | { type: 'HIDE_PROMPT' };


type IPromptEventWithMessage = { type: String, message: String }

interface IPromptContext {
    message: String
}

const promptMachineConfig: MachineConfig<IPromptContext, IPromptingStateSchema, IPromptEvent> = {
    key: 'prompt',
    initial: 'hidden',
    context: {
        message: ''
    },
    states: {
        hidden: {
            on: {
                DISPLAY_PROMPT: {
                    target: 'displayed',
                    actions: 'updateMessage'
                }
            }
        },
        displayed: {
            on: {
                HIDE_PROMPT: {
                    target: 'hidden',
                    actions: 'clearMessage'
                }
            }
        }
    }
}

const promptMachineOptions: MachineOptions<IPromptContext, IPromptEvent> = {
    actions: {
        updateMessage: assign((ctx: IPromptContext, event: IPromptEvent) => ({
            message: (event as IPromptEventWithMessage).message
        })),
        clearMessage: assign((ctx: IPromptContext) => ({
            message: ''
        })),
    }
};

export { promptMachineConfig, promptMachineOptions }