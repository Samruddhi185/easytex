import { OpenAI } from 'openai';
import { type NextRequest } from 'next/server'

export class GlobalRef<T> {
    private readonly sym: symbol;

    constructor(uniqueName: string) {
        this.sym = Symbol.for(uniqueName);
    }

    get value() {
        return (global as any)[this.sym] as T;
    }

    set value(value: T) {
        (global as any)[this.sym] = value;
    }
}

const openAiRef = new GlobalRef<OpenAI>('OpenAi');
if (!openAiRef.value) {
    openAiRef.value = new OpenAI(
        {
            apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
            dangerouslyAllowBrowser: true
        }
    );
}

const openai: OpenAI = openAiRef.value;

class AssistantApi {
    private initialPrompt = `You are a latex code generator, directed by the user's prompts. You must return the entire document after modifications.\
 Make sure to not use any external packages except for any required to render math equations. Generate lorem ipsum or random text yourself instead of using the lipsum package.\
 Return plain text code only without backticks`;

    private assistant!: OpenAI.Beta.Assistants.Assistant;
    private thread!: OpenAI.Beta.Threads.Thread;
    private wasSetup = false;

    setup = async (): Promise<void> => {
        if (this.wasSetup) {
            return;
        }

        this.wasSetup = true;

        // this.assistant = await openai.beta.assistants.create({
        //     instructions: this.initialPrompt,
        //     model: 'gpt-4-1106-preview',
        //     name: "LatexJS generator",
        // });
        this.thread = await openai.beta.threads.create();

        // try {
        //     await openai.beta.assistants.del("asst_h4lPP05m45sL5edrG4D8bKoa");
        //     await openai.beta.threads.del("thread_dbUKRYjg0AbSwMoxpw4xqckM");
        // } catch (error) {
        //     console.log("failed to delete assistant, thread", error);
        // }

        // const assistants = await openai.beta.assistants.list();
        // console.log(assistants.data.map(a => a.id));
        // for (const ass of assistants.data.map(a => a.id)) {
        //     if (ass != 'asst_VaIq6SHRggTcoIdNzxAT1XTP') {
        //         const response = await openai.beta.assistants.del(ass);
        //         console.log("delete attempt", response, ass);
        //     }
        // }

        this.assistant = await openai.beta.assistants.retrieve(
            "asst_VaIq6SHRggTcoIdNzxAT1XTP"
        );

        console.log("Assistant", this.assistant);
        // this.thread = await openai.beta.threads.retrieve('thread_KqNan9c4mmRdS6S0D9HtaNAg');
        // console.log("Thread", this.thread);
        let messages = await openai.beta.threads.messages.list(this.thread.id);
        //@ts-ignore
        console.log("messages", messages.data.map(m => m.content[0].text.value));
    }

    getOutput = async (message: string): Promise<any> => {
        const threadMessages = await openai.beta.threads.messages.create(
            this.thread.id,
            { role: "user", content: message }
        );
        console.log("Thread message", threadMessages);

        let run = await openai.beta.threads.runs.create(
            this.thread.id,
            { assistant_id: this.assistant.id }
        );
        
        console.log("run created", run);
        while (run.status != 'completed') {
            await new Promise(r => setTimeout(r, 2000));
            console.log("STATUS" ,run.status);
            run = await openai.beta.threads.runs.retrieve(this.thread.id, run.id);
        }
        let messages = await openai.beta.threads.messages.list(this.thread.id);
        const lastMessageForRun = messages.data
            .filter(
                (message) => message.run_id === run.id && message.role === "assistant"
            )
            .pop();
        
            //@ts-ignore
        console.log("messages", messages.data.map(m => m.content[0].text.value));
        if (lastMessageForRun) {
            // @ts-ignore
            let content =  lastMessageForRun.content[0].text.value;
            console.log("full response", content);
            content = content.substring(content.indexOf("\\documentclass"), content.indexOf("\\end{document}") + "\\end{document}".length);
            return {message: content};
        }
        return {message: ""};
    }
}


const assistantRef = new GlobalRef<AssistantApi>('AssistantApi');
if (!assistantRef.value) {
    assistantRef.value = new AssistantApi();
}

const assistant: AssistantApi = assistantRef.value;

export async function POST(request: NextRequest) {
    const body = await request.json();
    const userInput = body.userInput;
    await assistant.setup();
    const response = await assistant.getOutput(userInput);
    console.log("response is ", response);
    return Response.json(response);
}

export async function GET(request: NextRequest) {
    return Response.json({
        message: "GOT SOMETHING"
    });
}