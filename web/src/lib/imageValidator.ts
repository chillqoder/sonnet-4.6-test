class Semaphore {
  private permits: number;
  private queue: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return;
    }
    return new Promise(resolve => this.queue.push(resolve));
  }

  release(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift()!;
      next();
    } else {
      this.permits++;
    }
  }
}

const semaphore = new Semaphore(8);

function validateImage(url: string, timeoutMs = 8000): Promise<'valid' | 'broken'> {
  return new Promise(resolve => {
    const img = new Image();
    let done = false;

    const timer = setTimeout(() => {
      if (!done) {
        done = true;
        resolve('broken');
      }
    }, timeoutMs);

    img.onload = () => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve('valid');
      }
    };

    img.onerror = () => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve('broken');
      }
    };

    img.src = url;
  });
}

export async function validateImageConcurrently(url: string): Promise<'valid' | 'broken'> {
  await semaphore.acquire();
  try {
    return await validateImage(url);
  } finally {
    semaphore.release();
  }
}
