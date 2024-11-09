export default class Queue {
    constructor(handler) {
        this.queue = []
        this.handler = handler
        this.isProcessing = false
    }

    enqueue(item) {
        this.queue.push(item)
        this.process()
    }

    async process() {
        if (this.isProcessing) return
        this.isProcessing = true

        while (this.queue.length) {
            const item = this.queue.shift()
            await this.handler(item)
        }

        this.isProcessing = false
    }

    empty() {
        this.queue = []
    }
}
