export default class Queue {
    constructor(handler) {
        this.queue = []
        this.handler = handler
        this.isProcessing = false
    }

    enqueue(item) {
        console.log("enqueueing item:", item)
        this.queue.push(item)
        this.process()
    }

    async process() {
        if (this.isProcessing) return
        this.isProcessing = true

        while (this.queue.length) {
            const item = this.queue.shift()
            console.log("processing item:", item)
            await this.handler(item)
            console.log("processed item:", item)

        }

        this.isProcessing = false
    }

    empty() {
        this.queue = []
    }
}