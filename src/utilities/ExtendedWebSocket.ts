/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
interface WebSocketEvents {
    open: []
    close: [code: number, reason: string];
    error: [error: Error];
    // message: [message: string | ArrayBuffer];
    message: [message: WebSocketMessage];
}

enum WebSocketCodes {
    HELLO = 0,
    IDENTIFY = 1,
    HEARTBEAT = 2,
    HEARTBEAT_ACK = 3,
    ERROR = 4
}

interface WebSocketMessage {
    type: WebSocketCodes;
    data?: Record<string, unknown>;
    error?: number;
    id?: string;
}

class ExtendedWebSocket {
    url: string | URL;
    socket?: WebSocket;
    listeners: Record<keyof WebSocketEvents, ((...data: WebSocketEvents[keyof WebSocketEvents]) => void)[]> = {
        open: [],
        close: [],
        error: [],
        message: []
    };
    idStore: string[] = [];
    queue: WebSocketMessage[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    openPromise?: [(value: void | PromiseLike<void>) => void, (reason: any) => void];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    waitingPromises: Record<string, [(value: WebSocketMessage | PromiseLike<WebSocketMessage>) => void, (reason: any) => void]> = {};
    closed = false;
    interval?: number;
    reconnect: boolean;
    manuallyClosed = false;
    constructor(url: string | URL, options?: { reconnect?: boolean }) {
        this.url = url;
        this.reconnect = options?.reconnect ?? false;
    }
    protected onOpen(event: Event) {
        this.interval = setInterval(() => {
            this.send({ type: WebSocketCodes.HEARTBEAT });
        }, 10000);
        const id = this.idStore.length && this.idStore.shift();
        if (id) {
            this.send({ id, type: WebSocketCodes.IDENTIFY, data: { token: "" } });
            new Promise<WebSocketMessage>((resolve, reject) => {
                this.waitingPromises[id] = [resolve, reject];
            }).then(() => this.openPromise?.[0]()).catch(e => this.openPromise?.[1](e));
        }
        else this.openPromise?.[1](new Error("Unexpected error: No id available"));
    }
    protected onMessage(event: MessageEvent) {
        const message = JSON.parse(event.data as string) as WebSocketMessage;
        if (message.type === WebSocketCodes.HEARTBEAT_ACK) return;
        if (message.type === WebSocketCodes.HELLO) {
            if (message.data?.ids && message.data.ids instanceof Array)
                for (const x of message.data.ids)
                    this.idStore.push(x);
            return;
        }
        if (message.id) {
            const promise = this.waitingPromises[message.id];
            if (promise) {
                if (message.type === WebSocketCodes.ERROR)
                    promise[1](new Error(`Error ${message.error}: ${message.data?.message}`));
                else
                    promise[0](message);
                delete this.waitingPromises[message.id];
            }
        } else {
            this.emit("message", message);
        }
    }
    protected onError(event: Event) {
        this.emit("error", new Error(event.toString()));
    }
    protected onClose(event: CloseEvent) {
        clearInterval(this.interval);
        this.queue = [];
        this.socket = undefined;
        this.waitingPromises = {};
        this.idStore = [];
        this.closed = true;
        this.emit("close", event.code, event.reason);

        if (this.reconnect && !this.manuallyClosed) {
            setTimeout(() => {
                this.connect();
            }, 5000);
        }
    }
    emit<E extends keyof WebSocketEvents>(event: E, ...data: WebSocketEvents[E]) {
        this.listeners[event].forEach(listener => listener(...data));
    }
    on<E extends keyof WebSocketEvents>(event: E, listener: (...data: WebSocketEvents[E]) => void) {
        this.listeners[event].push(listener as (...data: WebSocketEvents[keyof WebSocketEvents]) => void);
    }
    send(data: WebSocketMessage) {
        this.queue.push(data);
    }
    async request(data: WebSocketMessage) {
        return await new Promise<WebSocketMessage>((resolve, reject) => {
            const id = this.idStore.length && this.idStore.shift();
            if (id) {
                data.id = id;
                this.waitingPromises[data.id] = [resolve, reject];
            } else {
                reject(new Error("Unexpected error: No id available"));
            }
        });
    }
    async connect() {
        this.socket = new WebSocket(this.url);
        this.socket.binaryType = "arraybuffer";
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        return await new Promise<void>((resolve, reject) => {
            this.openPromise = [resolve, reject];
        }).then(() => this.emit("open"));
    }
    destroy() {
        this.socket?.close();
        this.manuallyClosed = true;
    }
}

export default ExtendedWebSocket;
