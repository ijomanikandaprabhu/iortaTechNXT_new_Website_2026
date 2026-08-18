/**
 * Frame loading, isolated from React so it can be reasoned about (and tested)
 * on its own.
 *
 * Decoding happens off the main thread: `fetch` → `Blob` → `createImageBitmap`.
 * createImageBitmap decodes on a browser-internal thread and hands back a
 * GPU-uploadable bitmap, so drawImage never triggers a synchronous decode —
 * that synchronous decode is what makes naive <img>-based scrubbers stutter.
 */

export type FrameStore = {
  bitmaps: Array<ImageBitmap | undefined>;
  loaded: Set<number>;
};

export function createFrameStore(count: number): FrameStore {
  return { bitmaps: new Array(count), loaded: new Set() };
}

export function framePath(dir: string, index: number): string {
  return `${dir}/frame-${String(index).padStart(4, "0")}.webp`;
}

async function decodeFrame(url: string, signal: AbortSignal): Promise<ImageBitmap> {
  const res = await fetch(url, { signal, cache: "force-cache" });
  if (!res.ok) throw new Error(`frame fetch failed: ${res.status} ${url}`);
  const blob = await res.blob();
  return createImageBitmap(blob);
}

/**
 * The nearest frame we can actually draw. Prevents a blank canvas while the
 * sequence is still filling in — we show a close frame instead of nothing.
 */
export function nearestLoaded(store: FrameStore, target: number): number | null {
  if (store.loaded.has(target)) return target;
  if (store.loaded.size === 0) return null;

  for (let radius = 1; radius < store.bitmaps.length; radius++) {
    const before = target - radius;
    const after = target + radius;
    if (before >= 0 && store.loaded.has(before)) return before;
    if (after < store.bitmaps.length && store.loaded.has(after)) return after;
  }
  return null;
}

/**
 * Frames loaded before the sequence is usable: a coarse pass spread across the
 * whole timeline, so any scroll position has something near it immediately,
 * rather than a solid block at the start that leaves the end blank.
 */
export function criticalIndices(count: number, stride = 12): number[] {
  const set = new Set<number>([0, count - 1]);
  for (let i = 0; i < count; i += stride) set.add(i);
  return [...set].sort((a, b) => a - b);
}

type LoadOptions = {
  dir: string;
  count: number;
  store: FrameStore;
  signal: AbortSignal;
  /** Fires as frames land, for the loader UI. */
  onProgress?: (loaded: number, total: number) => void;
  /** Fires once the critical pass is complete and we can start drawing. */
  onCriticalReady?: () => void;
  /** Parallel requests. Kept modest so we never saturate the connection. */
  concurrency?: number;
};

/**
 * Two passes: critical frames first, then everything else in order. Both use a
 * bounded worker pool — unbounded Promise.all on 192 requests stalls the
 * network and delays the frames actually needed first.
 */
export async function loadSequence({
  dir,
  count,
  store,
  signal,
  onProgress,
  onCriticalReady,
  concurrency = 6,
}: LoadOptions): Promise<void> {
  const critical = criticalIndices(count);
  const criticalSet = new Set(critical);
  const rest = Array.from({ length: count }, (_, i) => i).filter((i) => !criticalSet.has(i));

  async function runPool(queue: number[]) {
    let cursor = 0;
    const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
      while (cursor < queue.length) {
        if (signal.aborted) return;
        const index = queue[cursor++]!;
        try {
          const bitmap = await decodeFrame(framePath(dir, index), signal);
          if (signal.aborted) {
            bitmap.close();
            return;
          }
          store.bitmaps[index] = bitmap;
          store.loaded.add(index);
          onProgress?.(store.loaded.size, count);
        } catch {
          // A dropped frame is survivable — nearestLoaded covers the gap.
        }
      }
    });
    await Promise.all(workers);
  }

  await runPool(critical);
  if (signal.aborted) return;
  onCriticalReady?.();
  await runPool(rest);
}

/** Frees GPU memory held by decoded bitmaps. */
export function disposeStore(store: FrameStore): void {
  for (const bitmap of store.bitmaps) bitmap?.close();
  store.bitmaps.length = 0;
  store.loaded.clear();
}
