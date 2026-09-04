// Modern Web Audio engine.
//
// Sounds are fetched once, decoded to AudioBuffers and cached. Every play()
// creates a new AudioBufferSourceNode, so overlapping plays are natively
// supported (no cloneNode tricks). playSound() returns a Promise that
// resolves when the sound has finished playing, so game logic can follow the
// real playback length instead of a fixed delay.

class AudioEngine {
    #ctx = null            // lazy AudioContext (created on first play)
    #buffers = new Map()   // filePath -> AudioBuffer
    #unlocked = false      // set true after the first user gesture
    #pendingLoads = new Map() // filePath -> in-flight decode promise

    constructor() {
        // Browsers block audio until the user has interacted with the page
        // (autoplay policy). Track the first gesture and resume the context.
        const unlock = () => {
            this.#unlocked = true
            this.#ctx?.resume()
        }

        document.addEventListener('pointerdown', unlock, { once: true })
        document.addEventListener('keydown', unlock, { once: true })
        document.addEventListener('touchstart', unlock, { once: true })
    }

    // lazily create the AudioContext (must happen after a gesture on some
    // browsers, so it cannot be created eagerly at module load)
    #getContext() {
        if (!this.#ctx) {
            this.#ctx = new (window.AudioContext || window.webkitAudioContext)()
        }
        return this.#ctx
    }

    // fetch + decode a sound file once, cached in #buffers.
    // concurrent calls for the same file share a single in-flight promise.
    async #load(filePath) {
        if (this.#buffers.has(filePath)) return this.#buffers.get(filePath)
        if (this.#pendingLoads.has(filePath)) return this.#pendingLoads.get(filePath)

        const loadPromise = (async () => {
            const response = await fetch(filePath)
            if (!response.ok) throw new Error(`Audio load failed: ${filePath} (${response.status})`)
            const arrayBuffer = await response.arrayBuffer()
            const buffer = await this.#getContext().decodeAudioData(arrayBuffer)
            this.#buffers.set(filePath, buffer)
            return buffer
        })()

        this.#pendingLoads.set(filePath, loadPromise)
        try {
            return await loadPromise
        } finally {
            this.#pendingLoads.delete(filePath)
        }
    }

    // warm up the cache so the first play has no fetch/decode latency.
    // fire-and-forget: failures are logged but never thrown.
    preload(filePaths) {
        for (const filePath of filePaths) {
            this.#load(filePath).catch(e => console.error("Audio preload error:", e))
        }
    }

    // play a sound and return a Promise<boolean>:
    //   - resolves `true` when playback has finished (ended event)
    //   - resolves `false` when audio is locked (autoplay policy) or the
    //     sound could not be loaded/played
    // A safety cap (buffer duration + 2s) guarantees the promise always
    // resolves even if the ended event never fires.
    async playSound(filePath) {
        if (!this.#unlocked) return false

        try {
            const buffer = await this.#load(filePath)
            const ctx = this.#getContext()
            if (ctx.state === 'suspended') await ctx.resume()

            const source = ctx.createBufferSource()
            source.buffer = buffer
            source.connect(ctx.destination)

            const { promise, resolve } = Promise.withResolvers()

            // safety cap: never wait longer than the buffer duration + 2s
            const cap = AbortSignal.timeout(buffer.duration * 1000 + 2000)

            const finish = (result) => {
                cap.removeEventListener('abort', finish)
                resolve(result)
            }

            source.addEventListener('ended', () => finish(true), { once: true })
            cap.addEventListener('abort', () => finish(true), { once: true })

            source.start()

            return promise
        } catch (e) {
            console.error("Audio error:", e)
            return false
        }
    }

    // play a sound allowing rapid overlapping plays (e.g. countdown ticks).
    // each call creates its own source node, so plays never cut each other.
    // resolves immediately (ticks do not gate game logic).
    async playTickSound(filePath) {
        if (!this.#unlocked) return

        try {
            const buffer = await this.#load(filePath)
            const ctx = this.#getContext()
            if (ctx.state === 'suspended') await ctx.resume()

            const source = ctx.createBufferSource()
            source.buffer = buffer
            source.connect(ctx.destination)
            source.start()
        } catch (e) {
            console.error("Audio error:", e)
        }
    }
}

// singleton - one AudioContext for the whole app
const audioEngine = new AudioEngine()

export const playSound = (filePath) => audioEngine.playSound(filePath)
export const playTickSound = (filePath) => audioEngine.playTickSound(filePath)
export const preloadSounds = (filePaths) => audioEngine.preload(filePaths)
export default audioEngine
